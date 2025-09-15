
import { MnemonicSystem, UserStats, PracticeMode } from './types';

export const INITIAL_USER_STATS: UserStats = {
  dailyStreak: 0,
  accuracy: 85,
  speed: 25,
  completedPractices: {
    [MnemonicSystem.Major]: [PracticeMode.ConversionDrill],
  },
};

export const MNEMONIC_SYSTEMS = [
  {
    id: MnemonicSystem.Major,
    title: 'The Major System',
    description: 'Convert numbers to consonant sounds to form memorable words.',
    icon: '🧠',
  },
  {
    id: MnemonicSystem.Dominic,
    title: 'The Dominic System',
    description: 'Assign letters to numbers to create people and actions.',
    icon: '👥',
  },
  {
    id: MnemonicSystem.NumberRhyme,
    title: 'Number Rhyme System',
    description: 'Associate numbers with words that rhyme with them.',
    icon: '🎤',
  },
  {
    id: MnemonicSystem.NumberShape,
    title: 'Number Shape System',
    description: 'Link numbers to objects that have a similar shape.',
    icon: '🎨',
  },
  {
    id: MnemonicSystem.PAO,
    title: 'The PAO System',
    description: 'Use Person-Action-Object sets to encode number triplets.',
    icon: '🎬',
  },
  {
    id: MnemonicSystem.AlphabetPeg,
    title: 'Alphabet Peg System',
    description: 'Link numbers to alphabet letters to create peg words.',
    icon: '🔤',
  },
];