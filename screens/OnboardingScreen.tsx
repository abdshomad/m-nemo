import React, { useState, useEffect } from 'react';
import { MnemonicSystem } from '../types';
import { validateMnemonicAnswer } from '../services/geminiService';

interface OnboardingScreenProps {
  onComplete: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);

  const handleNextStep = () => {
    setStep(s => s + 1);
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return <WelcomeStep onNext={handleNextStep} />;
      case 1:
        return <ExplanationStep onNext={handleNextStep} />;
      case 2:
        return <InteractiveShapeStep
          key="shape-2"
          number="2"
          shapeEmoji="🦢"
          shapeName="swan"
          onNext={handleNextStep}
        />;
       case 3:
        return <InteractiveShapeStep
          key="shape-1"
          number="1"
          shapeEmoji="🕯️"
          shapeName="candle"
          onNext={handleNextStep}
        />;
      case 4:
        return <QuizStep
          key="quiz-1"
          number="4"
          question="Time for a quick check! What does '4' look like?"
          choices={[
            { text: 'A sailboat ⛵️', correct: true },
            { text: 'A snake 🐍', correct: false },
            { text: 'A tree 🌳', correct: false },
          ]}
          onCorrect={handleNextStep}
        />;
      case 5:
        return <QuizStep
          key="quiz-2"
          number="8"
          question="And what about '8'?"
          choices={[
            { text: 'A bird 🐦', correct: false },
            { text: 'A snowman ⛄️', correct: true },
            { text: 'A house 🏠', correct: false },
          ]}
          onCorrect={handleNextStep}
        />;
      case 6:
        return <QuizStep
          key="quiz-3"
          number="7"
          question="Last one! What does '7' remind you of?"
          choices={[
            { text: 'A boomerang 🪃', correct: false },
            { text: 'A lightning bolt ⚡️', correct: false },
            { text: 'A cliff edge 🧗', correct: true },
          ]}
          onCorrect={handleNextStep}
        />;
      case 7:
        return <TransitionStep onNext={handleNextStep} />;
      case 8:
        return <MajorSystemExplanationStep onNext={handleNextStep} />;
      case 9:
        return <InteractiveMajorSystemStep onNext={handleNextStep} />;
      case 10:
        return <FinalStep onComplete={onComplete} />;
      default:
        return <WelcomeStep onNext={handleNextStep} />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full text-center p-4">
      <div className="max-w-md w-full">
        {renderStep()}
      </div>
    </div>
  );
};

const WelcomeStep: React.FC<{ onNext: () => void }> = ({ onNext }) => (
  <div className="animate-fadeIn">
    <h1 className="text-5xl font-bold text-cyan-400 mb-4">Welcome to M Nemo</h1>
    <p className="text-xl text-slate-300 mb-8">Unlock the power of your memory with proven mnemonic techniques.</p>
    <button 
      onClick={onNext}
      className="w-full bg-cyan-500 text-slate-900 font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105"
    >
      Show Me How It Works
    </button>
  </div>
);

const ExplanationStep: React.FC<{ onNext: () => void }> = ({ onNext }) => (
    <div className="animate-fadeIn">
      <h2 className="text-3xl font-bold text-white mb-4">How Do Mnemonics Work?</h2>
      <p className="text-lg text-slate-300 mb-6">Our brains are great at remembering images and stories, but not abstract things like numbers.</p>
      <p className="text-lg text-slate-300 mb-8">Mnemonic systems help you convert numbers into memorable pictures. Let's try one called the <span className="text-cyan-400 font-semibold">Number Shape System</span>.</p>
      <button 
        onClick={onNext}
        className="w-full bg-cyan-500 text-slate-900 font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105"
      >
        Let's Start
      </button>
    </div>
);

