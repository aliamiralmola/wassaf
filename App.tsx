import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { DescriptionForm } from './components/DescriptionForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Footer } from './components/Footer';
import { HistorySidebar } from './components/HistorySidebar';
import type { DescriptionFormData, GenerationSession, CompetitorAnalysis } from './types';
import { generateContent } from './services/geminiService';

const App: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<GenerationSession | null>(null);
  const [sessions, setSessions] = useState<GenerationSession[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);

  useEffect(() => {
    try {
      const storedSessions = localStorage.getItem('wassaf_sessions');
      if (storedSessions) {
        setSessions(JSON.parse(storedSessions));
      }
    } catch (e) {
      console.error("Failed to parse sessions from localStorage", e);
      setSessions([]);
    }
  }, []);

  const saveSessions = (updatedSessions: GenerationSession[]) => {
    setSessions(updatedSessions);
    localStorage.setItem('wassaf_sessions', JSON.stringify(updatedSessions));
  };

  const handleFormSubmit = useCallback(async (formData: DescriptionFormData) => {
    setIsLoading(true);
    setError(null);
    setCurrentSession(null);
    try {
      const { descriptions, analysis } = await generateContent(formData);
      
      const newSession: GenerationSession = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        formData,
        results: {
          descriptions,
          analysis: analysis || null,
        },
      };

      setCurrentSession(newSession);
      saveSessions([newSession, ...sessions]);

    } catch (err) {
      console.error(err);
      setError('حدث خطأ أثناء إنشاء المحتوى. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  }, [sessions]);

  const loadSession = (sessionId: string) => {
    const sessionToLoad = sessions.find(s => s.id === sessionId);
    if (sessionToLoad) {
      setCurrentSession(sessionToLoad);
      setIsHistoryVisible(false);
      setError(null);
      setIsLoading(false);
    }
  };

  const deleteSession = (sessionId: string) => {
    const updatedSessions = sessions.filter(s => s.id !== sessionId);
    saveSessions(updatedSessions);
    if (currentSession?.id === sessionId) {
      setCurrentSession(null);
    }
  };
  
  const clearResults = () => {
      setCurrentSession(null);
      setError(null);
  }

  const hasResults = currentSession !== null && currentSession.results.descriptions.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-indigo-100 text-slate-800">
      <Header onHistoryToggle={() => setIsHistoryVisible(!isHistoryVisible)} />
      <HistorySidebar 
        isVisible={isHistoryVisible} 
        onClose={() => setIsHistoryVisible(false)}
        sessions={sessions}
        onLoadSession={loadSession}
        onDeleteSession={deleteSession}
      />
      <main className="flex-grow container mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-4 xl:col-span-3 lg:sticky lg:top-8">
           <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-slate-200">
             <DescriptionForm onSubmit={handleFormSubmit} isLoading={isLoading} />
           </div>
        </div>
        <div className="lg:col-span-8 xl:col-span-9">
          <ResultsDisplay 
            isLoading={isLoading} 
            session={currentSession}
            error={error} 
            hasResults={hasResults}
            onClear={clearResults}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default App;