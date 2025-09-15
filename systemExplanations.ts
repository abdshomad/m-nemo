import { MnemonicSystem } from './types';

export interface SystemExplanation {
  id: MnemonicSystem;
  title: string;
  howItWorks: string;
  strengths: string;
  examples: { number: string; explanation: string }[];
}

export const SYSTEM_EXPLANATIONS: SystemExplanation[] = [
  {
    id: MnemonicSystem.Major,
    title: 'The Major System',
    howItWorks: 'The Major System is a phonetic system that works by converting numbers into consonant sounds, which can then be used to form words. Vowels (a, e, i, o, u) and the letters w, h, y are ignored and can be used as "fillers" to create sensible words. Each digit from 0-9 is associated with a specific sound.',
    strengths: 'Extremely powerful and flexible for remembering long sequences of numbers. Once mastered, you can create vivid images for any number combination, making them highly memorable.',
    examples: [
      { number: '0 = s, z', explanation: "Sounds like the first letter of 'zero'." },
      { number: '1 = t, d', explanation: "A 't' has one downstroke." },
      { number: '2 = n', explanation: "An 'n' has two downstrokes." },
      { number: '3 = m', explanation: "An 'm' has three downstrokes." },
      { number: '34', explanation: "'m' + 'r' can form the word 'MoRe'." },
      { number: '901', explanation: "'p' + 's' + 't' can form the word 'PooST'." },
    ],
  },
  {
    id: MnemonicSystem.Dominic,
    title: 'The Dominic System',
    howItWorks: 'The Dominic System assigns letters to numbers, similar to the Major System, but focuses on creating pairs of initials for people (real or fictional). These people are then combined with a unique action. For a 4-digit number, you combine the person from the first pair of digits with the action from the second pair.',
    strengths: 'Excellent for creating dynamic, story-like scenes which are easier to remember than static objects. Particularly effective for remembering 4-digit numbers like PINs or dates.',
    examples: [
      { number: '1 = A, 2 = B...', explanation: "Numbers 1-9 correspond to A-I, with 0 being O." },
      { number: '15 = AE', explanation: "Could be Albert Einstein." },
      { number: '12 = AB', explanation: "Could be Albus Dumbledore. His action might be 'waving a wand'." },
      { number: '72 = GB', explanation: "Could be George Bush. His action might be 'giving a speech'." },
      { number: '1272', explanation: "Combine the person from 12 (Albus Dumbledore) with the action from 72 (giving a speech). You imagine Dumbledore giving a speech." },
    ],
  },
  {
    id: MnemonicSystem.NumberRhyme,
    title: 'Number Rhyme System',
    howItWorks: 'This is a very simple system where you create a list of words that rhyme with the numbers one through nine (and often zero or ten). To remember a sequence, you create a story or image linking the rhyming words in order.',
    strengths: 'Very easy to learn and intuitive, making it a great starting point for beginners. It works well for short lists and numbers up to 5-10 digits long.',
    examples: [
      { number: '1', explanation: "rhymes with 'Sun' or 'Bun'." },
      { number: '2', explanation: "rhymes with 'Shoe' or 'Glue'." },
      { number: '3', explanation: "rhymes with 'Tree' or 'Bee'." },
      { number: '4', explanation: "rhymes with 'Door' or 'Boar'." },
      { number: '13', explanation: "Imagine a 'Sun' sitting on top of a 'Tree'." },
    ],
  },
  {
    id: MnemonicSystem.NumberShape,
    title: 'Number Shape System',
    howItWorks: 'Similar to the Number Rhyme system, this method involves associating each number with an object that visually resembles its shape. To remember a sequence, you link the shapes together in a memorable story.',
    strengths: 'Highly visual and creative, which can make memories very strong. Like the rhyme system, it is simple to learn and effective for shorter numbers.',
    examples: [
      { number: '1', explanation: "looks like a 'Candle' or 'Spear'." },
      { number: '2', explanation: "looks like a 'Swan' or 'Snake'." },
      { number: '7', explanation: "looks like a 'Cliff' or 'Scythe'." },
      { number: '8', explanation: "looks like a 'Snowman' or 'Hourglass'." },
      { number: '28', explanation: "Imagine a 'Swan' balancing on top of a 'Snowman'." },
    ],
  },
];