import React, { useState, useCallback, useEffect } from 'react';
import HomeScreen from './screens/HomeScreen';
import LearnScreen from './screens/LearnScreen';
import PracticeScreen from './screens/PracticeScreen';
import StatsScreen from './screens/StatsScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import TutorialScreen from './screens/TutorialScreen';
import BottomNav from './components/BottomNav';
import { MnemonicSystem, UserStats, Screen, Achievement, PracticeMode, PracticeConfig } from './types';
import { INITIAL_USER_STATS } from './constants';
import { ACHIEVEMENT_DEFINITIONS, TOTAL_SYSTEMS } from './achievements';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Onboarding);
  const [userStats, setUserStats] = useState<UserStats>(INITIAL_USER_STATS);
  const [activeSystem, setActiveSystem] = useState<MnemonicSystem | null>(null);
  const [tutorialSystem, setTutorialSystem] = useState<MnemonicSystem | null>(null);
  const [activeMode, setActiveMode] = useState<PracticeMode | null>(null);
  const [activeConfig, setActiveConfig] = useState<PracticeConfig>({ timeLimit: 60, digits: 3 });
  const [achievements, setAchievements] = useState<Achievement[]>(() => 
    ACHIEVEMENT_DEFINITIONS.map(def => ({ ...def, unlocked: false }))
  );

  const handlePracticeStart = useCallback((system: MnemonicSystem, mode: PracticeMode, config: PracticeConfig) => {
    setActiveSystem(system);
    setActiveMode(mode);
    setActiveConfig(config);
    setCurrentScreen(Screen.Practice);
  }, []);

  const handleStartTutorial = useCallback((system: MnemonicSystem) => {
    setTutorialSystem(system);
    setCurrentScreen(Screen.Tutorial);
  }, []);

  const handleTutorialComplete = useCallback((system: MnemonicSystem) => {
    setUserStats(prevStats => {
        if (prevStats.completedTutorials.includes(system)) {
            return prevStats;
        }
        return {
            ...prevStats,
            completedTutorials: [...prevStats.completedTutorials, system]
        };
    });
    setCurrentScreen(Screen.Learn);
  }, []);

  const handlePracticeComplete = useCallback((accuracy: number, speed: number) => {
    setUserStats(prevStats => {
        const newCompletedPractices = { ...prevStats.completedPractices };
        if (activeSystem && activeMode) {
            const systemPractices = newCompletedPractices[activeSystem] || [];
            if (!systemPractices.includes(activeMode)) {
                newCompletedPractices[activeSystem] = [...systemPractices, activeMode];
            }
        }

        return {
          ...prevStats,
          accuracy: Math.round((prevStats.accuracy + accuracy) / 2),
          speed: Math.round((prevStats.speed + speed) / 2),
          dailyStreak: prevStats.dailyStreak + 1, // Simplified for example
          completedPractices: newCompletedPractices,
        };
    });

    // Check for session-based achievements
    setAchievements(prevAchievements => {
        const newAchievements = [...prevAchievements];
        const unlock = (id: string) => {
            const index = newAchievements.findIndex(a => a.id === id);
            if (index !== -1 && !newAchievements[index].unlocked) {
                newAchievements[index].unlocked = true;
            }
        };

        unlock('first-session');
        if (accuracy >= 90) unlock('accuracy-90');
        if (accuracy >= 95) unlock('accuracy-95');
        if (accuracy === 100) unlock('accuracy-100');
        
        return newAchievements;
    });

    setCurrentScreen(Screen.Home);
  }, [activeSystem, activeMode]);
  
  const handleOnboardingComplete = useCallback(() => {
    setCurrentScreen(Screen.Home);
  }, []);

  useEffect(() => {
    setAchievements(prevAchievements => {
        const newAchievements = [...prevAchievements];
        const unlock = (id: string) => {
            const index = newAchievements.findIndex(a => a.id === id);
            if (index !== -1 && !newAchievements[index].unlocked) {
                newAchievements[index].unlocked = true;
            }
        };

        // Streaks
        if (userStats.dailyStreak >= 3) unlock('streak-3');
        if (userStats.dailyStreak >= 7) unlock('streak-7');
        if (userStats.dailyStreak >= 30) unlock('streak-30');

        // Speed
        if (userStats.speed >= 40) unlock('speed-40');
        if (userStats.speed >= 60) unlock('speed-60');

        // Completion
        if (Object.keys(userStats.completedPractices).length >= TOTAL_SYSTEMS) {
            unlock('all-systems');
        }

        // System Mastery
        const numPracticeModes = Object.values(PracticeMode).length;
        const systemToAchievementId: Record<string, string> = {
            [MnemonicSystem.Major]: 'major-master',
            [MnemonicSystem.Dominic]: 'dominic-master',
            [MnemonicSystem.NumberRhyme]: 'number-rhyme-master',
            [MnemonicSystem.NumberShape]: 'number-shape-master',
            [MnemonicSystem.PAO]: 'pao-master',
            [MnemonicSystem.AlphabetPeg]: 'alphabet-peg-master',
        };

        for (const system of Object.values(MnemonicSystem)) {
            const completedModes = userStats.completedPractices[system] || [];
            if (completedModes.length >= numPracticeModes) {
                const achievementId = systemToAchievementId[system];
                if (achievementId) {
                    unlock(achievementId);
                }
            }
        }

        return newAchievements;
    });
}, [userStats]);

  const renderScreen = () => {
    switch (currentScreen) {
      case Screen.Onboarding:
        return <OnboardingScreen onComplete={handleOnboardingComplete} />;
      case Screen.Home:
        return <HomeScreen stats={userStats} navigate={setCurrentScreen} />;
      case Screen.Learn:
        return <LearnScreen 
                  onStartPractice={handlePracticeStart} 
                  onStartTutorial={handleStartTutorial}
                  completedSystems={Object.keys(userStats.completedPractices) as MnemonicSystem[]}
                  completedTutorials={userStats.completedTutorials}
                />;
      case Screen.Practice:
        // Default to ConversionDrill if mode is somehow not set
        return <PracticeScreen 
                  system={activeSystem || MnemonicSystem.Major} 
                  mode={activeMode || PracticeMode.ConversionDrill}
                  config={activeConfig}
                  onComplete={handlePracticeComplete} 
                />;
      case Screen.Stats:
        return <StatsScreen stats={userStats} achievements={achievements} />;
      case Screen.Tutorial:
        return <TutorialScreen 
                 system={tutorialSystem!} 
                 onComplete={handleTutorialComplete} 
                 onStartPractice={handlePracticeStart} 
               />;
      default:
        return <HomeScreen stats={userStats} navigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans flex flex-col antialiased">
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderScreen()}
      </main>
      {currentScreen !== Screen.Onboarding && currentScreen !== Screen.Practice && currentScreen !== Screen.Tutorial && (
        <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
      )}
    </div>
  );
};

export default App;
