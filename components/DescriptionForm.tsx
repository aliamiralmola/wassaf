import React, { useState } from 'react';
import { TONE_OPTIONS, LANGUAGE_OPTIONS, LENGTH_OPTIONS } from '../constants';
import { ToneOfVoice, OutputLanguage, DescriptionLength } from '../types';
import type { DescriptionFormData } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';

interface DescriptionFormProps {
  onSubmit: (formData: DescriptionFormData) => void;
  isLoading: boolean;
}

type FormMode = 'generate' | 'analyze';

export const DescriptionForm: React.FC<DescriptionFormProps> = ({ onSubmit, isLoading }) => {
  const [mode, setMode] = useState<FormMode>('generate');
  const [productName, setProductName] = useState('');
  const [keywords, setKeywords] = useState('');
  const [audience, setAudience] = useState('');
  const [tone, setTone] = useState<ToneOfVoice>(ToneOfVoice.Friendly);
  const [variations, setVariations] = useState(3);
  const [language, setLanguage] = useState<OutputLanguage>(OutputLanguage.Arabic);
  const [length, setLength] = useState<DescriptionLength>(DescriptionLength.Medium);
  const [competitorDescription, setCompetitorDescription] = useState('');


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isGenerateReady = mode === 'generate' && productName && keywords;
    const isAnalyzeReady = mode === 'analyze' && productName && competitorDescription;

    if (isGenerateReady || isAnalyzeReady) {
      onSubmit({ productName, keywords, audience, tone, variations, language, length, mode, competitorDescription });
    }
  };

  const isSubmitDisabled = isLoading || (mode === 'generate' && (!productName || !keywords)) || (mode === 'analyze' && (!productName || !competitorDescription));

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      
      <div className="grid grid-cols-2 gap-1 rounded-lg bg-slate-100 p-1">
        <button type="button" onClick={() => setMode('generate')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'generate' ? 'bg-white shadow text-indigo-700' : 'text-slate-600 hover:bg-slate-200'}`}>
          إنشاء من الصفر
        </button>
        <button type="button" onClick={() => setMode('analyze')} className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${mode === 'analyze' ? 'bg-white shadow text-indigo-700' : 'text-slate-600 hover:bg-slate-200'}`}>
          تحليل المنافس
        </button>
      </div>

      <div>
        <label htmlFor="productName" className="block text-sm font-medium text-slate-700 mb-1">
          اسم المنتج
        </label>
        <input
          type="text"
          id="productName"
          value={productName}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProductName(e.currentTarget.value)}
          placeholder="مثال: حقيبة ظهر جلدية للسفر"
          className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          required
        />
      </div>

      {mode === 'generate' ? (
        <div>
          <label htmlFor="keywords" className="block text-sm font-medium text-slate-700 mb-1">
            الميزات والكلمات الرئيسية
          </label>
          <textarea
            id="keywords"
            rows={4}
            value={keywords}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setKeywords(e.currentTarget.value)}
            placeholder="مثال: صناعة يدوية، متينة، جيوب متعددة، مقاومة للماء"
            className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required
          />
          <p className="mt-1 text-xs text-slate-500">افصل بين الكلمات أو العبارات بفاصلة.</p>
        </div>
      ) : (
        <div>
            <label htmlFor="competitorDescription" className="block text-sm font-medium text-slate-700 mb-1">
                وصف منتج المنافس
            </label>
            <textarea
                id="competitorDescription"
                rows={6}
                value={competitorDescription}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setCompetitorDescription(e.currentTarget.value)}
                placeholder="الصق هنا وصف المنتج الخاص بمنافسك لتحليله وإنشاء وصف أفضل..."
                className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
            />
        </div>
      )}


      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
            <label htmlFor="tone" className="block text-sm font-medium text-slate-700 mb-1">
            نبرة الصوت
            </label>
            <select
            id="tone"
            value={tone}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTone(e.currentTarget.value as ToneOfVoice)}
            className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
            {TONE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
            </select>
        </div>
        <div>
            <label htmlFor="language" className="block text-sm font-medium text-slate-700 mb-1">
            لغة المخرجات
            </label>
            <select
            id="language"
            value={language}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setLanguage(e.currentTarget.value as OutputLanguage)}
            className="block w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
            {LANGUAGE_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
            </select>
        </div>
      </div>
      
      <button
        type="submit"
        disabled={isSubmitDisabled}
        className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
      >
        {isLoading ? (
            <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>جاري الإنشاء...</span>
            </>
        ) : (
            <>
            <SparklesIcon className="w-5 h-5"/>
            <span>{mode === 'analyze' ? 'حلل وتفوق' : 'أنشئ الوصف'}</span>
            </>
        )}
      </button>
    </form>
  );
};