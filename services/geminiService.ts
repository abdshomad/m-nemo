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
    case MnemonicSystem.PAO:
      return `${basePrompt} Using the Person-Action-Object (PAO) system, provide a hint for the number ${number}.
      Break the number into 2-digit pairs. Suggest a Person for the first pair, an Action for the second, and an Object for the third.
      Example for 123456: "Think Person(12) -> Action(34) -> Object(56). Maybe Albus Dumbledore is driving a mail truck."`;
    case MnemonicSystem.AlphabetPeg:
      return `${basePrompt} Using the Alphabet Peg system (1=A, 2=B, etc.), provide a hint for the number ${number}.
      Suggest a simple sentence where the words start with the corresponding letters.
      Example for 312: "Think C-A-B. Maybe 'Cats Always Bounce'."`;
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
  let basePrompt = `You are a 'Mnemonic Grandmaster' and a master storyteller. Your mission is to transform a boring number, ${number}, into an unforgettable memory palace using the ${system}. The story must be potent, vivid, and sticky. Adhere strictly to the JSON output format.`;

  const storyInstruction = isExaggerated
    ? "Create a mind-bending, reality-warping, and explosively vivid story. This isn't just exaggerated; it's a scene from a surrealist blockbuster movie. Use cartoon physics, impossible scales, and overwhelming sensory details (what does it smell like? sound like?). Make the scene so bizarre and emotionally charged (hilarious, shocking, awe-inspiring) that it's physically impossible to forget."
    : "Create a short, surprising, and sensory-rich story or image. Make it memorable by using unexpected combinations, a touch of humor, and clear visuals. It should be a little weird.";

  switch (system) {
    case MnemonicSystem.Major:
      return `${basePrompt}
      1.  **Breakdown**: Analyze the number according to the Major System's phonetic code (0=s/z, 1=t/d, 2=n, 3=m, 4=r, 5=l, 6=j/sh/ch, 7=k/g, 8=f/v, 9=p/b). Show the digit-to-sound mapping.
      2.  **Word**: Form a single, common, and highly visual English word from the consonant sounds. Vowels and the letters w, h, y are free. Pick the most interesting word if multiple are possible.
      3.  **Story**: ${storyInstruction} Bring the generated word to life in an unexpected and dynamic way.`;
    case MnemonicSystem.Dominic:
       return `${basePrompt}
      1.  **Breakdown**: Convert the number into pairs of digits, each pair forming initials based on the Dominic System (1=A, 2=B, 3=C, 4=D, 5=E, 6=S, 7=G, 8=H, 9=N, 0=O).
      2.  **Word**: For each pair, identify a famous person and their unique action.
      3.  **Story**: ${storyInstruction} Combine the person from the first pair with the action from the second (and so on). Describe the *moment* this bizarre combination happens, giving it a surprising context.`;
    case MnemonicSystem.NumberRhyme:
      return `${basePrompt}
      1.  **Breakdown**: For each digit, state its common rhyming word (e.g., 1=sun, 2=shoe, 3=tree).
      2.  **Word**: List the sequence of rhyming objects.
      3.  **Story**: ${storyInstruction} Create a 'domino effect' story where each rhyming object directly and bizarrely interacts with the next in sequence.`;
    case MnemonicSystem.NumberShape:
      return `${basePrompt}
      1.  **Breakdown**: For each digit, describe the object it visually resembles (e.g., 2=swan, 8=snowman).
      2.  **Word**: List the sequence of shape-objects.
      3.  **Story**: ${storyInstruction} Animate the shape-objects. Create a story where they interact in a physically interesting or impossible way.`;
    case MnemonicSystem.PAO:
        return `${basePrompt}
      1.  **Breakdown**: Analyze the number by splitting it into pairs of digits (e.g., 12-34-56). If there's an odd number of digits, pad with a leading zero. For each pair, identify a Person, Action, or Object, cycling through P -> A -> O.
      2.  **Word**: List the chosen Person, Action, and/or Object.
      3.  **Story**: ${storyInstruction} Combine the elements into a single, vivid scene. Invent a tiny, bizarre backstory for *why* this person is doing this action to this object to make it stick.`;
    case MnemonicSystem.AlphabetPeg:
        return `${basePrompt}
      1.  **Breakdown**: Convert each digit into its corresponding alphabet letter (1=A, 2=B, 3=C, ... 9=I, 0=J/Z).
      2.  **Word**: For each letter, create a simple, highly visual peg word. List the sequence of peg words.
      3.  **Story**: ${storyInstruction} Weave the peg words into a surreal mini-fable or a nonsensical proverb. The connection between them should be clever and funny.`;
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
                temperature: isExaggerated ? 1.0 : 0.8,
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