const InteractiveShapeStep: React.FC<{ number: string; shapeEmoji: string; shapeName: string; onNext: () => void }> = ({ number, shapeEmoji, shapeName, onNext }) => (
  <div className="animate-fadeIn text-center">
    <h3 className="text-2xl font-bold text-white mb-4">See the Shape?</h3>
    <div className="flex justify-center items-center space-x-8 mb-6">
      <div className="text-8xl font-extrabold text-white">{number}</div>
      <div className="text-4xl text-cyan-400">→</div>
      <div className="text-8xl">{shapeEmoji}</div>
    </div>
    <p className="text-xl text-slate-300 mb-8">The number <span className="font-bold text-cyan-400">{number}</span> looks like a <span className="font-bold text-cyan-400">{shapeName}</span>.</p>
    <button
      onClick={onNext}
      className="w-full bg-cyan-500 text-slate-900 font-bold py-3 px-6 rounded-lg text-lg hover:bg-cyan-400 transition-colors"
    >
      I See It!
    </button>
  </div>
);

const QuizStep: React.FC<{ question: string; number: string; choices: {text: string, correct: boolean}[]; onCorrect: () => void }> = ({ question, number, choices, onCorrect }) => {
  const [selected, setSelected] = useState<any | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleSelect = (choice: any) => {
    if (isRevealed) return;
    setSelected(choice);
    setIsRevealed(true);
    if (choice.correct) {
      setTimeout(onCorrect, 1500);
    }
  };

  const getButtonClass = (choice: any) => {
    if (!isRevealed) return 'bg-slate-700 hover:bg-slate-600';
    if (choice.text === selected?.text) {
      return choice.correct ? 'bg-green-500' : 'bg-red-500 animate-shake';
    }
    if (choice.correct) return 'bg-green-500/50';
    return 'bg-slate-700 opacity-50';
  };

  return (
    <div className="animate-fadeIn text-center">
      <h3 className="text-2xl font-bold mb-4">{question}</h3>
      <div className="bg-slate-800 rounded-xl p-4 mb-6 inline-block">
        <p className="text-6xl font-extrabold text-white">{number}</p>
      </div>
      <div className="space-y-3 max-w-md mx-auto">
        {choices.map((choice) => (
          <button key={choice.text} onClick={() => handleSelect(choice)} disabled={isRevealed}
            className={`w-full text-white font-bold p-4 rounded-lg text-lg transition-all duration-300 ${getButtonClass(choice)}`}>
            {choice.text}
          </button>
        ))}
      </div>
      {isRevealed && selected?.correct && (
        <p className="mt-4 text-green-400 animate-fadeIn">Correct! Moving on...</p>
      )}
      {isRevealed && !selected?.correct && (
        <p className="mt-4 text-red-400 animate-fadeIn">Not quite. The correct answer is highlighted. Try to see the shape!</p>
      )}
    </div>
  );
};

const TransitionStep: React.FC<{ onNext: () => void }> = ({ onNext }) => (
  <div className="animate-fadeIn">
    <h2 className="text-3xl font-bold text-white mb-4">Great Job!</h2>
    <p className="text-lg text-slate-300 mb-6">You've just learned the basics of a simple mnemonic system.</p>
    <p className="text-lg text-slate-300 mb-8">Now, let's level up to one of the most powerful systems: the <span className="text-cyan-400 font-semibold">Major System</span>.</p>
    <button
      onClick={onNext}
      className="w-full bg-purple-600 text-white font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:bg-purple-500 transition-all duration-300 transform hover:scale-105"
    >
      Let's Do It
    </button>
  </div>
);

const MajorSystemExplanationStep: React.FC<{ onNext: () => void }> = ({ onNext }) => (
  <div className="animate-fadeIn">
    <h2 className="text-3xl font-bold text-white mb-4">The Major System: Sounds</h2>
    <p className="text-lg text-slate-300 mb-6">This system converts numbers into <span className="font-semibold text-cyan-400">consonant sounds</span>. Then you use vowels to form words.</p>
    <div className="bg-slate-800 p-4 rounded-lg text-left space-y-2 mb-8">
      <p><span className="font-bold text-cyan-400 text-xl">3</span> → <span className="font-mono text-white">m</span> sound (think of 'm' having 3 downstrokes)</p>
      <p><span className="font-bold text-cyan-400 text-xl">4</span> → <span className="font-mono text-white">r</span> sound (think 'fouR' ends with 'r')</p>
    </div>
    <p className="text-lg text-slate-300 mb-8">So, the number <span className="font-mono text-cyan-400">34</span> becomes the sounds <span className="font-mono text-cyan-400">m-r</span>.</p>
    <button
      onClick={onNext}
      className="w-full bg-cyan-500 text-slate-900 font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105"
    >
      Got It, Let's Try
    </button>
  </div>
);

