import React, { useState, useEffect, useCallback } from 'react';
import { AppPhase, EssayData, EssayHistoryItem } from './types';
import { TOTAL_TIME_LIMIT_SECONDS, TOPICS, SECTIONS } from './constants';
import Timer from './components/Timer';
import WritingCard from './components/WritingCard';
import ResultView from './components/ResultView';
import Button from './components/Button';
import HistoryList from './components/HistoryList';
import { getEssayHistory, saveEssayToHistory, clearHistory } from './utils/storage';

const App: React.FC = () => {
  const [phase, setPhase] = useState<AppPhase>(AppPhase.IDLE);
  const [currentTopic, setCurrentTopic] = useState<string>('');
  const [customTopicInput, setCustomTopicInput] = useState('');
  
  // We hoist the state here so we can submit whatever is written when time runs out
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentSectionText, setCurrentSectionText] = useState('');
  const [essayContent, setEssayContent] = useState<{ [key: string]: string }>({});
  
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [history, setHistory] = useState<EssayHistoryItem[]>([]);
  
  // Load history on mount
  useEffect(() => {
    setHistory(getEssayHistory());
  }, []);

  const finishEssay = useCallback((finalContent: { [key: string]: string }, finalTime: number) => {
    // Calculate stats
    const totalWords = Object.values(finalContent).reduce((acc, text) => {
      return acc + (text as string).trim().split(/\s+/).filter(w => w.length > 0).length;
    }, 0);
    // Avoid division by zero
    const safeTime = finalTime === 0 ? 1 : finalTime;
    const wpm = Math.round(totalWords / (safeTime / 60)) || 0;

    const historyItem: EssayHistoryItem = {
      id: Date.now().toString(),
      topic: currentTopic,
      sections: finalContent,
      totalTimeSeconds: finalTime,
      date: new Date().toISOString(),
      wpm: wpm
    };

    saveEssayToHistory(historyItem);
    setHistory(prev => [historyItem, ...prev]);
    setPhase(AppPhase.COMPLETED);
  }, [currentTopic]);

  // Timer & Auto-Submit Logic
  useEffect(() => {
    let interval: any;
    if (phase === AppPhase.WRITING) {
      interval = setInterval(() => {
        setElapsedSeconds(prev => {
          const nextVal = prev + 1;
          
          // STRICT AUTO-SUBMIT CHECK
          if (nextVal >= TOTAL_TIME_LIMIT_SECONDS) {
            clearInterval(interval);
            // Capture current state immediately
            // Note: We use the function scope variable or refs usually, 
            // but here we need to rely on the latest state from the closure or force a sync.
            // Since this is inside setElapsedSeconds, we might not have access to the *very* latest text typed in the last millisecond 
            // if React hasn't re-rendered, but strictly speaking, we need to trigger the finish effect.
            return nextVal; 
          }
          return nextVal;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [phase]);

  // Effect to trigger finish when time is up
  // We separate this from the interval to ensure we have access to currentSectionText state
  useEffect(() => {
    if (phase === AppPhase.WRITING && elapsedSeconds >= TOTAL_TIME_LIMIT_SECONDS) {
       // Save the current section text before finishing
       const currentSectionId = SECTIONS[currentSectionIndex].id;
       const finalContent = {
         ...essayContent,
         [currentSectionId]: currentSectionText
       };
       finishEssay(finalContent, elapsedSeconds);
    }
  }, [elapsedSeconds, phase, finishEssay, currentSectionText, essayContent, currentSectionIndex, currentSectionText]);


  const startSession = useCallback(() => {
    const topicToUse = customTopicInput.trim() 
      ? customTopicInput.trim() 
      : TOPICS[Math.floor(Math.random() * TOPICS.length)];
      
    setCurrentTopic(topicToUse);
    setEssayContent({});
    setCurrentSectionText('');
    setCurrentSectionIndex(0);
    setElapsedSeconds(0);
    setPhase(AppPhase.WRITING);
  }, [customTopicInput]);

  const handleNextSection = () => {
    const currentSectionId = SECTIONS[currentSectionIndex].id;
    
    // Save content locally
    const updatedContent = {
      ...essayContent,
      [currentSectionId]: currentSectionText
    };
    setEssayContent(updatedContent);
    setCurrentSectionText(''); // Clear for next section

    if (currentSectionIndex < SECTIONS.length - 1) {
      setCurrentSectionIndex(prev => prev + 1);
    } else {
      finishEssay(updatedContent, elapsedSeconds);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear your essay history?")) {
      clearHistory();
      setHistory([]);
    }
  };

  const renderContent = () => {
    switch (phase) {
      case AppPhase.IDLE:
        return (
          <div className="min-h-screen flex flex-col items-center p-6 text-center max-w-2xl mx-auto pt-20 animate-fadeIn">
            <div className="mb-8 p-6 bg-white rounded-3xl shadow-xl shadow-indigo-100 ring-1 ring-slate-100 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-50 to-white opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-600 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
            </div>
            <h1 className="text-6xl font-extrabold text-slate-900 mb-6 tracking-tight">Minute Essays</h1>
            <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-lg font-light">
              Sharpen your thinking. <strong className="text-indigo-600 font-semibold">5 minutes. 5 paragraphs.</strong><br/>
              Write fast. Think faster.
            </p>

            <div className="w-full max-w-md space-y-4 mb-12">
              <div className="relative group">
                <input 
                  type="text" 
                  value={customTopicInput}
                  onChange={(e) => setCustomTopicInput(e.target.value)}
                  placeholder="Enter a specific topic (optional)..."
                  className="w-full px-6 py-4 pr-12 rounded-xl bg-white border border-slate-200 text-slate-800 shadow-sm focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-lg placeholder-slate-400"
                />
                <div className="absolute right-4 top-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
              </div>
              
              <Button onClick={startSession} className="w-full text-lg py-4 shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transform hover:-translate-y-1">
                {customTopicInput ? 'Start Custom Session' : 'Start Random Challenge'}
              </Button>
            </div>

            <HistoryList history={history} onClear={handleClearHistory} />
          </div>
        );

      case AppPhase.WRITING:
        return (
          <div className="min-h-screen flex flex-col">
            {/* Glass Header */}
            <div className="sticky top-0 z-40 glass-panel border-b border-slate-200/50 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Your Topic</span>
                        <span className="text-sm font-bold text-slate-800 truncate max-w-[150px] sm:max-w-md" title={currentTopic}>
                          {currentTopic}
                        </span>
                    </div>
                    <Timer seconds={elapsedSeconds} limit={TOTAL_TIME_LIMIT_SECONDS} />
                </div>
                {/* Progress Bar */}
                <div className="h-1.5 w-full bg-slate-100">
                    <div 
                        className="h-full bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)] transition-all duration-700 ease-out rounded-r-full"
                        style={{ width: `${((currentSectionIndex + 1) / SECTIONS.length) * 100}%` }}
                    />
                </div>
            </div>

            <div className="flex-grow p-4 sm:p-8 flex items-start justify-center overflow-y-auto">
                {/* We pass the state down to the card */}
                <WritingCard 
                    config={SECTIONS[currentSectionIndex]}
                    value={currentSectionText}
                    onChange={setCurrentSectionText}
                    onNext={handleNextSection}
                    isLast={currentSectionIndex === SECTIONS.length - 1}
                    isActive={true}
                />
            </div>
          </div>
        );

      case AppPhase.COMPLETED:
        return (
            <div className="min-h-screen p-6">
                 <ResultView 
                    data={{
                        topic: currentTopic,
                        sections: essayContent,
                        totalTimeSeconds: elapsedSeconds
                    }}
                    onRestart={() => setPhase(AppPhase.IDLE)}
                 />
            </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="antialiased text-slate-900 selection:bg-indigo-100 selection:text-indigo-800">
      {renderContent()}
    </div>
  );
};

export default App;