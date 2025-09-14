
import React from 'react';
import { Screen } from '../types';
import { HomeIcon, LearnIcon, StatsIcon } from './icons/NavIcons';

interface BottomNavProps {
  currentScreen: Screen;
  setCurrentScreen: (screen: Screen) => void;
}

const NavItem: React.FC<{
  screen: Screen;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
  onClick: () => void;
}> = ({ screen, label, Icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full pt-2 pb-1 transition-colors duration-200 ${
      isActive ? 'text-cyan-400' : 'text-slate-400 hover:text-cyan-300'
    }`}
  >
    <Icon className="h-6 w-6 mb-1" />
    <span className="text-xs font-medium">{label}</span>
  </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, setCurrentScreen }) => {
  const navItems = [
    { screen: Screen.Home, label: 'Home', Icon: HomeIcon },
    { screen: Screen.Learn, label: 'Learn', Icon: LearnIcon },
    { screen: Screen.Stats, label: 'Stats', Icon: StatsIcon },
  ];

  return (
    <nav className="sticky bottom-0 left-0 right-0 bg-slate-800/80 backdrop-blur-sm border-t border-slate-700 shadow-lg">
      <div className="container mx-auto flex justify-around max-w-md">
        {navItems.map((item) => (
          <NavItem
            key={item.screen}
            {...item}
            isActive={currentScreen === item.screen}
            onClick={() => setCurrentScreen(item.screen)}
          />
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
