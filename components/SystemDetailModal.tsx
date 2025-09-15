import React from 'react';
import { SystemExplanation } from '../systemExplanations';

interface SystemDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    system: SystemExplanation | null;
}

const SystemDetailModal: React.FC<SystemDetailModalProps> = ({ isOpen, onClose, system }) => {
    if (!isOpen || !system) return null;

    return (
        <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn"
            onClick={onClose}
        >
            <div 
                className="bg-slate-800 border border-slate-700 rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 text-left"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-white">{system.title}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors text-2xl">&times;</button>
                </div>
                
                <div className="space-y-4 text-slate-300">
                    <div>
                        <h3 className="font-semibold text-cyan-400 mb-2">How It Works</h3>
                        <p>{system.howItWorks}</p>
                    </div>
                    
                    <div>
                        <h3 className="font-semibold text-cyan-400 mb-2">Strengths</h3>
                        <p>{system.strengths}</p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-cyan-400 mb-2">Examples</h3>
                        <ul className="space-y-2 list-disc list-inside bg-slate-900/50 p-4 rounded-lg">
                            {system.examples.map((ex, index) => (
                                <li key={index}>
                                    <span className="font-bold text-white">{ex.number}</span>: {ex.explanation}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <button 
                        onClick={onClose} 
                        className="bg-slate-700 text-white font-semibold py-2 px-6 rounded-lg hover:bg-slate-600 transition-colors"
                    >
                        Got It
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SystemDetailModal;