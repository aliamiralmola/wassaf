export enum ToneOfVoice {
  Professional = 'احترافي',
  Friendly = 'ودود',
  Witty = 'ذكي',
  Persuasive = 'مقنع',
  Luxurious = 'فاخر',
  Simple = 'بسيط',
}

export enum OutputLanguage {
  Arabic = 'Arabic',
  English = 'English',
  French = 'French',
  Spanish = 'Spanish',
}

export enum DescriptionLength {
    Short = 'قصير',
    Medium = 'متوسط',
    Long = 'طويل',
}

export interface DescriptionFormData {
  productName: string;
  keywords: string;
  audience: string;
  tone: ToneOfVoice;
  variations: number;
  language: OutputLanguage;
  length: DescriptionLength;
  // New fields for competitor analysis
  mode: 'generate' | 'analyze';
  competitorDescription: string;
}

export interface AdCopy {
    google: {
        headlines: string[];
        descriptions: string[];
    };
    facebook: {
        primaryText: string;
        headline: string;
    };
}

export interface MarketingAssetsData {
    seoTitle: string;
    seoMetaDescription: string;
    socialPosts: {
        facebook: string;
        instagram: string;
        twitter: string;
    };
    adCopy: AdCopy;
}

export interface FAQItem {
    question: string;
    answer: string;
}

export interface CompetitorAnalysis {
    strengths: string[];
    weaknesses: string[];
    opportunities: string[];
}

export interface GenerationResult {
    descriptions: string[];
    analysis: CompetitorAnalysis | null;
}

export interface GenerationSession {
    id: string;
    timestamp: string;
    formData: DescriptionFormData;
    results: GenerationResult;
}

// New types for Audio/Video Suite
export interface VideoScene {
    visual: string;
    narration: string;
}

export interface VideoScript {
    title: string;
    targetDuration: string;
    scenes: VideoScene[];
}

export interface AudioAd {
    title: string;
    targetDuration: string;
    hook: string;
    body: string;
    callToAction: string;
    sfxSuggestions: string[];
}