
import React from 'react';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4 animate-fadeIn">
      <div className="max-w-md">
        <h1 className="text-5xl font-bold text-cyan-400 mb-4">Welcome to M Nemo</h1>
        <p className="text-xl text-slate-300 mb-8">Unlock the power of your memory. Learn ancient techniques to remember numbers, facts, and anything you want.</p>
        
        <div className="space-y-6 text-left mb-12">
            <div className="flex items-start space-x-4">
                <div className="text-2xl mt-1">🧠</div>
                <div>
                    <h3 className="font-semibold text-lg text-white">Learn Proven Systems</h3>
                    <p className="text-slate-400">Master techniques like the Major System and Number Rhymes through interactive lessons.</p>
                </div>
            </div>
            <div className="flex items-start space-x-4">
                <div className="text-2xl mt-1">🎯</div>
                <div>
                    <h3 className="font-semibold text-lg text-white">Practice Daily</h3>
                    <p className="text-slate-400">Sharpen your skills with timed challenges and custom drills to make learning stick.</p>
                </div>
            </div>
            <div className="flex items-start space-x-4">
                <div className="text-2xl mt-1">📈</div>
                <div>
                    <h3 className="font-semibold text-lg text-white">Track Your Progress</h3>
                    <p className="text-slate-400">Watch your accuracy and speed improve on your personal dashboard.</p>
                </div>
            </div>
        </div>

        <button 
          onClick={onComplete}
          className="w-full bg-cyan-500 text-slate-900 font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105"
        >
          Start Mastering Your Memory
        </button>
      </div>
    </div>
  );
};

export default OnboardingScreen;
