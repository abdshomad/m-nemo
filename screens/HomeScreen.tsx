
import React from 'react';
import { UserStats, Screen } from '../types';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
}

const StatCard: React.FC<StatCardProps> = ({ label, value, icon }) => (
  <div className="bg-slate-800 rounded-xl p-4 flex items-center space-x-4">
    <div className="text-3xl">{icon}</div>
    <div>
      <div className="text-slate-400 text-sm">{label}</div>
      <div className="text-white text-2xl font-bold">{value}</div>
    </div>
  </div>
);

interface HomeScreenProps {
  stats: UserStats;
  navigate: (screen: Screen) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ stats, navigate }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400">Welcome back, memory athlete!</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Daily Streak" value={`${stats.dailyStreak} Days`} icon="🔥" />
        <StatCard label="Accuracy" value={`${stats.accuracy}%`} icon="🎯" />
        <StatCard label="Speed (DPM)" value={stats.speed} icon="⚡️" />
      </div>

      <div className="space-y-4">
        <button 
          onClick={() => navigate(Screen.Learn)}
          className="w-full text-left flex items-center justify-between bg-cyan-500 text-slate-900 font-bold p-6 rounded-lg shadow-lg hover:bg-cyan-400 transition-transform transform hover:scale-105"
        >
          <span className="text-lg">Start Learning</span>
          <span className="text-2xl">→</span>
        </button>
        <button 
          onClick={() => navigate(Screen.Practice)}
          className="w-full text-left flex items-center justify-between bg-slate-700 text-white font-bold p-6 rounded-lg shadow-lg hover:bg-slate-600 transition-transform transform hover:scale-105"
        >
          <span className="text-lg">Daily Practice</span>
          <span className="text-2xl">→</span>
        </button>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Completed Lessons</h2>
        <div className="bg-slate-800 p-4 rounded-lg">
          {stats.completedLessons.length > 0 ? (
            <ul className="space-y-2">
              {stats.completedLessons.map(lesson => (
                <li key={lesson} className="flex items-center space-x-2 text-slate-300">
                  <span className="text-green-400">✓</span>
                  <span>{lesson}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-slate-400">No lessons completed yet. Start learning today!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
