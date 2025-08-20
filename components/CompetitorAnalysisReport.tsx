import React from 'react';
import type { CompetitorAnalysis } from '../types';
import { CheckIcon } from './icons/CheckIcon';
import { LightbulbIcon } from './icons/LightbulbIcon';

interface CompetitorAnalysisReportProps {
  analysis: CompetitorAnalysis;
}

const AnalysisSection: React.FC<{ title: string; items: string[]; icon: React.ReactNode; color: string }> = ({ title, items, icon, color }) => (
  <div className={`bg-${color}-50 border-l-4 border-${color}-500 p-4 rounded-r-lg`}>
    <h3 className={`text-lg font-bold text-${color}-800 flex items-center gap-2`}>
      {icon}
      <span>{title}</span>
    </h3>
    <ul className="mt-3 space-y-2 list-inside">
      {items.map((item, index) => (
        <li key={index} className={`text-sm text-${color}-700`}>
          {item}
        </li>
      ))}
    </ul>
  </div>
);

export const CompetitorAnalysisReport: React.FC<CompetitorAnalysisReportProps> = ({ analysis }) => {
  return (
    <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-slate-200 fade-in-up">
      <h2 className="text-xl font-bold text-slate-800 mb-4">
        تقرير تحليل المنافس
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalysisSection 
          title="نقاط القوة"
          items={analysis.strengths}
          icon={<CheckIcon className="w-5 h-5" />}
          color="green"
        />
        <AnalysisSection 
          title="نقاط الضعف"
          items={analysis.weaknesses}
          icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>}
          color="red"
        />
        <AnalysisSection 
          title="فرص التحسين"
          items={analysis.opportunities}
          icon={<LightbulbIcon className="w-5 h-5" />}
          color="yellow"
        />
      </div>
      <p className="text-center text-sm text-slate-500 mt-6">
        الأوصاف أدناه تم إنشاؤها لاستغلال هذه الفرص والتفوق على المنافس.
      </p>
    </div>
  );
};
