import { apiRequest } from './queryClient';
import { HadithChain } from './types';

// Google Gemini API integration
const API_KEY = "add here";

export async function analyzeNarrationChain(narrationChain: string): Promise<HadithChain> {
  try {
    const response = await apiRequest('POST', '/api/analyze', { narrationChain });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in analyzeNarrationChain:', error);
    throw error;
  }
}

export async function mergeNarrationChains(originalChain: string, newChain: string): Promise<HadithChain> {
  try {
    const response = await apiRequest('POST', '/api/merge', { 
      originalChain, 
      newChain 
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error in mergeNarrationChains:', error);
    throw error;
  }
}
