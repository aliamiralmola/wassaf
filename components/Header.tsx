import React from 'react';
import { SparklesIcon } from './icons/SparklesIcon';
import { HistoryIcon } from './icons/HistoryIcon';

interface HeaderProps {
  onHistoryToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onHistoryToggle }) => {
  return (
    <header className="bg-white/80 backdrop-blur-lg sticky top-0 z-20 border-b border-slate-200/70">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-1"></div>
          <div className="flex items-center gap-3 flex-1 justify-center">
            <SparklesIcon className="w-8 h-8 text-indigo-600" />
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              وصّاف
            </h1>
          </div>
          <div className="flex-1 flex justify-end">
             <button
              onClick={onHistoryToggle}
              className="p-2 rounded-full text-slate-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
              aria-label="عرض السجل"
            >
              <HistoryIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
