import React, { useState } from 'react';
import { UserStats, Screen } from '../types';
import MemorizeModal from '../components/MemorizeModal';

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
  const [numberToMemorize, setNumberToMemorize] = useState('');
  const [isMemorizeModalOpen, setIsMemorizeModalOpen] = useState(false);

  const handleMemorizeClick = () => {
    if (numberToMemorize.trim().length > 0) {
      setIsMemorizeModalOpen(true);
    }
  };

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

      <div className="bg-slate-800 p-6 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 text-white">Quick Memo</h2>
        <p className="text-slate-400 mb-4">
          Enter a number you want to remember, and we'll generate a mnemonic for you.
        </p>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="tel"
            value={numberToMemorize}
            onChange={(e) => setNumberToMemorize(e.target.value.replace(/[^0-9]/g, ''))}
            placeholder="e.g., 1492"
            className="flex-grow bg-slate-700 border-2 border-slate-600 text-white text-lg p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
          />
          <button
            onClick={handleMemorizeClick}
            disabled={!numberToMemorize.trim()}
            className="bg-purple-600 text-white font-bold py-3 px-6 rounded-lg text-lg shadow-lg hover:bg-purple-500 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            Memorize
          </button>
        </div>
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
          onClick={() => navigate(Screen.Learn)}
          className="w-full text-left flex items-center justify-between bg-slate-700 text-white font-bold p-6 rounded-lg shadow-lg hover:bg-slate-600 transition-transform transform hover:scale-105"
        >
          <span className="text-lg">Daily Practice</span>
          <span className="text-2xl">→</span>
        </button>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-2">Completed Lessons</h2>
        <div className="bg-slate-800 p-4 rounded-lg">
          {Object.keys(stats.completedPractices).length > 0 ? (
            <ul className="space-y-2">
              {Object.keys(stats.completedPractices).map(lesson => (
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

       <MemorizeModal
        isOpen={isMemorizeModalOpen}
        onClose={() => setIsMemorizeModalOpen(false)}
        numberToMemorize={numberToMemorize}
      />
    </div>
  );
};

export default HomeScreen;
