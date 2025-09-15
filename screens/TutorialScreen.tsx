import React, { useState, useEffect } from 'react';
import { MnemonicSystem, PracticeMode, PracticeConfig } from '../types';

// --- Tutorial Data ---
const TUTORIALS: Record<string, any[]> = {
  [MnemonicSystem.Major]: [
    {
      type: 'intro',
      title: 'The Major System',
      icon: '🧠',
      text: "Welcome to one of the most powerful memory techniques! The Major System helps you turn numbers into words, which are much easier for our brains to remember.",
    },
    {
      type: 'explanation',
      title: 'The Core Idea: Sounds, Not Letters',
      text: "This system links numbers 0-9 to specific consonant sounds. Vowels (a, e, i, o, u) and the letters 'w', 'h', 'y' are 'freebies' – you can use them anywhere to make words.",
    },
    {
      type: 'mapping',
      digit: '1',
      sound: 't, d',
      reason: 'A typed "t" has one downstroke.',
      visual: <div className="text-5xl font-bold">t</div>
    },
    {
      type: 'mapping',
      digit: '2',
      sound: 'n',
      reason: 'A typed "n" has two downstrokes.',
      visual: <div className="text-5xl font-bold">n</div>
    },
    {
      type: 'mapping',
      digit: '3',
      sound: 'm',
      reason: 'A typed "m" has three downstrokes.',
      visual: <div className="text-5xl font-bold">m</div>
    },
    {
      type: 'interactive-check',
      question: 'What is the sound for the number 2?',
      prompt: 'Type the letter for the sound.',
      correctAnswers: ['n'],
      number: '2',
    },
     {
      type: 'mapping',
      digit: '4',
      sound: 'r',
      reason: "The word 'fouR' ends with an R sound.",
      visual: <div className="text-5xl font-bold">r</div>
    },
    {
      type: 'explanation',
      title: 'Building Your First Word',
      text: "Let's combine sounds. For the number 34, we have the sounds 'm' (from 3) and 'r' (from 4). We can use vowels to form a word like 'MoRe' or 'MaRia'.",
    },
    {
      type: 'quiz',
      question: 'Which of these words could represent the number 14?',
      number: '14',
      choices: [
        { text: 'Tree', correct: false },
        { text: 'TiRe', correct: true },
        { text: 'Sun', correct: false },
      ],
      explanation: "Correct! 'TiRe' uses the 't' sound for 1 and the 'r' sound for 4. Vowels are fillers."
    },
    {
      type: 'summary',
      title: "You've got the basics!",
      text: 'You now understand how to convert numbers to sounds and build words. The key to mastery is practicing these associations.',
    },
  ],
};


// --- Sub-components for steps ---

const IntroStep: React.FC<{ step: any; onNext: () => void }> = ({ step, onNext }) => (
    <div className="text-center">
        <div className="text-6xl mb-4">{step.icon}</div>
        <h2 className="text-3xl font-bold mb-4">{step.title}</h2>
        <p className="text-slate-300 text-lg mb-8">{step.text}</p>
        <button onClick={onNext} className="w-full max-w-xs mx-auto bg-cyan-500 text-slate-900 font-bold py-3 px-6 rounded-lg text-lg hover:bg-cyan-400 transition-colors">Let's Go!</button>
    </div>
);

const ExplanationStep: React.FC<{ step: any }> = ({ step }) => (
    <div>
        <h3 className="text-2xl font-bold mb-3 text-cyan-400">{step.title}</h3>
        <p className="text-slate-300 text-lg whitespace-pre-line">{step.text}</p>
    </div>
);

const MappingStep: React.FC<{ step: any }> = ({ step }) => (
    <div className="text-center">
        <div className="bg-slate-800 rounded-xl p-8 mb-6">
            <p className="text-slate-400">The number</p>
            <p className="text-8xl font-extrabold text-white my-2">{step.digit}</p>
            <p className="text-slate-400">maps to the sound(s)</p>
            <p className="text-4xl font-bold text-cyan-400 mt-2">{step.sound}</p>
        </div>
        <p className="text-slate-300 text-lg">{step.reason}</p>
    </div>
);

const InteractiveCheckStep: React.FC<{ step: any; onCorrect: () => void }> = ({ step, onCorrect }) => {
    const [answer, setAnswer] = useState('');
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

    const checkAnswer = () => {
        if (step.correctAnswers.includes(answer.toLowerCase())) {
            setFeedback('correct');
            setTimeout(onCorrect, 1000);
        } else {
            setFeedback('incorrect');
            setTimeout(() => setFeedback(null), 1000);
        }
    };

    const getDynamicInputClass = () => {
        if (feedback === 'correct') return 'border-green-500 animate-pulse-green';
        if (feedback === 'incorrect') return 'border-red-500 animate-shake';
        return 'border-slate-600 focus:ring-2 focus:ring-cyan-500';
    };

    return (
        <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">{step.question}</h3>
            <div className="bg-slate-800 rounded-xl p-8 mb-6 flex items-center justify-center">
                <p className="text-8xl font-extrabold text-white">{step.number}</p>
            </div>
            <input
                type="text"
                value={answer}
                onChange={e => setAnswer(e.target.value)}
                placeholder={step.prompt}
                maxLength={2}
                className={`w-full max-w-xs mx-auto bg-slate-700 border-2 ${getDynamicInputClass()} text-white text-center text-2xl p-4 rounded-lg focus:outline-none transition-all duration-300`}
            />
             <button onClick={checkAnswer} className="w-full max-w-xs mx-auto mt-4 bg-cyan-500 text-slate-900 font-bold py-3 px-6 rounded-lg text-lg hover:bg-cyan-400 transition-colors">Check</button>
        </div>
    );
};

