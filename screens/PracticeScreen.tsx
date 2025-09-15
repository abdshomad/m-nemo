import React, { useState, useEffect, useCallback } from 'react';
import { MnemonicSystem, PracticeMode, PracticeConfig } from '../types';
import { getMnemonicHint, validateMnemonicAnswer } from '../services/geminiService';

const generateRandomNumber = (length: number): string => {
  return Array.from({ length }, () => Math.floor(Math.random() * 10)).join('');
};

const FinishScreen: React.FC<{ accuracy: number; speed: number; onComplete: (accuracy: number, speed: number) => void; scoreLabel?: string }> = ({ accuracy, speed, onComplete, scoreLabel = 'DPM' }) => (
    <div className="flex flex-col items-center justify-center h-full text-center animate-fadeIn">
        <h2 className="text-3xl font-bold mb-4">Challenge Complete!</h2>
        <div className="flex space-x-8 mb-8">
            <div className="w-32">
                <div className="text-4xl font-bold text-cyan-400">{accuracy}%</div>
                <div className="text-slate-400">Accuracy</div>
            </div>
            <div className="w-32">
                <div className="text-4xl font-bold text-cyan-400">{speed}</div>
                <div className="text-slate-400">{scoreLabel}</div>
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

// --- Conversion Drill Mode ---
const ConversionDrill: React.FC<{ system: MnemonicSystem; onComplete: (accuracy: number, speed: number) => void; config: PracticeConfig }> = ({ system, onComplete, config }) => {
    const [currentNumber, setCurrentNumber] = useState('');
    const [userInput, setUserInput] = useState('');
    const [timer, setTimer] = useState(config.timeLimit);
    const [isFinished, setIsFinished] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [totalAttempts, setTotalAttempts] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [charFeedback, setCharFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [hint, setHint] = useState<string>('');
    const [isHintLoading, setIsHintLoading] = useState(false);

    useEffect(() => {
        setCurrentNumber(generateRandomNumber(config.digits));
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
    }, [config.digits]);

    const handleCheckAnswer = useCallback(() => {
        const isCorrect = userInput.length > 2; // Simplified validation
        setFeedback(isCorrect ? 'correct' : 'incorrect');
        if (isCorrect) setCorrectAnswers(c => c + 1);
        setTotalAttempts(t => t + 1);

        setTimeout(() => {
            setFeedback(null);
            setUserInput('');
            setHint('');
            setCurrentNumber(generateRandomNumber(config.digits));
        }, 1000);
    }, [userInput, config.digits]);
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const previousValue = userInput;
        setUserInput(value);

        // Only provide feedback when adding characters, not deleting
        if (value.length > previousValue.length) {
            const lastChar = value.slice(-1);
            // This is a simplified validation for demonstrating the UI effect.
            // A real implementation would require complex logic for each mnemonic system.
            // Here, we assume valid characters for a mnemonic word are letters.
            if (/[a-zA-Z]/.test(lastChar)) {
                setCharFeedback('correct');
            } else {
                setCharFeedback('incorrect');
            }

            // Reset the feedback after a short duration
            setTimeout(() => {
                setCharFeedback(null);
            }, 400);
        }
    };

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
        const speed = correctAnswers * (60 / config.timeLimit); // Digits per minute
        return <FinishScreen accuracy={accuracy} speed={Math.round(speed)} onComplete={onComplete} />;
    }

    const getDynamicInputClass = () => {
        // Prioritize transient feedback while typing
        if (charFeedback === 'correct') return 'border-green-500';
        if (charFeedback === 'incorrect') return 'border-red-500';
        
        // Persistent feedback after clicking "Check"
        if (feedback === 'correct') return 'border-green-500';
        if (feedback === 'incorrect') return 'border-red-500';

        // Default and focus states
        return 'border-slate-600 focus:ring-2 focus:ring-cyan-500';
    };

    return (
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
                onChange={handleInputChange}
                placeholder="Type your mnemonic word..."
                className={`w-full bg-slate-700 border-2 ${getDynamicInputClass()} text-white text-center text-lg p-4 rounded-lg focus:outline-none transition-colors duration-200`}
            />
            <button
                onClick={handleCheckAnswer}
                disabled={!userInput}
                className="w-full mt-4 bg-cyan-500 text-slate-900 font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:bg-cyan-400 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
                Check Answer
            </button>
            <div className="h-20 mt-4">
                <button onClick={handleGetHint} disabled={isHintLoading} className="text-cyan-400 hover:text-cyan-300 disabled:text-slate-500 transition-colors">
                    {isHintLoading ? 'Thinking...' : 'Get a Hint ✨'}
                </button>
                {hint && <p className="text-slate-300 mt-2 p-2 bg-slate-700/50 rounded-md animate-fadeIn">{hint}</p>}
            </div>
        </div>
    );
};

