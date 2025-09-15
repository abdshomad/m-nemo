import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { MnemonicSystem } from '../types';

const getSystemPrompt = (system: MnemonicSystem, number: string): string => {
  const basePrompt = `You are an expert mnemonic coach providing a concise, actionable hint. Be creative but keep it simple and common.`;
  switch (system) {
    case MnemonicSystem.Major:
      return `${basePrompt} Give a hint for the number ${number} using the Major System. First, list the consonant sounds for each digit (0=s/z, 1=t/d, 2=n, 3=m, 4=r, 5=l, 6=j/sh, 7=k/g, 8=f/v, 9=p/b). Then, suggest one common English word that fits. For example, for 42, you would suggest: "Sounds: 'r', 'n'. How about 'rain'?"`;
    case MnemonicSystem.Dominic:
      return `${basePrompt} Give a hint for the number ${number} using the Dominic System. First, convert the number to initials (1=A, 2=B, 3=C, 4=D, 5=E, 6=S, 7=G, 8=H, 9=N, 0=O). Then, suggest a famous person and a simple action. For example, for 15, you would suggest: "Initials: A.E. Think of: Albert Einstein eating."`;
    case MnemonicSystem.NumberRhyme:
      return `${basePrompt} Give a hint for the number ${number} using the Number Rhyme system. Suggest a simple, common word that rhymes with the final digit. For example, for 21, you might say: "One rhymes with 'sun'."`;
    case MnemonicSystem.NumberShape:
      return `${basePrompt} Give a hint for the number ${number} using the Number Shape system. Describe a simple object a digit looks like. For example, for a number ending in 2, you might say: "The 2 looks like a swan."`;
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
        console.error("No text returned from Gemini API.");
        return "Sorry, I couldn't come up with a hint right now. Please try again!";
    }

    return text.trim();
  } catch (error) {
    console.error(`Error fetching hint from Gemini for number ${number}:`, error);
    // Return a user-friendly message instead of throwing an error
    return "Sorry, there was an issue getting a hint. Please check your connection and try again.";
  }
};