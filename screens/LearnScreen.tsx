import React, { useState } from 'react';
import { MnemonicSystem, PracticeMode } from '../types';
import { MNEMONIC_SYSTEMS } from '../constants';
import PracticeModeModal from '../components/PracticeModeModal';

interface SystemCardProps {
  system: { id: MnemonicSystem; title: string; description: string; icon: string; };
  onSelectPractice: (system: MnemonicSystem) => void;
  isCompleted: boolean;
}

const SystemCard: React.FC<SystemCardProps> = ({ system, onSelectPractice, isCompleted }) => (
  <div className={`relative bg-slate-800 rounded-xl p-6 flex flex-col justify-between shadow-lg transform hover:-translate-y-1 transition-all duration-300 ${isCompleted ? 'border border-green-500/50' : 'border border-transparent'}`}>
    {isCompleted && (
        <div className="absolute top-3 right-3 bg-green-500 text-slate-900 rounded-full h-6 w-6 flex items-center justify-center font-bold text-sm shadow-md">
            ✓
        </div>
    )}
    <div>
      <div className="text-4xl mb-4">{system.icon}</div>
      <h3 className="text-xl font-bold text-white mb-2">{system.title}</h3>
      <p className="text-slate-400 mb-6">{system.description}</p>
    </div>
    <button 
      onClick={() => onSelectPractice(system.id)}
      className="w-full bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-600 transition-colors"
    >
      Practice
    </button>
  </div>
);

interface LearnScreenProps {
  onStartPractice: (system: MnemonicSystem, mode: PracticeMode) => void;
  completedSystems: MnemonicSystem[];
}

const LearnScreen: React.FC<LearnScreenProps> = ({ onStartPractice, completedSystems }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSystem, setSelectedSystem] = useState<MnemonicSystem | null>(null);

  const handleSelectPractice = (system: MnemonicSystem) => {
    setSelectedSystem(system);
    setIsModalOpen(true);
  };

  const handleModeSelected = (mode: PracticeMode) => {
    if (selectedSystem) {
      onStartPractice(selectedSystem, mode);
    }
    setIsModalOpen(false);
    setSelectedSystem(null);
  };


  return (
    <div className="animate-fadeIn">
      <h1 className="text-3xl font-bold text-white mb-2">Learning Hub</h1>
      <p className="text-slate-400 mb-8">Choose a mnemonic system to learn and master.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MNEMONIC_SYSTEMS.map(system => {
          const isCompleted = completedSystems.includes(system.id);
          return <SystemCard key={system.id} system={system} onSelectPractice={handleSelectPractice} isCompleted={isCompleted} />;
        })}
      </div>
      <PracticeModeModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectMode={handleModeSelected}
      />
    </div>
  );
};

export default LearnScreen;