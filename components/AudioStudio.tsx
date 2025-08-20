import React, { useState, useMemo } from 'react';
import { OutputLanguage, type VideoScript, type AudioAd } from '../types';
import { useSpeechSynthesis } from '../hooks/useSpeechSynthesis';
import { generateVideoScript, generateAudioAd } from '../services/geminiService';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { StopIcon } from './icons/StopIcon';
import { MicrophoneIcon } from './icons/MicrophoneIcon';
import { ClapperboardIcon } from './icons/ClapperboardIcon';
import { AdsIcon } from './icons/AdsIcon';

interface AudioStudioProps {
  description: string;
  language: OutputLanguage;
}

const langCodeMap: Record<OutputLanguage, string> = {
    [OutputLanguage.Arabic]: 'ar',
    [OutputLanguage.English]: 'en',
    [OutputLanguage.French]: 'fr',
    [OutputLanguage.Spanish]: 'es',
};

const VoiceoverPlayer: React.FC<{ text: string, lang: OutputLanguage }> = ({ text, lang }) => {
    const { voices, speaking, paused, speak, pause, resume, cancel } = useSpeechSynthesis();
    
    const relevantVoices = useMemo(() => {
        const langPrefix = langCodeMap[lang];
        return voices.filter(v => v.lang.startsWith(langPrefix));
    }, [voices, lang]);
    
    const [selectedVoice, setSelectedVoice] = useState<string>(() => relevantVoices[0]?.name || '');
    const [rate, setRate] = useState(1);
    const [pitch, setPitch] = useState(1);
    
    React.useEffect(() => {
        if(!selectedVoice && relevantVoices.length > 0) {
            setSelectedVoice(relevantVoices[0].name);
        }
    }, [relevantVoices, selectedVoice]);

    const handlePlay = () => {
        const voice = voices.find(v => v.name === selectedVoice);
        speak(text, voice || null, rate, pitch);
    };

    const handlePauseResume = () => {
        if (paused) resume();
        else pause();
    }

    return (
         <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-3">
                    <label htmlFor="voice-select" className="block text-xs font-medium text-slate-600 mb-1">
                        الصوت
                    </label>
                    <select
                        id="voice-select"
                        value={selectedVoice}
                        onChange={(e) => setSelectedVoice(e.target.value)}
                        className="block w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        disabled={relevantVoices.length === 0}
                    >
                        {relevantVoices.length > 0 ? (
                           relevantVoices.map(voice => (
                                <option key={voice.name} value={voice.name}>
                                    {voice.name} ({voice.lang})
                                </option>
                            ))
                        ) : (
                            <option>لا توجد أصوات متاحة</option>
                        )}
                    </select>
                    {relevantVoices.length === 0 && (
                        <p className="text-xs text-slate-500 mt-2">
                          لم يتم العثور على أصوات باللغة المحددة على جهازك. قد تحتاج إلى تثبيت حزم اللغة المناسبة في إعدادات نظام التشغيل الخاص بك (Windows/macOS) لتفعيل هذه الميزة.
                        </p>
                    )}
                </div>
                <div>
                     <label htmlFor="rate-slider" className="block text-xs font-medium text-slate-600 mb-1">
                        السرعة: {rate.toFixed(1)}x
                    </label>
                    <input id="rate-slider" type="range" min="0.5" max="2" step="0.1" value={rate} onChange={(e) => setRate(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                </div>
                 <div>
                     <label htmlFor="pitch-slider" className="block text-xs font-medium text-slate-600 mb-1">
                        حدة الصوت: {pitch.toFixed(1)}
                    </label>
                    <input id="pitch-slider" type="range" min="0" max="2" step="0.1" value={pitch} onChange={(e) => setPitch(parseFloat(e.target.value))} className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer" />
                </div>
            </div>
            <div className="flex items-center justify-center gap-4">
                <button onClick={handlePlay} disabled={speaking && !paused || relevantVoices.length === 0} className="p-3 bg-indigo-600 text-white rounded-full shadow-lg disabled:bg-indigo-300 hover:bg-indigo-700 transition-colors">
                    <PlayIcon className="w-6 h-6"/>
                </button>
                <button onClick={handlePauseResume} disabled={!speaking} className="p-3 bg-white text-slate-700 rounded-full shadow disabled:opacity-50 hover:bg-slate-100 transition-colors">
                    {paused ? <PlayIcon className="w-6 h-6" /> : <PauseIcon className="w-6 h-6" />}
                </button>
                 <button onClick={cancel} disabled={!speaking} className="p-3 bg-white text-slate-700 rounded-full shadow disabled:opacity-50 hover:bg-slate-100 transition-colors">
                    <StopIcon className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

const VideoScriptDisplay: React.FC<{ script: VideoScript }> = ({ script }) => (
    <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
        <h4 className="font-bold text-center text-slate-800">{script.title} ({script.targetDuration})</h4>
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {script.scenes.map((scene, index) => (
                <div key={index} className="p-3 border-l-4 border-indigo-400 bg-white rounded-r-md">
                    <p className="text-xs font-semibold text-indigo-700">SCENE {index + 1}</p>
                    <p className="text-sm text-slate-700 mt-1"><strong className="font-semibold">مرئي:</strong> {scene.visual}</p>
                    <p className="text-sm text-slate-600 mt-1"><strong className="font-semibold">صوتي:</strong> {scene.narration}</p>
                </div>
            ))}
        </div>
    </div>
);

const AudioAdDisplay: React.FC<{ ad: AudioAd }> = ({ ad }) => (
    <div className="space-y-4 p-4 bg-slate-50 rounded-lg">
        <h4 className="font-bold text-center text-slate-800">{ad.title} ({ad.targetDuration})</h4>
        <div className="space-y-3 text-sm">
            <div className="p-2 bg-white rounded">
                <p className="font-semibold text-slate-700 text-xs">الخطاف (Hook)</p>
                <p className="text-slate-600 mt-1">{ad.hook}</p>
            </div>
             <div className="p-2 bg-white rounded">
                <p className="font-semibold text-slate-700 text-xs">نص الإعلان (Body)</p>
                <p className="text-slate-600 mt-1">{ad.body}</p>
            </div>
             <div className="p-2 bg-white rounded">
                <p className="font-semibold text-slate-700 text-xs">دعوة لاتخاذ إجراء (CTA)</p>
                <p className="text-slate-600 mt-1">{ad.callToAction}</p>
            </div>
             <div className="p-2 bg-white rounded">
                <p className="font-semibold text-slate-700 text-xs">مؤثرات صوتية مقترحة (SFX)</p>
                <ul className="list-disc list-inside mt-1">
                    {ad.sfxSuggestions.map((sfx, i) => <li key={i} className="text-slate-600 text-xs">{sfx}</li>)}
                </ul>
            </div>
        </div>
    </div>
);

export const AudioStudio: React.FC<AudioStudioProps> = ({ description, language }) => {
    const [activeTab, setActiveTab] = useState('voiceover');
    
    const [videoScript, setVideoScript] = useState<VideoScript | null>(null);
    const [isLoadingVideo, setIsLoadingVideo] = useState(false);
    const [videoError, setVideoError] = useState<string | null>(null);

    const [audioAd, setAudioAd] = useState<AudioAd | null>(null);
    const [isLoadingAudioAd, setIsLoadingAudioAd] = useState(false);
    const [audioAdError, setAudioAdError] = useState<string | null>(null);

    const handleGenerateVideoScript = async () => {
        setIsLoadingVideo(true);
        setVideoError(null);
        try {
            const script = await generateVideoScript(description, language);
            setVideoScript(script);
        } catch (error) {
            setVideoError("فشل في إنشاء سكريبت الفيديو.");
        } finally {
            setIsLoadingVideo(false);
        }
    };

     const handleGenerateAudioAd = async () => {
        setIsLoadingAudioAd(true);
        setAudioAdError(null);
        try {
            const ad = await generateAudioAd(description, language);
            setAudioAd(ad);
        } catch (error) {
            setAudioAdError("فشل في إنشاء الإعلان الصوتي.");
        } finally {
            setIsLoadingAudioAd(false);
        }
    };


    return (
        <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex border-b border-slate-200 mb-4">
                 <button onClick={() => setActiveTab('voiceover')} className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold border-b-2 ${activeTab === 'voiceover' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                    <MicrophoneIcon className="w-4 h-4"/> تعليق صوتي
                 </button>
                 <button onClick={() => setActiveTab('video')} className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold border-b-2 ${activeTab === 'video' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                    <ClapperboardIcon className="w-4 h-4"/> سكريبت فيديو
                 </button>
                  <button onClick={() => setActiveTab('audioAd')} className={`flex items-center gap-2 px-3 py-2 text-xs font-semibold border-b-2 ${activeTab === 'audioAd' ? 'border-purple-600 text-purple-600' : 'border-transparent text-slate-500 hover:text-slate-800'}`}>
                    <AdsIcon className="w-4 h-4"/> إعلان صوتي
                 </button>
            </div>

            {activeTab === 'voiceover' && <VoiceoverPlayer text={description.replace(/#+\s/g, '').replace(/[\*\-]/g, '')} lang={language} />}
            
            {activeTab === 'video' && (
                <div>
                    {isLoadingVideo && <p className="text-center text-sm text-slate-500 p-4">جاري كتابة السكريبت...</p>}
                    {videoError && <p className="text-center text-sm text-red-500 p-4">{videoError}</p>}
                    {videoScript && <VideoScriptDisplay script={videoScript} />}
                    {!videoScript && !isLoadingVideo && (
                        <div className="text-center p-4">
                            <button onClick={handleGenerateVideoScript} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                                إنشاء سكريبت فيديو
                            </button>
                        </div>
                    )}
                </div>
            )}

            {activeTab === 'audioAd' && (
                 <div>
                    {isLoadingAudioAd && <p className="text-center text-sm text-slate-500 p-4">جاري إنتاج الإعلان الصوتي...</p>}
                    {audioAdError && <p className="text-center text-sm text-red-500 p-4">{audioAdError}</p>}
                    {audioAd && <AudioAdDisplay ad={audioAd} />}
                    {!audioAd && !isLoadingAudioAd && (
                        <div className="text-center p-4">
                            <button onClick={handleGenerateAudioAd} className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700">
                                إنشاء إعلان صوتي
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};