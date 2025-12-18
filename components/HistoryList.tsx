import React, { useState } from 'react';
import { EssayHistoryItem } from '../types';
import { SECTIONS } from '../constants';
import Button from './Button';

interface HistoryListProps {
  history: EssayHistoryItem[];
  onClear: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onClear }) => {
  const [selectedEssay, setSelectedEssay] = useState<EssayHistoryItem | null>(null);

  if (history.length === 0) return null;

  return (
    <div className="w-full max-w-2xl mx-auto mt-12 animate-fadeIn">
      <div className="flex justify-between items-end mb-4 border-b border-slate-200 pb-2">
        <h3 className="text-xl font-bold text-slate-800">Recent Essays</h3>
        <button onClick={onClear} className="text-xs text-red-500 hover:text-red-700 underline">
          Clear History
        </button>
      </div>
      
      <div className="space-y-3">
        {history.map((item) => (
          <div 
            key={item.id} 
            onClick={() => setSelectedEssay(item)}
            className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">{item.topic}</h4>
                <p className="text-xs text-slate-400 mt-1">
                  {new Date(item.date).toLocaleDateString()} at {new Date(item.date).toLocaleTimeString()}
                </p>
              </div>
              <div className="text-right">
                <span className="inline-block bg-slate-100 text-slate-600 text-xs font-bold px-2 py-1 rounded">
                  {item.wpm} WPM
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for viewing past essay */}
      {selectedEssay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={() => setSelectedEssay(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[80vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 truncate pr-4">{selectedEssay.topic}</h3>
              <button 
                onClick={() => setSelectedEssay(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto">
              {SECTIONS.map((section) => (
                <div key={section.id} className="mb-6 last:mb-0">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">{section.title}</h4>
                  <p className="text-slate-800 whitespace-pre-wrap">{selectedEssay.sections[section.id]}</p>
                </div>
              ))}
            </div>
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
               <Button variant="secondary" onClick={() => setSelectedEssay(null)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HistoryList;