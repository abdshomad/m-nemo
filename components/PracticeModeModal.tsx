import React, { useState } from 'react';
import { PracticeMode, PracticeConfig } from '../types';

interface PracticeModeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onStart: (mode: PracticeMode, config: PracticeConfig) => void;
}

const PracticeModeModal: React.FC<PracticeModeModalProps> = ({ isOpen, onClose, onStart }) => {
    const [selectedMode, setSelectedMode] = useState<PracticeMode | null>(null);
    const [timeLimit, setTimeLimit] = useState(60);
    const [digits, setDigits] = useState(3);

    if (!isOpen) return null;

    const handleStart = () => {
        if (selectedMode) {
            onStart(selectedMode, { timeLimit, digits });
        }
    };

    const modeButtonClass = (mode: PracticeMode) => 
        `w-full text-left p-4 rounded-lg transition-all duration-200 border-2 ${
            selectedMode === mode 
            ? 'bg-cyan-500/20 border-cyan-400' 
            : 'bg-slate-700 border-transparent hover:bg-slate-600/80'
        }`;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
            onClick={onClose}
        >
            <div 
                className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl w-full max-w-sm p-6 text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-white mb-2">Practice Session</h2>
                <p className="text-slate-400 mb-6">Select a mode and customize your drill.</p>
                
                {/* Mode Selection */}
                <div className="space-y-3">
                    <button onClick={() => setSelectedMode(PracticeMode.ConversionDrill)} className={modeButtonClass(PracticeMode.ConversionDrill)}>
                        <h3 className="font-bold text-cyan-400">Conversion Drill</h3>
                        <p className="text-sm text-slate-300">Convert numbers to words against the clock.</p>
                    </button>
                    <button onClick={() => setSelectedMode(PracticeMode.TimedChallenge)} className={modeButtonClass(PracticeMode.TimedChallenge)}>
                        <h3 className="font-bold text-cyan-400">Timed Challenge</h3>
                        <p className="text-sm text-slate-300">Memorize and recall a long number sequence.</p>
                    </button>
                    <button onClick={() => setSelectedMode(PracticeMode.NumberAssociation)} className={modeButtonClass(PracticeMode.NumberAssociation)}>
                        <h3 className="font-bold text-cyan-400">Number Association</h3>
                        <p className="text-sm text-slate-300">Quickly drill the core associations for numbers 0-9.</p>
                    </button>
                </div>

                {/* Customization Section */}
                <div className="mt-8 space-y-5 text-left">
                    <h3 className="text-lg font-semibold text-white">Customize Session</h3>
                    <div>
                        <label htmlFor="timeLimit" className="flex justify-between text-sm font-medium text-slate-300 mb-2">
                            <span>Time Limit</span>
                            <span className="font-bold text-cyan-400">{timeLimit} seconds</span>
                        </label>
                        <input
                            id="timeLimit"
                            type="range"
                            min="30"
                            max="180"
                            step="15"
                            value={timeLimit}
                            onChange={(e) => setTimeLimit(Number(e.target.value))}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer range-thumb"
                            style={{'--thumb-color': '#22d3ee'} as React.CSSProperties}
                        />
                    </div>
                     <div>
                        <label htmlFor="digits" className={`flex justify-between text-sm font-medium mb-2 ${selectedMode === PracticeMode.ConversionDrill ? 'text-slate-300' : 'text-slate-500'}`}>
                            <span>Number of Digits</span>
                            <span className={`font-bold ${selectedMode === PracticeMode.ConversionDrill ? 'text-cyan-400' : 'text-slate-500'}`}>{digits}</span>
                        </label>
                        <input
                            id="digits"
                            type="range"
                            min="2"
                            max="7"
                            step="1"
                            value={digits}
                            onChange={(e) => setDigits(Number(e.target.value))}
                            disabled={selectedMode !== PracticeMode.ConversionDrill}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed range-thumb"
                             style={{'--thumb-color': selectedMode === PracticeMode.ConversionDrill ? '#22d3ee' : '#64748b'} as React.CSSProperties}
                        />
                         {selectedMode !== PracticeMode.ConversionDrill && <p className="text-xs text-slate-500 mt-1">Only available for Conversion Drill.</p>}
                    </div>
                </div>
                
                {/* Action Buttons */}
                <div className="mt-8 flex flex-col space-y-3">
                     <button 
                        onClick={handleStart}
                        disabled={!selectedMode}
                        className="w-full bg-cyan-500 text-slate-900 font-bold py-3 px-8 rounded-lg text-lg shadow-lg hover:bg-cyan-400 transition-all duration-300 transform hover:scale-105 disabled:bg-slate-600 disabled:cursor-not-allowed disabled:scale-100"
                    >
                        Start Session
                    </button>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors py-2">
                        Cancel
                    </button>
                </div>
            </div>
            {/* CSS for the range thumb styling */}
            <style>{`
                input[type=range].range-thumb::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: var(--thumb-color);
                    cursor: pointer;
                    margin-top: -8px; /* Center thumb */
                }
                input[type=range].range-thumb::-moz-range-thumb {
                    width: 20px;
                    height: 20px;
                    border-radius: 50%;
                    background: var(--thumb-color);
                    cursor: pointer;
                    border: none;
                }
            `}</style>
        </div>
    );
};

export default PracticeModeModal;