// --- Number Association Drill Mode ---
const NumberAssociationDrill: React.FC<{ system: MnemonicSystem; onComplete: (accuracy: number, speed: number) => void; config: PracticeConfig }> = ({ system, onComplete, config }) => {
    const [currentNumber, setCurrentNumber] = useState(0);
    const [userInput, setUserInput] = useState('');
    const [timer, setTimer] = useState(config.timeLimit);
    const [isFinished, setIsFinished] = useState(false);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [totalAttempts, setTotalAttempts] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [isChecking, setIsChecking] = useState(false);

    const nextNumber = useCallback(() => {
        setCurrentNumber(n => {
            let newNum;
            do {
                newNum = Math.floor(Math.random() * 10);
            } while (newNum === n);
            return newNum;
        });
    }, []);

    useEffect(() => {
        setCurrentNumber(Math.floor(Math.random() * 10));

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

    const handleCheckAnswer = useCallback(async () => {
        if (!userInput || isChecking) return;
        setIsChecking(true);

        const isCorrect = await validateMnemonicAnswer(system, String(currentNumber), userInput);

        setFeedback(isCorrect ? 'correct' : 'incorrect');
        if (isCorrect) setCorrectAnswers(c => c + 1);
        setTotalAttempts(t => t + 1);
        setIsChecking(false);

        setTimeout(() => {
            setFeedback(null);
            setUserInput('');
            nextNumber();
        }, 1200);
    }, [userInput, system, currentNumber, isChecking, nextNumber]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleCheckAnswer();
        }
    };
    
    if (isFinished) {
        const accuracy = totalAttempts > 0 ? Math.round((correctAnswers / totalAttempts) * 100) : 0;
        const speed = correctAnswers * (60 / config.timeLimit); 
        return <FinishScreen accuracy={accuracy} speed={Math.round(speed)} onComplete={onComplete} scoreLabel="Assoc./Min"/>;
    }
    
    const getDynamicInputClass = () => {
        if (feedback === 'correct') return 'border-green-500';
        if (feedback === 'incorrect') return 'border-red-500 animate-shake';
        return 'border-slate-600 focus:ring-2 focus:ring-cyan-500';
    };

    return (
        <div className="w-full max-w-sm text-center">
            <div className="flex justify-between items-center w-full mb-4">
                <div className="text-slate-400">{system}</div>
                <div className="text-2xl font-bold text-cyan-400">{timer}s</div>
            </div>
            <div className="bg-slate-800 rounded-xl p-8 mb-6">
                <p className="text-slate-400 mb-2">What's the association for:</p>
                <p className="text-8xl font-extrabold tracking-widest text-white">{currentNumber}</p>
            </div>
            <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your association..."
                className={`w-full bg-slate-700 border-2 ${getDynamicInputClass()} text-white text-center text-lg p-4 rounded-lg focus:outline-none transition-colors duration-200`}
            />
            <button
                onClick={handleCheckAnswer}
                disabled={!userInput || isChecking}
                className="w-full mt-4 bg-cyan-500 text-slate-900 font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:bg-cyan-400 transition-colors disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
                {isChecking ? 'Checking...' : 'Check Answer'}
            </button>
             <div className="h-20 mt-4 text-slate-400">
                <p>Drill the core mapping of numbers to their sounds, shapes, or rhymes.</p>
            </div>
        </div>
    );
};


// --- Timed Challenge Mode ---
const TimedChallenge: React.FC<{ onComplete: (accuracy: number, speed: number) => void; config: PracticeConfig }> = ({ onComplete, config }) => {
    const [phase, setPhase] = useState<'MEMORIZING' | 'RECALLING' | 'FINISHED'>('MEMORIZING');
    const [sequence] = useState(generateRandomNumber(30));
    const [timer, setTimer] = useState(config.timeLimit);
    const [recalledInput, setRecalledInput] = useState('');
    const [score, setScore] = useState({ accuracy: 0, speed: 0 });

    useEffect(() => {
        if (phase !== 'MEMORIZING') return;
        const interval = setInterval(() => {
            setTimer(prev => {
                if (prev <= 1) {
                    clearInterval(interval);
                    setPhase('RECALLING');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [phase]);

    const handleSubmitRecall = () => {
        let correctDigits = 0;
        for (let i = 0; i < sequence.length; i++) {
            if (recalledInput[i] === sequence[i]) {
                correctDigits++;
            } else {
                break; // Stop counting at the first mistake
            }
        }
        const accuracy = sequence.length > 0 ? Math.round((correctDigits / sequence.length) * 100) : 0;
        setScore({ accuracy, speed: correctDigits });
        setPhase('FINISHED');
    };

    if (phase === 'FINISHED') {
        return <FinishScreen accuracy={score.accuracy} speed={score.speed} onComplete={onComplete} scoreLabel="Digits Recalled"/>;
    }

    return (
        <div className="w-full max-w-md text-center">
            {phase === 'MEMORIZING' && (
                 <>
                    <div className="flex justify-between items-center w-full mb-4">
                        <div className="text-slate-400">Memorize the Sequence</div>
                        <div className="text-2xl font-bold text-cyan-400">{timer}s</div>
                    </div>
                    <div className="bg-slate-800 rounded-xl p-8 mb-6 break-all">
                         <p className="text-4xl font-extrabold tracking-widest text-white">{sequence}</p>
                    </div>
                    <p className="text-slate-400">Try to remember as many digits as you can in order.</p>
                </>
            )}
            {phase === 'RECALLING' && (
                <>
                    <h2 className="text-2xl font-bold mb-4">Recall Phase</h2>
                    <p className="text-slate-400 mb-6">Type the numbers you remember in the correct order.</p>
                    <textarea
                        value={recalledInput}
                        onChange={(e) => setRecalledInput(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="Start typing the sequence..."
                        rows={4}
                        className="w-full bg-slate-700 border-2 border-slate-600 text-white text-center text-lg p-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-colors"
                    />
                    <button
                        onClick={handleSubmitRecall}
                        className="w-full mt-4 bg-cyan-500 text-slate-900 font-bold py-4 px-8 rounded-lg text-lg shadow-lg hover:bg-cyan-400 transition-colors"
                    >
                        Submit Answer
                    </button>
                </>
            )}
        </div>
    );
};


// --- Main Practice Screen Component ---
interface PracticeScreenProps {
    system: MnemonicSystem;
    mode: PracticeMode;
    config: PracticeConfig;
    onComplete: (accuracy: number, speed: number) => void;
}

const PracticeScreen: React.FC<PracticeScreenProps> = ({ system, mode, config, onComplete }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full animate-fadeIn">
            {mode === PracticeMode.ConversionDrill && (
                <ConversionDrill system={system} onComplete={onComplete} config={config} />
            )}
            {mode === PracticeMode.NumberAssociation && (
                <NumberAssociationDrill system={system} onComplete={onComplete} config={config} />
            )}
            {mode === PracticeMode.TimedChallenge && (
                <TimedChallenge onComplete={onComplete} config={config} />
            )}
        </div>
    );
};

export default PracticeScreen;