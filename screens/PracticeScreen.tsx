
import React, { useState, useEffect, useCallback } from 'react';
import { MnemonicSystem } from '../types';
import { getMnemonicHint } from '../services/geminiService';

interface PracticeScreenProps {
  system: MnemonicSystem;
  onComplete: (accuracy: number, speed: number) => void;
}

const generateRandomNumber = (length: number): string => {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
};

const PracticeScreen: React.FC<PracticeScreenProps> = ({ system, onComplete }) => {
  const [currentNumber, setCurrentNumber] = useState('');
  const [userInput, setUserInput] = useState('');
  const [timer, setTimer] = useState(60);
  const [isFinished, setIsFinished] = useState(false);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [totalAttempts, setTotalAttempts] = useState(0);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [hint, setHint] = useState<string>('');
  const [isHintLoading, setIsHintLoading] = useState(false);
  
  useEffect(() => {
    setCurrentNumber(generateRandomNumber(3));
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleCheckAnswer = useCallback(() => {
    // In a real app, this would involve complex logic to validate the mnemonic.
    // For this example, we'll simulate it. We'll say any answer longer than 2 chars is "correct".
    const isCorrect = userInput.length > 2;
    setFeedback(isCorrect ? 'correct' : 'incorrect');
    if (isCorrect) {
      setCorrectAnswers(c => c + 1);
    }
    setTotalAttempts(t => t + 1);

    setTimeout(() => {
      setFeedback(null);
      setUserInput('');
      setHint('');
      setCurrentNumber(generateRandomNumber(Math.floor(Math.random() * 2) + 3)); // 3 or 4 digits
    }, 1000);
  }, [userInput]);

  const handleGetHint = async () => {
    if (!currentNumber || isHintLoading) return;
    setIsHintLoading(true);
    setHint('');
    try {
      const generatedHint = await getMnemonicHint(system, currentNumber);
      setHint(generatedHint);
    } catch (error) {
      console.error("Error getting hint:", error);
      setHint("Sorry, couldn't get a hint right now.");
    } finally {
      setIsHintLoading(false);
    }
  };

  if (isFinished) {
    const accuracy = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0;
    const speed = correctAnswers; // Digits Per Minute (since it's a 60s test)
    return (
      <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn">
        <h2 className="text-3xl font-bold mb-4">Challenge Complete!</h2>
        <div className="flex space-x-8 mb-8">
          <div>
            <div className="text-4xl font-bold text-cyan-400">{accuracy}%</div>
            <div className="text-slate-400">Accuracy</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-cyan-400">{speed}</div>
            <div className="text-slate-400">DPM</div>
          </div>
        </div>
        <button
          onClick={() => onComplete(accuracy, speed)}
          className="bg-cyan-500 text-slate-900 font-bold py-3 px-6 rounded-lg text-lg hover:bg-cyan-400 transition-colors"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const getFeedbackColor = () => {
    if (feedback === 'correct') return 'border-green-500';
    if (feedback === 'incorrect') return 'border-red-500';
    return 'border-slate-600';
  };

  return (
    <div className="flex flex-col items-center justify-center h-full animate-fadeIn">
      <div className="w-full max-w-sm text-center">
        <div className="flex justify-between items-center w-full mb-4">
          <div className="text-slate-400">{system}</div>
          <div className="text-2xl font-bold text-cyan-400">{timer}s</div>
        </div>
        
        <div className="bg-slate-800 rounded-xl p-8 mb-6">
          <p className="text-slate-400 mb-2">Your number is:</p>
          <p className="text-6xl font-extrabold tracking-widest text-white">{currentNumber}</p>
        </div>

        <input
          type="text"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your mnemonic word..."
          className={`w-full bg-slate-700 border-2 ${getFeedbackColor()} text-white text-center text-lg p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors`}
        />

        <button
          onClick={handleCheckAnswer}
          disabled={!userInput}
          className="w-full mt-4 bg-cyan-500 text-slate-900 font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:bg-cyan-400 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
        >
          Check Answer
        </button>
        
        <div className="h-20 mt-4">
          <button 
            onClick={handleGetHint}
            disabled={isHintLoading}
            className="text-cyan-400 hover:text-cyan-300 disabled:text-slate-500 transition-colors"
          >
            {isHintLoading ? 'Thinking...' : 'Get a Hint ✨'}
          </button>
          {hint && <p className="text-slate-300 mt-2 p-2 bg-slate-700/50 rounded-md animate-fadeIn">{hint}</p>}
        </div>
      </div>
    </div>
  );
};

export default PracticeScreen;
