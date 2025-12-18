import React, { useEffect, useRef } from 'react';
import { SectionConfig } from '../types';

interface WritingCardProps {
  config: SectionConfig;
  value: string;
  onChange: (text: string) => void;
  onNext: () => void;
  isLast: boolean;
  isActive: boolean;
}

const WritingCard: React.FC<WritingCardProps> = ({ config, value, onChange, onNext, isLast, isActive }) => {
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  // Word count logic
  const wordCount = value.trim().split(/\s+/).filter(w => w.length > 0).length;
  const sentenceCount = value.split(/[.!?]+/).filter(s => s.trim().length > 0).length;
  const wordsRemaining = Math.max(0, config.suggestedWordCount - wordCount);

  // Auto-focus logic
  useEffect(() => {
    if (isActive && textAreaRef.current) {
      textAreaRef.current.focus();
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="w-full max-w-3xl mx-auto animate-fadeIn duration-500">
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden border border-slate-100 ring-1 ring-slate-900/5">
        
        {/* Card Header */}
        <div className="px-8 py-6 border-b border-slate-50 bg-gradient-to-r from-white to-slate-50">
          <div className="flex justify-between items-start mb-2">
            <div>
              <span className="text-xs font-bold text-indigo-500 tracking-wider uppercase mb-1 block">Current Section</span>
              <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{config.title}</h2>
            </div>
            <div className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-600 rounded-full border border-slate-200">
              Target: {config.suggestedWordCount} words
            </div>
          </div>
          <p className="text-slate-500 text-base leading-relaxed max-w-xl">{config.description}</p>
        </div>

        {/* Writing Area */}
        <div className="p-8">
          <div className="relative group">
            <textarea
              ref={textAreaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              className="w-full h-64 p-0 text-xl text-slate-700 bg-transparent border-none focus:ring-0 resize-none placeholder-slate-300 leading-relaxed"
              placeholder={`Start writing your ${config.title.toLowerCase()} here...`}
              spellCheck={false}
            />
            {/* Subtle line indicator for focus */}
            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-100 group-focus-within:bg-indigo-500 transition-colors duration-300"></div>
          </div>
          
          {/* Stats Bar */}
          <div className="mt-6 flex items-center justify-between text-sm font-medium">
            <div className="flex items-center space-x-6 text-slate-400">
              <div className={`flex items-center transition-colors ${wordsRemaining === 0 ? 'text-green-600 font-bold' : ''}`}>
                <svg className="w-4 h-4 mr-2 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                {wordsRemaining > 0 ? `${wordsRemaining} words to go` : 'Target met'}
              </div>
              <div className="flex items-center">
                 <span className="w-1 h-1 rounded-full bg-slate-300 mr-6"></span>
                 {sentenceCount} sentences
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-8 py-5 bg-slate-50/80 border-t border-slate-100 flex justify-between items-center backdrop-blur-sm">
          <span className="text-xs text-slate-400 font-medium">
            {isLast ? "Final Section" : "Press Enter to continue"}
          </span>
          <button
            onClick={onNext}
            className="group relative inline-flex items-center justify-center px-8 py-3 text-base font-semibold text-white transition-all duration-200 bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 hover:shadow-lg hover:-translate-y-0.5"
          >
            {isLast ? 'Submit Essay' : 'Next Section'}
            <svg className="w-5 h-5 ml-2 -mr-1 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WritingCard;