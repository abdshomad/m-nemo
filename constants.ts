
import { MnemonicSystem, UserStats } from './types';

export const INITIAL_USER_STATS: UserStats = {
  dailyStreak: 0,
  accuracy: 85,
  speed: 25,
  completedLessons: [MnemonicSystem.Major],
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
];
