import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Hard-coded API Key for Gemini
const API_KEY = "AIzaSyD0hWyODxnEjjCQwu9jwlqUll9R4LGqOxU";

async function parseNarrationChain(chain: string) {
  try {
    // Remove punctuation from chain
    const cleanedText = chain.replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, '');

    // API request to Gemini
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `Given this Arabic hadith chain: "${cleanedText}", extract:
            1. The narrators in order
            2. The transmission types between them
            Respond only with a JSON object containing "narrators" (array) and "transmissions" (array).`
          }]
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed (${response.status})`);
    }

    const data = await response.json();
    const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!responseText) {
      throw new Error('No text found in Gemini response');
    }
    
    try {
      // Extract JSON from text
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in Gemini response');
      }
      
      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Failed to parse Gemini response:', responseText);
      const errorMsg = error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to parse Gemini response: ${errorMsg}`);
    }
  } catch (error) {
    console.error("Error in parseNarrationChain:", error);
    throw error;
  }
}

async function mergeNarrationChains(originalChain: string, newChain: string) {
  try {
    // Clean the chains
    const cleanedOriginal = originalChain.replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, '');
    const cleanedNew = newChain.replace(/[^a-zA-Z0-9\u0600-\u06FF\s]/g, '');
    
    // First analyze each chain separately to get the structure
    const originalChainResult = await parseNarrationChain(originalChain);
    const newChainResult = await parseNarrationChain(newChain);
    
    // Create a merged list of narrators (using filter instead of Set for compatibility)
    const allNarrators = [...originalChainResult.narrators, ...newChainResult.narrators].filter(
      (narrator, index, self) => self.indexOf(narrator) === index
    );
    
    // Create a merged list of transmissions (using filter instead of Set for compatibility)
    const allTransmissions = [...originalChainResult.transmissions, ...newChainResult.transmissions].filter(
      (transmission, index, self) => self.indexOf(transmission) === index
    );
    
    // Create connections array for our structure
    type Connection = { from: string; to: string; type: string };
    const connections: Connection[] = [];
    
    // First, find common narrators between the chains (for merging points)
    const commonNarrators = originalChainResult.narrators.filter(
      (narrator: string) => newChainResult.narrators.includes(narrator)
    );
    
    // Define types for narrator relationships
    type NarratorRelation = { narrator: string; type: string };
    type NarratorNode = { parents: NarratorRelation[]; children: NarratorRelation[] };
    
    // Create a map to store each narrator's parents (narrators that teach them)
    // and children (narrators they teach)
    const narratorMap = new Map<string, NarratorNode>();
    
    // Initialize the map with all narrators
    for (const narrator of allNarrators) {
      narratorMap.set(narrator, { parents: [], children: [] });
    }
    
    // Add parent-child relationships from the original chain
    for (let i = 0; i < originalChainResult.narrators.length - 1; i++) {
      const parent = originalChainResult.narrators[i];
      const child = originalChainResult.narrators[i + 1];
      const type = originalChainResult.transmissions[i] || "عن";
      
      // Add the child to the parent's children list
      const parentNode = narratorMap.get(parent);
      if (parentNode && !parentNode.children.find((c: NarratorRelation) => c.narrator === child)) {
        parentNode.children.push({ narrator: child, type });
      }
      
      // Add the parent to the child's parents list
      const childNode = narratorMap.get(child);
      if (childNode && !childNode.parents.find((p: NarratorRelation) => p.narrator === parent)) {
        childNode.parents.push({ narrator: parent, type });
      }
    }
    
    // Add parent-child relationships from the new chain
    for (let i = 0; i < newChainResult.narrators.length - 1; i++) {
      const parent = newChainResult.narrators[i];
      const child = newChainResult.narrators[i + 1];
      const type = newChainResult.transmissions[i] || "عن";
      
      // Add the child to the parent's children list
      const parentNode = narratorMap.get(parent);
      if (parentNode && !parentNode.children.find((c: NarratorRelation) => c.narrator === child)) {
        parentNode.children.push({ narrator: child, type });
      }
      
      // Add the parent to the child's parents list
      const childNode = narratorMap.get(child);
      if (childNode && !childNode.parents.find((p: NarratorRelation) => p.narrator === parent)) {
        childNode.parents.push({ narrator: parent, type });
      }
    }
    
    // Now create the connections from the merged narrator map
    // Convert the Map.entries() to an array to avoid iteration issues
    Array.from(narratorMap.entries()).forEach(([narrator, relations]) => {
      for (const child of relations.children) {
        connections.push({
          from: narrator,
          to: child.narrator,
          type: child.type
        });
      }
    });
    
    // Return the merged result with structure
    return {
      narrators: allNarrators,
      transmissions: allTransmissions,
      structure: {
        root: originalChainResult.narrators[0], // Use the first narrator from original chain as root
        connections: connections
      }
    };
  } catch (error) {
    console.error("Error in mergeNarrationChains:", error);
    throw error;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // API route for analyzing narration chain
  app.post('/api/analyze', async (req: Request, res: Response) => {
    try {
      const { narrationChain } = req.body;
      
      if (!narrationChain) {
        return res.status(400).json({ message: 'Narration chain is required' });
      }
      
      const analysis = await parseNarrationChain(narrationChain);
      return res.status(200).json(analysis);
    } catch (error) {
      console.error('Error analyzing narration chain:', error);
      return res.status(500).json({ message: 'Failed to analyze narration chain' });
    }
  });
  
  // API route for merging narration chains
  app.post('/api/merge', async (req: Request, res: Response) => {
    try {
      const { originalChain, newChain } = req.body;
      
      if (!originalChain || !newChain) {
        return res.status(400).json({ message: 'Both original and new narration chains are required' });
      }
      
      const mergedAnalysis = await mergeNarrationChains(originalChain, newChain);
      return res.status(200).json(mergedAnalysis);
    } catch (error) {
      console.error('Error merging narration chains:', error);
      return res.status(500).json({ message: 'Failed to merge narration chains' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
