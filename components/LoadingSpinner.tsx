
import React, { useState, useEffect } from 'react';

const messages = [
  "نبحث عن الكلمات المثالية...",
  "نصوغ الأفكار الإبداعية...",
  "نضيف لمسة من السحر...",
  "نصقل كل جملة بعناية...",
  "على وشك الانتهاء...",
];

export const LoadingSpinner: React.FC = () => {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl shadow-lg border border-slate-200 min-h-[400px]">
      <div className="w-16 h-16 border-4 border-t-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
      <p className="mt-6 text-lg font-semibold text-slate-700">جاري إنشاء الأوصاف...</p>
      <p className="mt-2 text-slate-500 transition-opacity duration-500">
        {messages[messageIndex]}
      </p>
    </div>
  );
};
