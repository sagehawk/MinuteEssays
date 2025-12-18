import React, { useState } from 'react';
import { EssayData } from '../types';
import { SECTIONS } from '../constants';
import { generateReviewPrompt } from '../services/geminiService';
import Button from './Button';

interface ResultViewProps {
  data: EssayData;
  onRestart: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ data, onRestart }) => {
  const [hasCopied, setHasCopied] = useState(false);

  const handleOpenGemini = async () => {
    const prompt = generateReviewPrompt(data);
    
    try {
      await navigator.clipboard.writeText(prompt);
      setHasCopied(true);
      
      // Give the user a moment to see "Copied" before opening
      setTimeout(() => {
        window.open('https://gemini.google.com/app', '_blank');
        setHasCopied(false);
      }, 800);
      
    } catch (err) {
      console.error('Failed to copy text: ', err);
      alert('Could not copy to clipboard. Please manually copy your essay.');
    }
  };

  const minutes = Math.floor(data.totalTimeSeconds / 60);
  const seconds = data.totalTimeSeconds % 60;
  const isOvertime = data.totalTimeSeconds > 300;

  const totalWords = Object.values(data.sections).reduce((acc, text) => {
    return acc + (text as string).trim().split(/\s+/).filter(w => w.length > 0).length;
  }, 0);

  const wpm = Math.round(totalWords / (data.totalTimeSeconds / 60));

  return (
    <div className="max-w-4xl mx-auto pb-24">
      <div className="text-center mb-12 animate-fadeIn">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Essay Completed!</h1>
        <p className="text-slate-500 text-lg">Here is how you performed under pressure.</p>
        
        <div className="grid grid-cols-3 gap-4 mt-8 max-w-2xl mx-auto">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="text-sm text-slate-500 uppercase font-bold tracking-wider">Total Time</div>
            <div className={`text-3xl font-bold ${isOvertime ? 'text-red-500' : 'text-indigo-600'}`}>
              {minutes}:{seconds.toString().padStart(2, '0')}
            </div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="text-sm text-slate-500 uppercase font-bold tracking-wider">Word Count</div>
            <div className="text-3xl font-bold text-indigo-600">{totalWords}</div>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
            <div className="text-sm text-slate-500 uppercase font-bold tracking-wider">Speed</div>
            <div className="text-3xl font-bold text-indigo-600">{wpm} <span className="text-sm text-slate-400 font-normal">WPM</span></div>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Essay Content */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-slate-50 p-4 border-b border-slate-200">
              <h2 className="font-bold text-slate-700">Your Work: {data.topic}</h2>
            </div>
            <div className="p-6 space-y-6">
              {SECTIONS.map((section) => (
                <div key={section.id} className="border-b border-slate-100 last:border-0 pb-4 last:pb-0">
                  <h3 className="text-xs font-bold text-slate-400 uppercase mb-2">{section.title}</h3>
                  <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">
                    {data.sections[section.id] || <span className="text-slate-300 italic">No content written.</span>}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gemini Instructions Section */}
        <div className="space-y-6">
             <div className="bg-indigo-900 rounded-2xl shadow-xl overflow-hidden p-8 text-center text-white flex flex-col items-center justify-center min-h-[300px]">
                <div className="mb-6 bg-indigo-800 p-4 rounded-full">
                    {/* Gemini Sparkle Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    </svg>
                </div>
                <h3 className="text-2xl font-bold mb-4">Review with Gemini Web</h3>
                <p className="text-indigo-200 mb-8 max-w-xs text-sm leading-relaxed">
                   Since this is the free version, we will copy your essay and prompt to your clipboard. 
                   <br/><br/>
                   Just paste it (Ctrl+V) into the Gemini text box when the new tab opens!
                </p>
                
                <Button onClick={handleOpenGemini} variant="secondary" className="w-full sm:w-auto relative">
                    {hasCopied ? (
                        <span className="flex items-center gap-2 text-green-700">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            Copied! Opening...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            Copy & Open Gemini
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </span>
                    )}
                </Button>
             </div>
        </div>
      </div>

        <div className="fixed bottom-0 left-0 w-full bg-white border-t border-slate-200 p-4 flex justify-center z-50 shadow-md">
            <Button onClick={onRestart} variant="primary">
                Start New Essay
            </Button>
        </div>
    </div>
  );
};

export default ResultView;