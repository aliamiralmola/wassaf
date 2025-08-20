import React from 'react';
import type { GenerationSession } from '../types';
import { TrashIcon } from './icons/TrashIcon';

interface HistorySidebarProps {
  isVisible: boolean;
  onClose: () => void;
  sessions: GenerationSession[];
  onLoadSession: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => void;
}

export const HistorySidebar: React.FC<HistorySidebarProps> = ({ isVisible, onClose, sessions, onLoadSession, onDeleteSession }) => {
  if (!isVisible) return null;

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/30 z-30 transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      ></div>
      <aside 
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${isVisible ? 'translate-x-0' : 'translate-x-full'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-heading"
      >
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <h2 id="history-heading" className="text-lg font-bold text-slate-800">سجل الجلسات</h2>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100" aria-label="إغلاق">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
            </div>

            {sessions.length === 0 ? (
                <div className="flex-grow flex items-center justify-center text-center p-4">
                    <p className="text-sm text-slate-500">لا يوجد جلسات محفوظة حتى الآن.</p>
                </div>
            ) : (
                <ul className="flex-grow overflow-y-auto p-2">
                    {sessions.map(session => (
                        <li key={session.id} className="mb-2">
                            <div className="group flex items-center justify-between p-3 rounded-lg hover:bg-slate-50">
                                <button onClick={() => onLoadSession(session.id)} className="flex-grow text-right">
                                    <p className="text-sm font-semibold text-slate-800 truncate">{session.formData.productName || 'جلسة بدون عنوان'}</p>
                                    <p className="text-xs text-slate-500">{new Date(session.timestamp).toLocaleString('ar-EG')}</p>
                                </button>
                                <button
                                    onClick={(e) => { e.stopPropagation(); onDeleteSession(session.id); }}
                                    className="p-2 rounded-full text-slate-400 hover:bg-red-100 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                                    aria-label="حذف الجلسة"
                                >
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
      </aside>
    </>
  );
};
