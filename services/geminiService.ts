import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { MnemonicSystem } from '../types';

const getSystemPrompt = (system: MnemonicSystem, number: string): string => {
  switch (system) {
    case MnemonicSystem.Major:
      return `Generate a single, common, and memorable English word for the number ${number} using the Major System rules (0=s/z, 1=t/d, 2=n, 3=m, 4=r, 5=l, 6=j/sh/ch, 7=k/g, 8=f/v, 9=p/b). Vowels are free.`;
    case MnemonicSystem.Dominic:
      return `Generate a famous person and a simple action for the number ${number} using the Dominic System (1=A, 2=B, 3=C, 4=D, 5=E, 6=S, 7=G, 8=H, 9=N, 0=O). For example, 15 could be AE -> Albert Einstein. Give me a person and an action.`;
    case MnemonicSystem.NumberRhyme:
      return `Generate a simple, memorable rhyming phrase for the number ${number}. For example, for '1', you could suggest 'a bun'.`;
    case MnemonicSystem.NumberShape:
      return `Describe a simple, memorable image based on the shapes of the digits in the number ${number}. For example, for '2', you could suggest 'a swan'.`;
    default:
      return `Give me a creative way to remember the number ${number}.`;
  }
};

export const validateMnemonicAnswer = async (system: MnemonicSystem, number: string, answer: string): Promise<boolean> => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.warn("API_KEY environment variable not set. Using mock validation.");
        return answer.trim().length > 0;
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = `Using the ${system}, is "${answer}" a correct and common mnemonic association for the number ${number}? Vowels are free and don't count in systems like the Major system. Answer with only "YES" or "NO".`;

        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                temperature: 0.1,
                thinkingConfig: { thinkingBudget: 0 },
            },
        });
        
        const text = response.text.trim().toUpperCase();
        return text.includes('YES');

    } catch (error) {
        console.error(`Error validating answer with Gemini for number ${number}:`, error);
        return answer.trim().length > 0;
    }
};

export const getMnemonicHint = async (system: MnemonicSystem, number: string): Promise<string> => {
  // This check is important because process.env is not available in all client-side environments.
  // In a real application, you'd handle this more robustly, likely by calling a backend server
  // that securely stores and uses the API key. For this example, we'll proceed assuming it might exist.
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API_KEY environment variable not set. Returning a mock hint.");
    return `A clever hint for ${number}.`;
  }
  
  try {
    const ai = new GoogleGenAI({ apiKey });
    const prompt = getSystemPrompt(system, number);
    
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
       config: {
        // Disable thinking for low latency hint generation
        thinkingConfig: { thinkingBudget: 0 },
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) {
        throw new Error("No text returned from Gemini API.");
    }

    return text.trim();
  } catch (error) {
    console.error(`Error fetching hint from Gemini for number ${number}:`, error);
    throw new Error("Failed to generate hint.");
  }
};