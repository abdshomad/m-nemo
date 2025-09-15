import React, { useState } from 'react';
import { MnemonicSystem, PracticeMode, PracticeConfig } from '../types';
import { MNEMONIC_SYSTEMS } from '../constants';
import PracticeModeModal from '../components/PracticeModeModal';
import SystemDetailModal from '../components/SystemDetailModal';
import { SYSTEM_EXPLANATIONS, SystemExplanation } from '../systemExplanations';

interface SystemCardProps {
  system: { id: MnemonicSystem; title: string; description: string; icon: string; };
  onSelectPractice: (system: MnemonicSystem) => void;
  onStartTutorial: (system: MnemonicSystem) => void;
  onShowDetails: (system: MnemonicSystem) => void;
  isCompleted: boolean;
  isTutorialCompleted: boolean;
}

const SystemCard: React.FC<SystemCardProps> = ({ system, onSelectPractice, onStartTutorial, onShowDetails, isCompleted, isTutorialCompleted }) => (
  <div className={`relative bg-slate-800 rounded-xl p-6 flex flex-col justify-between shadow-lg transform hover:-translate-y-1 transition-all duration-300 ${isCompleted ? 'border border-green-500/50' : 'border border-transparent'}`}>
    {isTutorialCompleted && (
        <div className="absolute top-3 right-3 bg-cyan-500 text-slate-900 rounded-full h-6 w-6 flex items-center justify-center font-bold text-sm shadow-md" title="Tutorial Completed">
            🎓
        </div>
    )}
    <div 
        className="cursor-pointer"
        onClick={() => onShowDetails(system.id)}
        role="button"
        tabIndex={0}
        onKeyPress={(e) => e.key === 'Enter' && onShowDetails(system.id)}
        aria-label={`Learn more about ${system.title}`}
    >
      <div className="text-4xl mb-4">{system.icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{system.title}</h3>
      <p className="text-slate-400 mb-6 h-12">{system.description}</p>
    </div>
    <div className="flex items-center space-x-2">
       <button 
        onClick={() => onStartTutorial(system.id)}
        className="w-full bg-slate-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors"
      >
        {isTutorialCompleted ? 'Review Tutorial' : 'Start Tutorial'}
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
  onStartTutorial: (system: MnemonicSystem) => void;
  completedSystems: MnemonicSystem[];
  completedTutorials: MnemonicSystem[];
}

const LearnScreen: React.FC<LearnScreenProps> = ({ onStartPractice, onStartTutorial, completedSystems, completedTutorials }) => {
  const [isPracticeModalOpen, setIsPracticeModalOpen] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<MnemonicSystem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSystemDetails, setSelectedSystemDetails] = useState<SystemExplanation | null>(null);

  const handleSelectPractice = (system: MnemonicSystem) => {
    setSelectedSystem(system);
    setIsPracticeModalOpen(true);
  };

  const handleStartPractice = (mode: PracticeMode, config: PracticeConfig) => {
    if (selectedSystem) {
      onStartPractice(selectedSystem, mode, config);
    }
    setIsPracticeModalOpen(false);
    setSelectedSystem(null);
  };

  const handleShowDetails = (systemId: MnemonicSystem) => {
    const systemInfo = SYSTEM_EXPLANATIONS.find(s => s.id === systemId);
    if (systemInfo) {
      setSelectedSystemDetails(systemInfo);
      setIsDetailModalOpen(true);
    }
  };


  return (
    <div className="animate-fadeIn">
      <h1 className="text-3xl font-bold text-white mb-2">Learning Hub</h1>
      <p className="text-slate-400 mb-8">Choose a mnemonic system to learn and master.</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {MNEMONIC_SYSTEMS.map(system => {
          const isCompleted = completedSystems.includes(system.id);
          const isTutorialCompleted = completedTutorials.includes(system.id);
          return <SystemCard 
            key={system.id} 
            system={system} 
            onSelectPractice={handleSelectPractice} 
            onStartTutorial={onStartTutorial} 
            onShowDetails={handleShowDetails}
            isCompleted={isCompleted} 
            isTutorialCompleted={isTutorialCompleted}
          />;
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
        system={selectedSystemDetails}
      />
    </div>
  );
};

export default LearnScreen;