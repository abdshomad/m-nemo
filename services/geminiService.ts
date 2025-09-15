import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { MnemonicSystem } from '../types';

const getSystemPrompt = (system: MnemonicSystem, number: string): string => {
  const basePrompt = `You are an expert mnemonic coach. Your task is to provide a single, creative, and common hint for a user trying to remember a number with a specific system. The hint must be concise (under 20 words) and directly actionable. Do not offer multiple options or long explanations.`;
  switch (system) {
    case MnemonicSystem.Major:
      return `${basePrompt} Using the Major System phonetic code (0=s/z, 1=t/d, 2=n, 3=m, 4=r, 5=l, 6=j/sh, 7=k/g, 8=f/v, 9=p/b), provide a hint for the number ${number}.
      Suggest one common English word that fits the consonant sounds.
      Explain the mapping concisely.
      Example for 34: "Think 'MoRe'. M=3, R=4."
      Example for 927: "Think 'PiNK'. P=9, N=2, K=7."`;
    case MnemonicSystem.Dominic:
      return `${basePrompt} Using the Dominic System letter code (1=A, 2=B, 3=C, 4=D, 5=E, 6=S, 7=G, 8=H, 9=N, 0=O), provide a hint for the number ${number}.
      Convert the number into initials (e.g., 15 -> AE).
      Suggest a well-known person for the initials and a concrete action.
      Example for 15 (AE): "Albert Einstein writing on a chalkboard."
      Example for 07 (OG): "Oprah Winfrey giving away a car."`;
    case MnemonicSystem.NumberRhyme:
      return `${basePrompt} Using the Number Rhyme system, suggest a simple object that rhymes with the final digit of ${number}.
      Example for 21: "One rhymes with 'sun'."
      Example for 8: "Eight rhymes with 'gate'."`;
    case MnemonicSystem.NumberShape:
       return `${basePrompt} Using the Number Shape system, describe a simple object that a digit in ${number} looks like.
      Example for a number with 2: "The digit '2' looks like a swan."
      Example for a number with 8: "The digit '8' looks like a snowman."`;
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