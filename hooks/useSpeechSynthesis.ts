/// <reference lib="dom" />

import { useState, useEffect, useRef, useCallback } from 'react';

export const useSpeechSynthesis = () => {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [speaking, setSpeaking] = useState(false);
    const [paused, setPaused] = useState(false);
    const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

    useEffect(() => {
        const handleVoicesChanged = () => {
            setVoices(window.speechSynthesis.getVoices());
        };
        window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
        handleVoicesChanged(); // Initial load

        return () => {
            window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
            window.speechSynthesis.cancel();
        };
    }, []);

    const speak = useCallback((text: string, voice: SpeechSynthesisVoice | null, rate: number, pitch: number) => {
        if (!text || !voice) return;

        window.speechSynthesis.cancel(); 
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = voice;
        utterance.rate = rate;
        utterance.pitch = pitch;
        
        utterance.onstart = () => {
            setSpeaking(true);
            setPaused(false);
        };

        utterance.onend = () => {
            setSpeaking(false);
            setPaused(false);
            utteranceRef.current = null;
        };
        
        utterance.onerror = (event) => {
            console.error('SpeechSynthesisUtterance.onerror', event);
            setSpeaking(false);
            setPaused(false);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    }, []);

    const pause = useCallback(() => {
        if (speaking && !paused) {
            window.speechSynthesis.pause();
            setPaused(true);
        }
    }, [speaking, paused]);

    const resume = useCallback(() => {
        if (speaking && paused) {
            window.speechSynthesis.resume();
            setPaused(false);
        }
    }, [speaking, paused]);

    const cancel = useCallback(() => {
        window.speechSynthesis.cancel();
        setSpeaking(false);
        setPaused(false);
    }, []);

    return {
        voices,
        speaking,
        paused,
        speak,
        pause,
        resume,
        cancel,
    };
};
