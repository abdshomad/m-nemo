import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { UserStats, Achievement } from '../types';

const MOCK_HISTORICAL_DATA = [
  { name: 'Day 1', accuracy: 75, speed: 15 },
  { name: 'Day 2', accuracy: 80, speed: 18 },
  { name: 'Day 3', accuracy: 78, speed: 22 },
  { name: 'Day 4', accuracy: 82, speed: 21 },
  { name: 'Day 5', accuracy: 88, speed: 24 },
  { name: 'Day 6', accuracy: 85, speed: 25 },
  { name: 'Today', accuracy: 92, speed: 28 },
];

const AchievementBadge: React.FC<{ achievement: Achievement }> = ({ achievement }) => (
    <div className={`bg-slate-800 rounded-lg p-4 flex items-center space-x-4 ${achievement.unlocked ? 'opacity-100' : 'opacity-40'}`}>
        <div className={`p-2 rounded-full ${achievement.unlocked ? 'bg-cyan-500' : 'bg-slate-600'}`}>
            <achievement.icon className="h-6 w-6 text-slate-900" />
        </div>
        <div>
            <h4 className="font-bold text-white">{achievement.title}</h4>
            <p className="text-sm text-slate-400">{achievement.description}</p>
        </div>
    </div>
);

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
            {achievements.map(ach => <AchievementBadge key={ach.id} achievement={ach} />)}
        </div>
      </div>
    </div>
  );
};

export default StatsScreen;
