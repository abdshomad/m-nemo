import React, { useState, useCallback, useEffect } from 'react';
import HomeScreen from './screens/HomeScreen';
import LearnScreen from './screens/LearnScreen';
import PracticeScreen from './screens/PracticeScreen';
import StatsScreen from './screens/StatsScreen';
import OnboardingScreen from './screens/OnboardingScreen';
import BottomNav from './components/BottomNav';
import { MnemonicSystem, UserStats, Screen, Achievement, PracticeMode } from './types';
import { INITIAL_USER_STATS } from './constants';
import { ACHIEVEMENT_DEFINITIONS, TOTAL_SYSTEMS } from './achievements';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<Screen>(Screen.Onboarding);
  const [userStats, setUserStats] = useState<UserStats>(INITIAL_USER_STATS);
  const [activeSystem, setActiveSystem] = useState<MnemonicSystem | null>(null);
  const [activeMode, setActiveMode] = useState<PracticeMode | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>(() => 
    ACHIEVEMENT_DEFINITIONS.map(def => ({ ...def, unlocked: false }))
  );

  const handlePracticeStart = useCallback((system: MnemonicSystem, mode: PracticeMode) => {
    setActiveSystem(system);
    setActiveMode(mode);
    setCurrentScreen(Screen.Practice);
  }, []);

  const handlePracticeComplete = useCallback((accuracy: number, speed: number) => {
    setUserStats(prevStats => {
        const completed = activeSystem 
            ? [...new Set([...prevStats.completedLessons, activeSystem])] 
            : prevStats.completedLessons;

        return {
          ...prevStats,
          accuracy: Math.round((prevStats.accuracy + accuracy) / 2),
          speed: Math.round((prevStats.speed + speed) / 2),
          dailyStreak: prevStats.dailyStreak + 1, // Simplified for example
          completedLessons: completed,
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
  }, [activeSystem]);
  
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
        if (userStats.completedLessons.length >= TOTAL_SYSTEMS) {
            unlock('all-systems');
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
        return <LearnScreen onStartPractice={handlePracticeStart} />;
      case Screen.Practice:
        // Default to ConversionDrill if mode is somehow not set
        return <PracticeScreen 
                  system={activeSystem || MnemonicSystem.Major} 
                  mode={activeMode || PracticeMode.ConversionDrill}
                  onComplete={handlePracticeComplete} 
                />;
      case Screen.Stats:
        return <StatsScreen stats={userStats} achievements={achievements} />;
      default:
        return <HomeScreen stats={userStats} navigate={setCurrentScreen} />;
    }
  };

  return (
    <div className="bg-slate-900 text-white min-h-screen font-sans flex flex-col antialiased">
      <main className="flex-grow container mx-auto px-4 py-8">
        {renderScreen()}
      </main>
      {currentScreen !== Screen.Onboarding && currentScreen !== Screen.Practice && (
        <BottomNav currentScreen={currentScreen} setCurrentScreen={setCurrentScreen} />
      )}
    </div>
  );
};

export default App;
