import React from 'react';
import { ResultCard } from './ResultCard';
import { LoadingSpinner } from './LoadingSpinner';
import { SparklesIcon } from './icons/SparklesIcon';
import { CompetitorAnalysisReport } from './CompetitorAnalysisReport';
import type { GenerationSession } from '../types';

interface ResultsDisplayProps {
  isLoading: boolean;
  session: GenerationSession | null;
  error: string | null;
  hasResults: boolean;
  onClear: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ isLoading, session, error, hasResults, onClear }) => {
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl shadow-lg border border-red-200 h-full">
        <p className="text-red-600 font-semibold">!عفواً</p>
        <p className="text-slate-600 mt-2">{error}</p>
        <button onClick={onClear} className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-semibold">
            البدء من جديد
        </button>
      </div>
    );
  }

  if (!hasResults || !session) {
    return (
       <div className="flex flex-col items-center justify-center text-center p-10 bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-slate-200 min-h-[400px] lg:min-h-[600px]">
        <div className="p-4 bg-indigo-100 rounded-full">
            <SparklesIcon className="w-10 h-10 text-indigo-600"/>
        </div>
        <h3 className="mt-6 text-xl font-bold text-slate-800">محتوى منتجك سيظهر هنا</h3>
        <p className="mt-2 max-w-md text-slate-500">
          املأ النموذج لإنشاء أوصاف جذابة، أو قم بتحليل المنافسين للتفوق عليهم.
        </p>
      </div>
    );
  }

  const { descriptions, analysis } = session.results;
  const { keywords, language } = session.formData;

  return (
    <div className="space-y-8">
      {analysis && <CompetitorAnalysisReport analysis={analysis} />}
      <div className="space-y-6">
        {descriptions.map((desc, index) => (
          <ResultCard 
            key={index} 
            description={desc} 
            index={index}
            keywords={keywords}
            language={language}
          />
        ))}
      </div>
    </div>
  );
};