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

    // API request to Gemini
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `I have two Islamic narration chains (Isnad) in Arabic that I want to merge.
  
            Original Chain: "${cleanedOriginal}"
            Second Chain: "${cleanedNew}"
            
            Analyze both chains and create a merged chain. Return a JSON object with:
            {
              "narrators": ["all unique narrators from both chains"],
              "transmissions": ["all transmission types used"]
            }
            
            Only respond with the JSON object, no other text.`
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
