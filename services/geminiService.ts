import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { MnemonicSystem, MnemonicStory } from '../types';

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
    return "Sorry, there was an issue getting a hint. Please check your connection and try again.";
  }
};

const getMnemonicStorySystemPrompt = (system: MnemonicSystem, number: string, isExaggerated: boolean): string => {
  let basePrompt = `You are a world-class mnemonic expert, specializing in making numbers unforgettable. A user wants to memorize the number: ${number}. Your task is to generate a creative and effective mnemonic using the ${system}. Be vivid, concise, and follow the JSON output format precisely.`;

  const storyInstruction = isExaggerated
    ? "Create a wildly over-the-top, absurd, and comical story or image. Use extreme sensory details (sights, sounds, smells, feelings). Make it bizarre and unforgettable."
    : "Create a short, absurd, and memorable story or image. Make it sensory and emotional.";

  switch (system) {
    case MnemonicSystem.Major:
      return `${basePrompt}
      1.  **Breakdown**: Analyze the number according to the Major System's phonetic code (0=s/z, 1=t/d, 2=n, 3=m, 4=r, 5=l, 6=j/sh/ch, 7=k/g, 8=f/v, 9=p/b). Show the digit-to-sound mapping.
      2.  **Word**: Form a single, common, and highly visual English word from the consonant sounds. Vowels and the letters w, h, y are free.
      3.  **Story**: ${storyInstruction} This story should involve the generated word.`;
    case MnemonicSystem.Dominic:
       return `${basePrompt}
      1.  **Breakdown**: Convert the number into pairs of digits, each pair forming initials based on the Dominic System (1=A, 2=B, 3=C, 4=D, 5=E, 6=S, 7=G, 8=H, 9=N, 0=O).
      2.  **Word**: For each pair of initials, identify a famous person. Describe a distinct action associated with that person.
      3.  **Story**: ${storyInstruction} This story should combine the person from the first pair with the action from the second pair (and so on) to create a single, unforgettable scene.`;
    case MnemonicSystem.NumberRhyme:
      return `${basePrompt}
      1.  **Breakdown**: For each digit in the number, state its common rhyming word (e.g., 1=sun, 2=shoe, 3=tree).
      2.  **Word**: This isn't a single word, but the sequence of rhyming objects. List them clearly.
      3.  **Story**: ${storyInstruction} This story must weave the rhyming objects into a simple, linear narrative in the correct order.`;
    case MnemonicSystem.NumberShape:
      return `${basePrompt}
      1.  **Breakdown**: For each digit in the number, describe the object it visually resembles (e.g., 2=swan, 8=snowman).
      2.  **Word**: List the sequence of shape-objects.
      3.  **Story**: ${storyInstruction} This story should connect the shape-objects in the correct sequence.`;
    default:
      return `Generate a memorable story for the number ${number}.`;
  }
}

export const generateMnemonicStory = async (system: MnemonicSystem, number: string, isExaggerated: boolean = false): Promise<MnemonicStory> => {
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        console.warn("API_KEY environment variable not set. Using mock generation.");
        return {
            breakdown: `Mock breakdown for ${number} using ${system}`,
            word: `Mock word`,
            story: `This is a mock story because the API key is not configured.`
        };
    }

    try {
        const ai = new GoogleGenAI({ apiKey });
        const prompt = getMnemonicStorySystemPrompt(system, number, isExaggerated);
        
        const response: GenerateContentResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        breakdown: { type: Type.STRING, description: 'The number broken down into its mnemonic components (e.g., "3(m) 1(t) 4(r)")' },
                        word: { type: Type.STRING, description: 'The suggested mnemonic word(s) or person/action pairs.' },
                        story: { type: Type.STRING, description: 'A short, vivid story or image to help remember the word(s).' }
                    },
                    required: ["breakdown", "word", "story"]
                },
                temperature: isExaggerated ? 0.9 : 0.8,
            },
        });
        
        const jsonText = response.text.trim();
        try {
            return JSON.parse(jsonText) as MnemonicStory;
        } catch (e) {
            console.error("Failed to parse JSON from Gemini:", jsonText);
            throw new Error("Invalid JSON response from AI.");
        }

    } catch (error) {
        console.error(`Error generating mnemonic story for number ${number}:`, error);
        throw error;
    }
};