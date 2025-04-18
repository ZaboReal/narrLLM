import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from "@google/generative-ai";

// Initialize Google Generative AI with API key
const API_KEY = "AIzaSyD0hWyODxnEjjCQwu9jwlqUll9R4LGqOxU";
const genAI = new GoogleGenerativeAI(API_KEY);

async function parseNarrationChain(chain: string) {
  // Configure the generative model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  // Set safety settings to allow Arabic content
  const generationConfig = {
    temperature: 0.2,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  };
  
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ];

  // Prompt for the AI to parse the narration chain
  const prompt = `
  Parse the following Islamic narration chain (Isnad) in Arabic into its component narrators and transmission types.
  
  Narration chain: "${chain}"
  
  Return a JSON object with the following structure:
  {
    "narrators": ["list of all narrators in order"],
    "transmissionTypes": ["list of transmission types between narrators"],
    "structure": {
      "root": "the first narrator (usually the companion)",
      "connections": [
        {"from": "narrator1", "to": "narrator2", "type": "transmission type"}
      ]
    }
  }
  
  For example, if the chain is "مالك عن نافع عن ابن عمر", the output should be:
  {
    "narrators": ["ابن عمر", "نافع", "مالك"],
    "transmissionTypes": ["عن", "عن"],
    "structure": {
      "root": "ابن عمر",
      "connections": [
        {"from": "ابن عمر", "to": "نافع", "type": "عن"},
        {"from": "نافع", "to": "مالك", "type": "عن"}
      ]
    }
  }
  
  Only respond with the JSON structure, no additional text.
  `;

  // Generate content
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig,
    safetySettings,
  });

  const response = result.response;
  const text = response.text();
  
  try {
    // Extract JSON from text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : text;
    
    // Parse the JSON string to object
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing AI response:", error);
    console.log("Raw AI response:", text);
    throw new Error("Failed to parse the narration chain");
  }
}

async function mergeNarrationChains(originalChain: string, newChain: string) {
  // Configure the generative model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const generationConfig = {
    temperature: 0.2,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 1024,
  };
  
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ];

  // Prompt for the AI to merge the narration chains
  const prompt = `
  I have two Islamic narration chains (Isnad) in Arabic that I want to merge into a single structure.
  
  Original Chain: "${originalChain}"
  Second Chain: "${newChain}"
  
  Analyze both chains and merge them into a single structure. Identify common narrators and create a graph showing all unique paths.
  
  Return a JSON object with the following structure:
  {
    "narrators": ["list of all unique narrators in both chains"],
    "transmissionTypes": ["list of all transmission types"],
    "structure": {
      "root": "the first common narrator (usually the companion)",
      "connections": [
        {"from": "narrator1", "to": "narrator2", "type": "transmission type"}
      ]
    }
  }
  
  For example, if the chains are "مالك عن نافع عن ابن عمر" and "مالك عن سالم عن ابن عمر", the output should show both paths from ابن عمر to مالك.
  
  Only respond with the JSON structure, no additional text.
  `;

  // Generate content
  const result = await model.generateContent({
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig,
    safetySettings,
  });

  const response = result.response;
  const text = response.text();
  
  try {
    // Extract JSON from text
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : text;
    
    // Parse the JSON string to object
    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing AI response:", error);
    console.log("Raw AI response:", text);
    throw new Error("Failed to merge the narration chains");
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
