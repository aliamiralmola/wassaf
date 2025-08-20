/// <reference lib="dom" />

import React, { useState } from 'react';
import { generateMarketingAssets, generateFAQs } from '../services/geminiService';
import type { MarketingAssetsData, FAQItem, OutputLanguage, AdCopy } from '../types';
import { CopyIcon } from './icons/CopyIcon';
import { CheckIcon } from './icons/CheckIcon';
import { AudioStudio } from './AudioStudio';
import { SpeakerIcon } from './icons/SpeakerIcon';

interface ResultCardProps {
  description: string;
  index: number;
  keywords: string;
  language: OutputLanguage;
}

type CopyStateKeys = 'main' | 'seoTitle' | 'seoMeta' | 'facebook' | 'instagram' | 'twitter' | string;
type CopyState = Record<CopyStateKeys, boolean>;

const AssetsContainer: React.FC<{ assets: MarketingAssetsData, onCopy: (text: string, field: string) => void, copyState: CopyState }> = ({ assets, onCopy, copyState }) => {
    const [activeTab, setActiveTab] = useState('seo');
    
    const renderAdCopy = (adCopy: AdCopy) => (
        <div className="space-y-4">
            <div>
                <h5 className="text-xs font-bold text-slate-700 mb-2">Google Ads</h5>
                <div className="space-y-2">
                    <p className="text-xs font-semibold text-slate-500">Headlines:</p>
                    {adCopy.google.headlines.map((h, i) => (
                        <div key={`gh-${i}`} className="flex justify-between items-center p-2 bg-slate-50 rounded text-slate-700 text-xs">
                           <span>{h}</span>
                           <button onClick={() => onCopy(h, `gh-${i}`)} className="text-slate-400 hover:text-indigo-600 p-1">
                               {copyState[`gh-${i}`] ? <CheckIcon className="w-4 h-4 text-green-600" /> : <CopyIcon className="w-4 h-4" />}
                           </button>
                        </div>
                    ))}
                    <p className="text-xs font-semibold text-slate-500 pt-1">Descriptions:</p>
                    {adCopy.google.descriptions.map((d, i) => (
                         <div key={`gd-${i}`} className="flex justify-between items-center p-2 bg-slate-50 rounded text-slate-700 text-xs">
                           <p className="leading-5">{d}</p>
                           <button onClick={() => onCopy(d, `gd-${i}`)} className="text-slate-400 hover:text-indigo-600 p-1 ml-2">
                               {copyState[`gd-${i}`] ? <CheckIcon className="w-4 h-4 text-green-600" /> : <CopyIcon className="w-4 h-4" />}
                           </button>
                        </div>
                    ))}
                </div>
            </div>
             <div>
                <h5 className="text-xs font-bold text-slate-700 mb-2">Facebook Ads</h5>
                <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-slate-50 rounded text-slate-700 text-xs">
                        <p className="leading-5"><span className="font-semibold text-slate-500">Primary Text: </span>{assets.adCopy.facebook.primaryText}</p>
                        <button onClick={() => onCopy(assets.adCopy.facebook.primaryText, 'fb-primary')} className="text-slate-400 hover:text-indigo-600 p-1 ml-2 flex-shrink-0">
                           {copyState['fb-primary'] ? <CheckIcon className="w-4 h-4 text-green-600" /> : <CopyIcon className="w-4 h-4" />}
                        </button>
                    </div>
                     <div className="flex justify-between items-center p-2 bg-slate-50 rounded text-slate-700 text-xs">
                        <span><span className="font-semibold text-slate-500">Headline: </span>{assets.adCopy.facebook.headline}</span>
                        <button onClick={() => onCopy(assets.adCopy.facebook.headline, 'fb-headline')} className="text-slate-400 hover:text-indigo-600 p-1 ml-2 flex-shrink-0">
                           {copyState['fb-headline'] ? <CheckIcon className="w-4 h-4 text-green-600" /> : <CopyIcon className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
    
    return (
        <div className="mt-4 pt-4 border-t border-slate-200 text-sm">
            <div className="flex border-b border-slate-200 mb-4">
                <button onClick={() => setActiveTab('seo')} className={`px-3 py-2 text-xs font-semibold border-b-2 ${activeTab === 'seo' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>SEO</button>
                <button onClick={() => setActiveTab('social')} className={`px-3 py-2 text-xs font-semibold border-b-2 ${activeTab === 'social' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Social</button>
                <button onClick={() => setActiveTab('ads')} className={`px-3 py-2 text-xs font-semibold border-b-2 ${activeTab === 'ads' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>Ad Copy</button>
            </div>

            {activeTab === 'seo' && (
                <div className="space-y-2">
                    <div>
                        <div className="flex justify-between items-center mb-1">
                            <p className="font-semibold text-slate-600 text-xs">Meta Title</p>
                             <button onClick={() => onCopy(assets.seoTitle, 'seoTitle')} className="text-slate-400 hover:text-indigo-600 p-1">
                                {copyState.seoTitle ? <CheckIcon className="w-4 h-4 text-green-600" /> : <CopyIcon className="w-4 h-4" />}
                            </button>
                        </div>
                        <p className="p-2 bg-slate-50 rounded text-slate-700 text-xs leading-5">{assets.seoTitle}</p>
                    </div>
                     <div>
                        <div className="flex justify-between items-center mb-1">
                            <p className="font-semibold text-slate-600 text-xs">Meta Description</p>
                            <button onClick={() => onCopy(assets.seoMetaDescription, 'seoMeta')} className="text-slate-400 hover:text-indigo-600 p-1">
                                {copyState.seoMeta ? <CheckIcon className="w-4 h-4 text-green-600" /> : <CopyIcon className="w-4 h-4" />}
                            </button>
                        </div>
                        <p className="p-2 bg-slate-50 rounded text-slate-700 text-xs leading-5">{assets.seoMetaDescription}</p>
                    </div>
                </div>
            )}
             {activeTab === 'social' && (
                 <div className="space-y-3">
                    <div className="flex gap-3">
                        <div className="flex-grow">
                             <p className="p-2 bg-slate-50 rounded text-slate-700 text-xs leading-5 whitespace-pre-wrap font-sans">{assets.socialPosts.facebook}</p>
                             <button onClick={() => onCopy(assets.socialPosts.facebook, 'facebook')} className="text-slate-400 hover:text-indigo-600 p-1 flex-shrink-0 mt-1 float-left">
                                {copyState.facebook ? <CheckIcon className="w-4 h-4 text-green-600" /> : <CopyIcon className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex-grow">
                             <p className="p-2 bg-slate-50 rounded text-slate-700 text-xs leading-5 whitespace-pre-wrap font-sans">{assets.socialPosts.instagram}</p>
                             <button onClick={() => onCopy(assets.socialPosts.instagram, 'instagram')} className="text-slate-400 hover:text-indigo-600 p-1 flex-shrink-0 mt-1 float-left">
                                {copyState.instagram ? <CheckIcon className="w-4 h-4 text-green-600" /> : <CopyIcon className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-3">
                        <div className="flex-grow">
                            <p className="p-2 bg-slate-50 rounded text-slate-700 text-xs leading-5 whitespace-pre-wrap font-sans">{assets.socialPosts.twitter}</p>
                             <button onClick={() => onCopy(assets.socialPosts.twitter, 'twitter')} className="text-slate-400 hover:text-indigo-600 p-1 flex-shrink-0 mt-1 float-left">
                                {copyState.twitter ? <CheckIcon className="w-4 h-4 text-green-600" /> : <CopyIcon className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                </div>
             )}
             {activeTab === 'ads' && renderAdCopy(assets.adCopy)}
        </div>
    );
}

const FAQsDisplay: React.FC<{ faqs: FAQItem[] }> = ({ faqs }) => (
    <div className="mt-4 pt-4 border-t border-slate-200 space-y-3">
        {faqs.map((faq, index) => (
            <div key={index} className="text-sm">
                <h5 className="font-semibold text-slate-800">{faq.question}</h5>
                <p className="text-slate-600 mt-1 text-xs">{faq.answer}</p>
            </div>
        ))}
    </div>
);

export const ResultCard: React.FC<ResultCardProps> = ({ description, index, keywords, language }) => {
  const [copyState, setCopyState] = useState<CopyState>({});
  const [marketingAssets, setMarketingAssets] = useState<MarketingAssetsData | null>(null);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  const [assetsError, setAssetsError] = useState<string | null>(null);
  const [isAssetsVisible, setIsAssetsVisible] = useState(false);
  const [faqs, setFaqs] = useState<FAQItem[] | null>(null);
  const [isLoadingFaqs, setIsLoadingFaqs] = useState(false);
  const [faqsError, setFaqsError] = useState<string | null>(null);
  const [isAudioStudioVisible, setIsAudioStudioVisible] = useState(false);


  const handleSetCopy = (field: string) => {
    setCopyState(prev => ({ ...prev, [field]: true }));
    setTimeout(() => setCopyState(prev => ({ ...prev, [field]: false })), 2000);
  };

  const handleMainCopy = () => {
    navigator.clipboard.writeText(description).then(() => handleSetCopy('main'));
  };

  const handleAssetCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text).then(() => handleSetCopy(field));
  };
  
  const toggleAssets = async () => {
    if (isAssetsVisible) {
      setIsAssetsVisible(false);
      return;
    }
    setIsAudioStudioVisible(false);
    setFaqs(null);
    setIsAssetsVisible(true);
    if (marketingAssets) return;
    setIsLoadingAssets(true);
    setAssetsError(null);
    try {
      const data = await generateMarketingAssets(description, keywords, language);
      setMarketingAssets(data);
    } catch (error) {
      setAssetsError('فشل في إنشاء الأدوات التسويقية.');
    } finally {
      setIsLoadingAssets(false);
    }
  };

  const handleGenerateFaqs = async () => {
    if (faqs) { // Hide if already visible
        setFaqs(null);
        return;
    }
    setIsAssetsVisible(false);
    setIsAudioStudioVisible(false);
    setIsLoadingFaqs(true);
    setFaqsError(null);
    try {
        const data = await generateFAQs(description, language);
        setFaqs(data);
    } catch (error) {
        setFaqsError('فشل في إنشاء الأسئلة الشائعة.');
    } finally {
        setIsLoadingFaqs(false);
    }
  };

  const toggleAudioStudio = () => {
    if(!isAudioStudioVisible) {
        setIsAssetsVisible(false);
        setFaqs(null);
    }
    setIsAudioStudioVisible(!isAudioStudioVisible);
  }

  const renderDescription = () => {
    const lines = description.split('\n').filter(line => line.trim() !== '');
    const elements: React.ReactNode[] = [];
    let listItems: string[] = [];

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`ul-${elements.length}`} className="list-disc list-inside space-y-1 my-3 pl-2">
            {listItems.map((item, idx) => <li key={idx} className="text-slate-600 leading-relaxed">{item}</li>)}
          </ul>
        );
        listItems = [];
      }
    };

    lines.forEach((line, lineIndex) => {
      const trimmedLine = line.trim();
      if (trimmedLine.startsWith('#')) {
        flushList();
        const level = trimmedLine.match(/^#+/)?.[0].length || 1;
        const text = trimmedLine.replace(/^#+\s*/, '');
        const Tag = `h${Math.min(level + 1, 6)}` as keyof JSX.IntrinsicElements;
        const size = ['text-2xl', 'text-xl', 'text-lg'][level -1] || 'text-lg';
        elements.push(<Tag key={lineIndex} className={`${size} font-bold mt-4 mb-2 text-slate-900`}>{text}</Tag>);
      } else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
        listItems.push(trimmedLine.substring(2).trim());
      } else {
        flushList();
        elements.push(<p key={lineIndex} className="text-slate-600 leading-relaxed">{trimmedLine}</p>);
      }
    });

    flushList(); 
    return elements;
  };


  return (
    <div 
      className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 relative transition-all duration-300 hover:shadow-xl hover:scale-[1.01] fade-in-up"
      style={{ animationDelay: `${index * 120}ms`, opacity: 0 }}
      >
      <button
        onClick={handleMainCopy}
        className={`absolute top-4 left-4 p-2 rounded-full transition-colors ${copyState['main'] ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
        aria-label="نسخ إلى الحافظة"
      >
        {copyState['main'] ? <CheckIcon className="w-5 h-5" /> : <CopyIcon className="w-5 h-5" />}
      </button>
      <div className="prose prose-sm max-w-none text-slate-600 whitespace-pre-wrap space-y-3 pr-8">
        {renderDescription()}
      </div>
      
      <div className="mt-6 pt-4 border-t border-slate-200/60 grid grid-cols-1 sm:grid-cols-3 gap-2">
        <button 
            onClick={toggleAssets}
            disabled={isLoadingAssets}
            className="w-full text-sm font-semibold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg px-4 py-2 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50"
        >
            {isLoadingAssets ? 'جاري التحليل...' : (isAssetsVisible ? 'إخفاء الأدوات' : 'أدوات تسويقية')}
        </button>
        <button
            onClick={handleGenerateFaqs}
            disabled={isLoadingFaqs}
            className="w-full text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg px-4 py-2 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50"
        >
            {isLoadingFaqs ? 'جاري الإنشاء...' : (faqs ? 'إخفاء الأسئلة' : 'إنشاء الأسئلة الشائعة')}
        </button>
         <button
            onClick={toggleAudioStudio}
            className="w-full text-sm font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg px-4 py-2 flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-50"
        >
            <SpeakerIcon className="w-4 h-4" />
            <span>{isAudioStudioVisible ? 'إغلاق الاستوديو' : 'الاستوديو الصوتي'}</span>
        </button>
      </div>

      {isAssetsVisible && (
        <div className="transition-all duration-500 ease-in-out">
            {isLoadingAssets && <div className="text-center p-4 text-sm text-slate-500">جاري إنشاء المحتوى التسويقي...</div>}
            {assetsError && <div className="text-center p-4 text-sm text-red-600">{assetsError}</div>}
            {marketingAssets && <AssetsContainer assets={marketingAssets} onCopy={handleAssetCopy} copyState={copyState} />}
        </div>
      )}

      {faqsError && <div className="mt-4 text-center p-4 text-sm text-red-600">{faqsError}</div>}
      {isLoadingFaqs && <div className="mt-4 text-center p-4 text-sm text-slate-500">جاري إنشاء الأسئلة الشائعة...</div>}
      {faqs && <FAQsDisplay faqs={faqs} />}

      {isAudioStudioVisible && <AudioStudio description={description} language={language} />}
    </div>
  );
};