const InteractiveMajorSystemStep: React.FC<{ onNext: () => void }> = ({ onNext }) => {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const checkAnswer = async () => {
    if (!answer.trim()) return;
    setIsLoading(true);
    setFeedback(null);
    setError('');
    try {
      const isCorrect = await validateMnemonicAnswer(MnemonicSystem.Major, '34', answer);
      if (isCorrect) {
        setFeedback('correct');
        setTimeout(onNext, 1500);
      } else {
        setFeedback('incorrect');
        setError(`Not quite. '${answer}' doesn't fit the m-r sounds. Think 'MoRe' or 'MeeR'.`);
        setTimeout(() => setFeedback(null), 2000);
      }
    } catch (e) {
      setFeedback('incorrect');
      setError('Could not validate answer. Please try again.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
  };

  const getDynamicInputClass = () => {
    if (feedback === 'correct') return 'border-green-500 animate-pulse-green';
    if (feedback === 'incorrect') return 'border-red-500 animate-shake';
    return 'border-slate-600 focus:ring-2 focus:ring-cyan-500';
  };

  return (
    <div className="animate-fadeIn text-center">
      <h3 className="text-2xl font-bold text-white mb-4">Your Turn!</h3>
      <p className="text-slate-300 mb-6">Suggest a word for the number <span className="font-bold text-cyan-400">34</span> using the sounds <span className="font-mono text-cyan-400">m</span> and <span className="font-mono text-cyan-400">r</span>.</p>
      
      <div className="bg-slate-800 rounded-xl p-6 mb-6">
        <div className="flex justify-center items-baseline space-x-6">
            <div>
                <p className="text-6xl font-extrabold text-white">3</p>
                <p className="text-2xl font-bold text-cyan-400 mt-1">m</p>
            </div>
            <div>
                <p className="text-6xl font-extrabold text-white">4</p>
                <p className="text-2xl font-bold text-cyan-400 mt-1">r</p>
            </div>
        </div>
      </div>

      <input
        type="text"
        value={answer}
        onChange={e => setAnswer(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="e.g., More"
        className={`w-full max-w-xs mx-auto bg-slate-700 border-2 ${getDynamicInputClass()} text-white text-center text-2xl p-4 rounded-lg focus:outline-none transition-all duration-300`}
      />
      <button 
        onClick={checkAnswer} 
        disabled={isLoading || !answer.trim()}
        className="w-full max-w-xs mx-auto mt-4 bg-cyan-500 text-slate-900 font-bold py-3 px-6 rounded-lg text-lg hover:bg-cyan-400 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Checking...' : 'Check Word'}
      </button>

      <div className="h-12 mt-2">
        {error && !isLoading && <p className="text-red-400 text-sm animate-fadeIn">{error}</p>}
        {feedback === 'correct' && <p className="text-green-400 text-sm animate-fadeIn">Perfect! You got it.</p>}
      </div>
    </div>
  );
};

const FinalStep: React.FC<{ onComplete: () => void }> = ({ onComplete }) => (
  <div className="animate-fadeIn">
    <h1 className="text-5xl font-bold text-cyan-400 mb-4">You're Ready!</h1>
    <p className="text-xl text-slate-300 mb-8">You've learned the core concepts. The journey to mastering your memory starts now. Explore, practice, and unlock your potential.</p>
    <button
      onClick={onComplete}
      className="w-full bg-cyan-500 text-slate-900 font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105"
    >
      Enter the App
    </button>
  </div>
);

export default OnboardingScreen;
