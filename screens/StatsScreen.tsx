import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { UserStats, Achievement, PracticeMode, MnemonicSystem } from '../types';
import { TOTAL_SYSTEMS } from '../achievements';

const MOCK_HISTORICAL_DATA = [
  { name: 'Day 1', accuracy: 75, speed: 15 },
  { name: 'Day 2', accuracy: 80, speed: 18 },
  { name: 'Day 3', accuracy: 78, speed: 22 },
  { name: 'Day 4', accuracy: 82, speed: 21 },
  { name: 'Day 5', accuracy: 88, speed: 24 },
  { name: 'Day 6', accuracy: 85, speed: 25 },
  { name: 'Today', accuracy: 92, speed: 28 },
];

const ProgressCircle: React.FC<{ progress: number; size?: number; strokeWidth?: number }> = ({ progress, size = 40, strokeWidth = 4 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (progress / 100) * circumference;

    return (
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
            {/* The background circle is now the parent div's bg-slate-700 */}
            <circle
                className="text-cyan-400"
                stroke="currentColor"
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                strokeLinecap="round"
                fill="transparent"
                r={radius}
                cx={size / 2}
                cy={size / 2}
                style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
            />
        </svg>
    );
};


const AchievementBadge: React.FC<{ achievement: Achievement; progress?: number }> = ({ achievement, progress }) => (
    <div className="bg-slate-800 rounded-lg p-4 flex items-center space-x-4">
        <div className="relative w-10 h-10 flex-shrink-0 flex items-center justify-center">
            {/* Background circle */}
            <div className={`absolute inset-0 rounded-full ${achievement.unlocked ? 'bg-cyan-500' : 'bg-slate-700'}`}></div>

            {/* Progress Circle for locked achievements */}
            {!achievement.unlocked && progress != null && progress > 0 && (
                <div className="absolute inset-0">
                     <ProgressCircle progress={progress} />
                </div>
            )}
            
            {/* Icon */}
            <achievement.icon className={`relative h-6 w-6 ${achievement.unlocked ? 'text-slate-900' : 'text-slate-400'}`} />
        </div>
        <div>
            <h4 className={`font-bold transition-colors ${achievement.unlocked ? 'text-white' : 'text-slate-300'}`}>{achievement.title}</h4>
            <p className={`text-sm transition-colors ${achievement.unlocked ? 'text-slate-400' : 'text-slate-500'}`}>{achievement.description}</p>
        </div>
    </div>
);


const getAchievementProgress = (achievement: Achievement, stats: UserStats): number | undefined => {
    if (achievement.unlocked) return 100;

    const numPracticeModes = Object.values(PracticeMode).length;
    let progress = 0;

    switch (achievement.id) {
        // Streaks
        case 'streak-3': progress = (stats.dailyStreak / 3) * 100; break;
        case 'streak-7': progress = (stats.dailyStreak / 7) * 100; break;
        case 'streak-30': progress = (stats.dailyStreak / 30) * 100; break;

        // Speed
        case 'speed-40': progress = (stats.speed / 40) * 100; break;
        case 'speed-60': progress = (stats.speed / 60) * 100; break;

        // Completion
        case 'all-systems':
            progress = (Object.keys(stats.completedPractices).length / TOTAL_SYSTEMS) * 100;
            break;

        // System Mastery
        case 'major-master':
            progress = ((stats.completedPractices[MnemonicSystem.Major]?.length || 0) / numPracticeModes) * 100; break;
        case 'dominic-master':
             progress = ((stats.completedPractices[MnemonicSystem.Dominic]?.length || 0) / numPracticeModes) * 100; break;
        case 'number-rhyme-master':
             progress = ((stats.completedPractices[MnemonicSystem.NumberRhyme]?.length || 0) / numPracticeModes) * 100; break;
        case 'number-shape-master':
             progress = ((stats.completedPractices[MnemonicSystem.NumberShape]?.length || 0) / numPracticeModes) * 100; break;
        case 'pao-master':
             progress = ((stats.completedPractices[MnemonicSystem.PAO]?.length || 0) / numPracticeModes) * 100; break;
        case 'alphabet-peg-master':
             progress = ((stats.completedPractices[MnemonicSystem.AlphabetPeg]?.length || 0) / numPracticeModes) * 100; break;

        default:
            return undefined; // No progress for session-based achievements like 'accuracy-90'
    }
    
    return Math.min(progress, 100);
};


interface StatsScreenProps {
  stats: UserStats;
  achievements: Achievement[];
}

const StatsScreen: React.FC<StatsScreenProps> = ({ stats, achievements }) => {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold text-white">Your Progress</h1>
        <p className="text-slate-400">See how far you've come.</p>
      </div>

      <div className="bg-slate-800 p-4 rounded-xl shadow-lg">
        <h2 className="text-xl font-bold mb-4 px-2">Performance Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={MOCK_HISTORICAL_DATA} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1e293b',
                borderColor: '#334155',
              }}
            />
            <Legend />
            <Bar dataKey="accuracy" fill="#22d3ee" name="Accuracy (%)" />
            <Bar dataKey="speed" fill="#818cf8" name="Speed (DPM)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      
      <div>
        <h2 className="text-xl font-bold mb-4">Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map(ach => {
                const progress = getAchievementProgress(ach, stats);
                return <AchievementBadge key={ach.id} achievement={ach} progress={progress} />;
            })}
        </div>
      </div>
    </div>
  );
};

export default StatsScreen;
