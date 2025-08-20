
import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white mt-8 py-4 border-t border-slate-200">
      <div className="container mx-auto px-4 text-center">
        <p className="text-sm text-slate-500">
          &copy; {new Date().getFullYear()} وصّاف. كل الحقوق محفوظة.
        </p>
      </div>
    </footer>
  );
};
