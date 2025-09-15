export enum Screen {
  Onboarding = 'ONBOARDING',
  Home = 'HOME',
  Learn = 'LEARN',
  Practice = 'PRACTICE',
  Stats = 'STATS',
}

export enum MnemonicSystem {
  Major = 'Major System',
  Dominic = 'Dominic System',
  NumberRhyme = 'Number Rhyme System',
  NumberShape = 'Number Shape System',
}

export enum PracticeMode {
    ConversionDrill = 'Conversion Drill',
    TimedChallenge = 'Timed Challenge',
    NumberAssociation = 'Number Association',
}

export interface PracticeConfig {
  timeLimit: number; // in seconds
  digits: number;    // number of digits for conversion drill
}

export interface UserStats {
  dailyStreak: number;
  accuracy: number;
  speed: number;
  completedLessons: MnemonicSystem[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  icon: React.ComponentType<{ className?: string }>;
}