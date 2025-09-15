import React from 'react';
import { PracticeMode } from '../types';

interface PracticeModeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectMode: (mode: PracticeMode) => void;
}

const PracticeModeModal: React.FC<PracticeModeModalProps> = ({ isOpen, onClose, onSelectMode }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
            onClick={onClose}
        >
            <div 
                className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl w-full max-w-sm p-6 text-center"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold text-white mb-4">Choose a Practice Mode</h2>
                <p className="text-slate-400 mb-8">How would you like to train?</p>
                <div className="space-y-4">
                    <button
                        onClick={() => onSelectMode(PracticeMode.ConversionDrill)}
                        className="w-full text-left bg-slate-700 hover:bg-slate-600/80 p-4 rounded-lg transition-colors"
                    >
                        <h3 className="font-bold text-cyan-400">Conversion Drill</h3>
                        <p className="text-sm text-slate-300">Convert numbers to words against the clock.</p>
                    </button>
                    <button
                        onClick={() => onSelectMode(PracticeMode.TimedChallenge)}
                        className="w-full text-left bg-slate-700 hover:bg-slate-600/80 p-4 rounded-lg transition-colors"
                    >
                        <h3 className="font-bold text-cyan-400">Timed Challenge</h3>
                        <p className="text-sm text-slate-300">Memorize and recall a long number sequence.</p>
                    </button>
                </div>
                 <button onClick={onClose} className="mt-8 text-slate-400 hover:text-white transition-colors">
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default PracticeModeModal;
