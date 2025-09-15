import React, { useState } from 'react';

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
        return <QuizStep
          key="quiz-1"
          number="4"
          question="What does '4' look like?"
          choices={[
            { text: 'A sailboat ⛵️', correct: true },
            { text: 'A snake 🐍', correct: false },
            { text: 'A tree 🌳', correct: false },
          ]}
          onCorrect={handleNextStep}
        />;
      case 3:
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
      case 4:
        return <MajorSystemExplanationStep onNext={handleNextStep} />;
      case 5:
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
      <h2 className="text-3xl font-bold text-white mb-4">Let's Try a Quick Example</h2>
      <p className="text-lg text-slate-300 mb-6">One simple method is the <span className="text-cyan-400 font-semibold">Number Shape System</span>. You link numbers to objects with a similar shape.</p>
      <div className="bg-slate-800 rounded-xl p-6 my-8">
        <p className="text-slate-400">For example:</p>
        <p className="text-5xl font-bold my-2">2 → 🦢</p>
        <p className="text-white text-lg">The number <span className="text-cyan-400">2</span> looks like a <span className="text-cyan-400">swan</span>.</p>
      </div>
      <button 
        onClick={onNext}
        className="w-full bg-cyan-500 text-slate-900 font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105"
      >
        Got It, Let's Try!
      </button>
    </div>
);

interface QuizStepProps {
    number: string;
    question: string;
    choices: { text: string; correct: boolean }[];
    onCorrect: () => void;
}

const QuizStep: React.FC<QuizStepProps> = ({ number, question, choices, onCorrect }) => {
    const [selected, setSelected] = useState<{ text: string; correct: boolean } | null>(null);
    const [isRevealed, setIsRevealed] = useState(false);

    const handleSelect = (choice: { text: string; correct: boolean }) => {
        if (isRevealed) return;
        
        setSelected(choice);
        setIsRevealed(true);

        if (choice.correct) {
            setTimeout(onCorrect, 1500);
        } else {
            setTimeout(() => {
                setSelected(null);
                setIsRevealed(false);
            }, 1500);
        }
    };

    const getButtonClass = (choice: { text: string; correct: boolean }) => {
        if (!isRevealed) {
            return 'bg-slate-700 hover:bg-slate-600';
        }
        if (choice.text === selected?.text) {
            return choice.correct ? 'bg-green-500' : 'bg-red-500 animate-shake';
        }
        return 'bg-slate-700 opacity-50';
    };

    return (
        <div className="animate-fadeIn">
            <div className="bg-slate-800 rounded-xl p-8 mb-6">
                <p className="text-slate-400 mb-2">{question}</p>
                <p className="text-8xl font-extrabold tracking-widest text-white">{number}</p>
            </div>
            <div className="space-y-4">
                {choices.map(choice => (
                    <button
                        key={choice.text}
                        onClick={() => handleSelect(choice)}
                        disabled={isRevealed}
                        className={`w-full text-white font-bold p-4 rounded-lg text-lg transition-all duration-300 ${getButtonClass(choice)}`}
                    >
                        {choice.text}
                    </button>
                ))}
            </div>
            <div className="h-8 mt-4 text-slate-300">
                {isRevealed && selected?.correct && <p>Exactly! ✨</p>}
                {isRevealed && !selected?.correct && <p>Not quite, try again!</p>}
            </div>
        </div>
    );
};

const MajorSystemExplanationStep: React.FC<{ onNext: () => void }> = ({ onNext }) => (
    <div className="animate-fadeIn">
      <h2 className="text-3xl font-bold text-white mb-4">Ready for Something More Powerful?</h2>
      <p className="text-lg text-slate-300 mb-6">That was just a warm-up! Systems like the <span className="text-cyan-400 font-semibold">Major System</span> let you memorize long numbers by converting them into sounds to form words.</p>
      <div className="bg-slate-800 rounded-xl p-6 my-8 text-left">
        <p className="text-slate-400">For example, with the Major System:</p>
        <ul className="list-disc list-inside mt-4 space-y-2 text-white">
            <li>The number <span className="font-bold text-cyan-400">3</span> maps to the 'm' sound.</li>
            <li>The number <span className="font-bold text-cyan-400">4</span> maps to the 'r' sound.</li>
        </ul>
        <div className="mt-4 pt-4 border-t border-slate-700">
             <p className="text-xl text-center">So, <span className="font-bold text-cyan-400 text-2xl">34</span> becomes <span className="font-bold text-cyan-400 text-2xl">M-R</span>, which you can remember as the word "MoRe" or "MaRia"!</p>
        </div>
      </div>
      <p className="text-md text-slate-400 mb-8">You'll learn all about this and more in the app.</p>
      <button 
        onClick={onNext}
        className="w-full bg-cyan-500 text-slate-900 font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105"
      >
        Sounds Interesting!
      </button>
    </div>
);

const FinalStep: React.FC<{ onComplete: () => void }> = ({ onComplete }) => (
    <div className="animate-fadeIn">
        <h2 className="text-4xl font-bold text-white mb-4">You're a Natural!</h2>
        <p className="text-xl text-slate-300 mb-8">You've just taken your first step to mastering your memory. Continue learning and practicing to unlock your full potential.</p>
        <button 
          onClick={onComplete}
          className="w-full bg-cyan-500 text-slate-900 font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105"
        >
          Start My Journey
        </button>
      </div>
);

export default OnboardingScreen;