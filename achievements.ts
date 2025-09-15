import { Achievement, MnemonicSystem } from './types';
import { StreakIcon, AccuracyIcon, SpeedIcon, TrophyIcon, SparklesIcon } from './components/icons/AchievementIcons';

// This is the blueprint for all possible achievements in the app.
// The `unlocked` status will be managed in the App state.
export const ACHIEVEMENT_DEFINITIONS: Omit<Achievement, 'unlocked'>[] = [
  // Session-based achievements
  { id: 'first-session', title: 'Getting Started', description: 'Complete your first practice session.', icon: StreakIcon },
  { id: 'accuracy-90', title: 'Sharpshooter', description: 'Reach 90% accuracy in a session.', icon: AccuracyIcon },
  { id: 'accuracy-95', title: 'Perfectionist', description: 'Reach 95% accuracy in a session.', icon: AccuracyIcon },
  { id: 'accuracy-100', title: 'Flawless Victory', description: 'Get a perfect 100% score.', icon: SparklesIcon },

  // Streak achievements
  { id: 'streak-3', title: 'On a Roll', description: 'Practice for 3 days in a row.', icon: StreakIcon },
  { id: 'streak-7', title: 'Week-Long Warrior', description: 'Maintain a 7-day practice streak.', icon: StreakIcon },
  { id: 'streak-30', title: 'Memory Master', description: 'Achieve a 30-day practice streak.', icon: StreakIcon },

  // Cumulative progress achievements
  { id: 'speed-40', title: 'Quick Thinker', description: 'Reach an average speed of 40 DPM.', icon: SpeedIcon },
  { id: 'speed-60', title: 'Lightning Fast', description: 'Reach an average speed of 60 DPM.', icon: SpeedIcon },
  { id: 'all-systems', title: 'System Specialist', description: 'Complete a practice for all mnemonic systems.', icon: TrophyIcon },

  // System Mastery achievements
  { id: 'major-master', title: 'Major System Master', description: 'Complete all practice modes for the Major System.', icon: SparklesIcon },
  { id: 'dominic-master', title: 'Dominic System Master', description: 'Complete all practice modes for the Dominic System.', icon: SparklesIcon },
  { id: 'number-rhyme-master', title: 'Number Rhyme Master', description: 'Complete all practice modes for the Number Rhyme System.', icon: SparklesIcon },
  { id: 'number-shape-master', title: 'Number Shape Master', description: 'Complete all practice modes for the Number Shape System.', icon: SparklesIcon },
];

export const TOTAL_SYSTEMS = Object.keys(MnemonicSystem).length;