import React, { useState } from 'react';
import { MnemonicSystem, PracticeMode, PracticeConfig } from '../types';
import { MNEMONIC_SYSTEMS } from '../constants';
import PracticeModeModal from '../components/PracticeModeModal';
import SystemDetailModal from '../components/SystemDetailModal';
import { SYSTEM_EXPLANATIONS, SystemExplanation } from '../systemExplanations';

interface SystemCardProps {
  system: { id: MnemonicSystem; title: string; description: string; icon: string; };
  onSelectPractice: (system: MnemonicSystem) => void;
  onLearnMore: (system: MnemonicSystem) => void;
  isCompleted: boolean;
}

const SystemCard: React.FC<SystemCardProps> = ({ system, onSelectPractice, onLearnMore, isCompleted }) => (
  <div className={`relative bg-slate-800 rounded-xl p-6 flex flex-col justify-between shadow-lg transform hover:-translate-y-1 transition-all duration-300 ${isCompleted ? 'border border-green-500/50' : 'border border-transparent'}`}>
    {isCompleted && (
        <div className="absolute top-3 right-3 bg-green-500 text-slate-900 rounded-full h-6 w-6 flex items-center justify-center font-bold text-sm shadow-md">
            ✓
        </div>
    )}
    <div>
      <div className="text-4xl mb-4">{system.icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{system.title}</h3>
      <p className="text-slate-400 mb-6 h-12">{system.description}</p>
    </div>
    <div className="flex items-center space-x-2">
       <button 
        onClick={() => onLearnMore(system.id)}
        className="w-full bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors"
      >
        Learn More
      </button>
      <button 
        onClick={() => onSelectPractice(system.id)}
        className="w-full bg-cyan-500 text-slate-900 font-bold py-2 px-4 rounded-lg hover:bg-cyan-400 transition-colors"
      >
        Practice
      </button>
    </div>
  </div>
);

interface LearnScreenProps {
  onStartPractice: (system: MnemonicSystem, mode: PracticeMode, config: PracticeConfig) => void;
  completedSystems: MnemonicSystem[];
}

const LearnScreen: React.FC<LearnScreenProps> = ({ onStartPractice, completedSystems }) => {
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<MnemonicSystem | null>(null);
  const [viewingSystem, setViewingSystem] = useState<SystemExplanation | null>(null);


  const handleSelectPractice = (system: MnemonicSystem) => {
    setSelectedSystem(system);
    setIsPracticeModalOpen(true);
  };

  const handleLearnMore = (systemId: MnemonicSystem) => {
    const systemToShow = SYSTEM_EXPLANATIONS.find(s => s.id === systemId) || null;
    setViewingSystem(systemToShow);
    setIsDetailModalOpen(true);
  };

  const handleStartPractice = (mode: PracticeMode, config: PracticeConfig) => {
    if (selectedSystem) {
      onStartPractice(selectedSystem, mode, config);
    }
    setIsPracticeModalOpen(false);
    setSelectedSystem(null);
  };


  return (
    <div className="animate-fadeIn">
      <h1 className="text-3xl font-bold text-white mb-2">Learning Hub</h1>
      <p className="text-slate-400 mb-8">Choose a mnemonic system to learn and master.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MNEMONIC_SYSTEMS.map(system => {
          // This check dynamically determines if any system, including PAO, is completed.
          const isCompleted = completedSystems.includes(system.id);
          return <SystemCard key={system.id} system={system} onSelectPractice={handleSelectPractice} onLearnMore={handleLearnMore} isCompleted={isCompleted} />;
        })}
      </div>
      <PracticeModeModal 
        isOpen={isPracticeModalOpen}
        onClose={() => setIsPracticeModalOpen(false)}
        onStart={handleStartPractice}
      />
      <SystemDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        system={viewingSystem}
      />
    </div>
  );
};

export default LearnScreen;