const QuizStep: React.FC<{ step: any; onCorrect: () => void }> = ({ step, onCorrect }) => {
    const [selected, setSelected] = useState<any | null>(null);
    const [isRevealed, setIsRevealed] = useState(false);

    const handleSelect = (choice: any) => {
        if (isRevealed) return;
        setSelected(choice);
        setIsRevealed(true);
        if (choice.correct) {
            setTimeout(onCorrect, 2000);
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
        <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">{step.question}</h3>
             <div className="bg-slate-800 rounded-xl p-4 mb-6 inline-block">
                <p className="text-6xl font-extrabold text-white">{step.number}</p>
            </div>
            <div className="space-y-3 max-w-md mx-auto">
                {step.choices.map((choice: any) => (
                    <button key={choice.text} onClick={() => handleSelect(choice)} disabled={isRevealed}
                        className={`w-full text-white font-bold p-4 rounded-lg text-lg transition-all duration-300 ${getButtonClass(choice)}`}>
                        {choice.text}
                    </button>
                ))}
            </div>
            {isRevealed && (
                <p className="mt-4 text-slate-300 animate-fadeIn">{step.explanation}</p>
            )}
        </div>
    );
};

const SummaryStep: React.FC<{ step: any; onComplete: () => void; onPractice: () => void }> = ({ step, onComplete, onPractice }) => (
    <div className="text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-3xl font-bold mb-4">{step.title}</h2>
        <p className="text-slate-300 text-lg mb-8">{step.text}</p>
        <div className="flex flex-col space-y-3 max-w-xs mx-auto">
            <button onClick={onPractice} className="w-full bg-cyan-500 text-slate-900 font-bold py-3 px-6 rounded-lg text-lg hover:bg-cyan-400 transition-colors">Start Practice</button>
            <button onClick={onComplete} className="w-full bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-slate-500 transition-colors">Finish Tutorial</button>
        </div>
    </div>
);

// --- Main Tutorial Screen ---

interface TutorialScreenProps {
    system: MnemonicSystem;
    onComplete: (system: MnemonicSystem) => void;
    onStartPractice: (system: MnemonicSystem, mode: PracticeMode, config: PracticeConfig) => void;
}

const TutorialScreen: React.FC<TutorialScreenProps> = ({ system, onComplete, onStartPractice }) => {
    const [stepIndex, setStepIndex] = useState(0);
    const tutorialSteps = TUTORIALS[system];

    if (!tutorialSteps) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn">
                <h1 className="text-3xl font-bold text-white mb-4">Coming Soon!</h1>
                <p className="text-slate-400 mb-8">An interactive tutorial for the {system} is being crafted.</p>
                <button onClick={() => onComplete(system)} className="bg-cyan-500 text-slate-900 font-bold py-3 px-6 rounded-lg text-lg hover:bg-cyan-400 transition-colors">
                    Back to Learning Hub
                </button>
            </div>
        );
    }
    
    const currentStep = tutorialSteps[stepIndex];
    const progress = ((stepIndex + 1) / tutorialSteps.length) * 100;

    const handleNext = () => {
        if (stepIndex < tutorialSteps.length - 1) {
            setStepIndex(i => i + 1);
        }
    };

    const handleBack = () => {
        if (stepIndex > 0) {
            setStepIndex(i => i - 1);
        } else {
            onComplete(system); // Go back to learn screen from first step
        }
    };

    const handlePractice = () => {
        onStartPractice(system, PracticeMode.ConversionDrill, { timeLimit: 60, digits: 2 });
    };

    const renderStep = () => {
        switch (currentStep.type) {
            case 'intro': return <IntroStep step={currentStep} onNext={handleNext} />;
            case 'explanation': return <ExplanationStep step={currentStep} />;
            case 'mapping': return <MappingStep step={currentStep} />;
            case 'interactive-check': return <InteractiveCheckStep step={currentStep} onCorrect={handleNext} />;
            case 'quiz': return <QuizStep step={currentStep} onCorrect={handleNext} />;
            case 'summary': return <SummaryStep step={currentStep} onComplete={() => onComplete(system)} onPractice={handlePractice} />;
            default: return <div>Unknown step type</div>;
        }
    };

    const isSummary = currentStep.type === 'summary';
    const isIntro = currentStep.type === 'intro';

    return (
        <div className="flex flex-col h-full max-w-2xl mx-auto">
            {/* Progress Bar */}
            <div className="w-full bg-slate-700 rounded-full h-2.5 mb-6 shadow-inner">
                <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-out' }} />
            </div>

            {/* Content */}
            <div className="flex-grow flex items-center justify-center p-4 animate-fadeIn">
                {renderStep()}
            </div>

            {/* Navigation */}
            {!isSummary && !isIntro && (
                <div className="flex justify-between items-center p-4 border-t border-slate-700 mt-4">
                    <button onClick={handleBack} className="bg-slate-700 text-white font-semibold py-2 px-6 rounded-lg hover:bg-slate-600 transition-colors">
                        Back
                    </button>
                    <button onClick={handleNext} className="bg-cyan-500 text-slate-900 font-bold py-2 px-6 rounded-lg hover:bg-cyan-400 transition-colors">
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default TutorialScreen;
