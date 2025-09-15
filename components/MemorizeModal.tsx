import React, { useState, useEffect, useCallback } from 'react';
import { MnemonicSystem, MnemonicStory } from '../types';
import { generateMnemonicStory } from '../services/geminiService';
import { LoadingSpinner, CopyIcon } from './icons/UtilityIcons';

interface MemorizeModalProps {
    isOpen: boolean;
    onClose: () => void;
    numberToMemorize: string;
}

const ExaggerateToggle: React.FC<{ checked: boolean; onChange: (checked: boolean) => void }> = ({ checked, onChange }) => (
    <div className="flex items-center space-x-2">
        <span className={`font-semibold text-sm transition-colors ${checked ? 'text-purple-400' : 'text-slate-400'}`}>
            Exaggerate ✨
        </span>
        <button
            role="switch"
            aria-checked={checked}
            onClick={() => onChange(!checked)}
            className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-purple-500 ${checked ? 'bg-purple-600' : 'bg-slate-600'}`}
        >
            <span
                className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-1'}`}
            />
        </button>
    </div>
);

const MemorizeModal: React.FC<MemorizeModalProps> = ({ isOpen, onClose, numberToMemorize }) => {
    const [selectedSystem, setSelectedSystem] = useState<MnemonicSystem>(MnemonicSystem.Major);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [mnemonicData, setMnemonicData] = useState<MnemonicStory | null>(null);
    const [copySuccess, setCopySuccess] = useState('');
    const [isExaggerated, setIsExaggerated] = useState(false);

    const fetchMnemonic = useCallback(async (system: MnemonicSystem, exaggerated: boolean) => {
        if (!numberToMemorize) return;
        setIsLoading(true);
        setError(null);
        setMnemonicData(null);
        setCopySuccess('');
        try {
            const data = await generateMnemonicStory(system, numberToMemorize, exaggerated);
            setMnemonicData(data);
        } catch (err) {
            setError('Could not generate mnemonic. Please try again later.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, [numberToMemorize]);

    useEffect(() => {
        if (isOpen) {
            fetchMnemonic(selectedSystem, isExaggerated);
        }
    }, [isOpen, selectedSystem, isExaggerated, fetchMnemonic]);

    const handleSystemChange = (system: MnemonicSystem) => {
        setSelectedSystem(system);
    };

    const handleCopyToClipboard = () => {
        if (!mnemonicData) return;
        const textToCopy = `Number: ${numberToMemorize}\nSystem: ${selectedSystem}\nBreakdown: ${mnemonicData.breakdown}\nWord: ${mnemonicData.word}\nStory: ${mnemonicData.story}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            setCopySuccess('Copied!');
            setTimeout(() => setCopySuccess(''), 2000);
        }, () => {
            setCopySuccess('Failed to copy.');
             setTimeout(() => setCopySuccess(''), 2000);
        });
    };

    if (!isOpen) return null;

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-64 text-slate-400">
                    <LoadingSpinner className="h-10 w-10 text-cyan-400" />
                    <p className="mt-4 text-lg">Crafting your mnemonic...</p>
                </div>
            );
        }

        if (error) {
            return (
                <div className="flex flex-col items-center justify-center h-64 text-center text-red-400 bg-red-500/10 rounded-lg p-4">
                    <p className="font-semibold">Oops! Something went wrong.</p>
                    <p>{error}</p>
                </div>
            );
        }

        if (mnemonicData) {
            return (
                <div className="space-y-4 animate-fadeIn">
                    <div>
                        <h4 className="font-semibold text-cyan-400">Breakdown</h4>
                        <p className="text-slate-300 bg-slate-900/50 p-3 rounded-md">{mnemonicData.breakdown}</p>
                    </div>
                    <div>
                        <h4 className="font-semibold text-cyan-400">Keyword / Phrase</h4>
                        <p className="text-slate-300 bg-slate-900/50 p-3 rounded-md">{mnemonicData.word}</p>
                    </div>
                     <div>
                        <h4 className="font-semibold text-cyan-400">Story / Image</h4>
                        <p className="text-slate-300 bg-slate-900/50 p-3 rounded-md leading-relaxed">{mnemonicData.story}</p>
                    </div>
                </div>
            );
        }

        return null;
    };

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
            onClick={onClose}
            aria-modal="true"
            role="dialog"
        >
            <div 
                className={`bg-slate-800 rounded-2xl w-full max-w-lg max-h-[90vh] flex flex-col transition-all duration-300 ${isExaggerated ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'border-slate-700'}`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="p-6 border-b border-slate-700 flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Memorize Number</h2>
                        <p className="text-cyan-400 font-mono text-xl">{numberToMemorize}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-3xl">&times;</button>
                </div>
                
                {/* System Selection Tabs */}
                <div className="flex-shrink-0 grid grid-cols-2 sm:grid-cols-3 gap-2 p-4 bg-slate-900/50">
                    {Object.values(MnemonicSystem).map(system => {
                        const isSelected = selectedSystem === system;
                        return (
                            <button 
                                key={system}
                                onClick={() => handleSystemChange(system)}
                                className={`px-3 py-2 text-sm font-semibold rounded-md transition-colors ${
                                    isSelected ? 'bg-cyan-500 text-slate-900' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                }`}
                            >
                                {system.replace(' System', '')}
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto flex-grow">
                    {renderContent()}
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-slate-700 flex justify-between items-center bg-slate-800/50 rounded-b-2xl">
                    <div className="flex items-center gap-4">
                        <div className="relative w-24">
                           <button 
                                onClick={handleCopyToClipboard}
                                disabled={!mnemonicData || !!copySuccess}
                                className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors disabled:text-slate-600 disabled:cursor-not-allowed"
                            >
                               <CopyIcon className="h-5 w-5" />
                               <span>Copy</span>
                           </button>
                           {copySuccess && <div className="absolute -top-8 left-0 text-xs bg-green-500 text-white rounded-md px-2 py-1 animate-fadeIn">{copySuccess}</div>}
                        </div>
                        <ExaggerateToggle checked={isExaggerated} onChange={setIsExaggerated} />
                    </div>
                    <button 
                        onClick={onClose} 
                        className="bg-slate-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-slate-500 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MemorizeModal;