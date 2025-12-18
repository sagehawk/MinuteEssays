import React from 'react';

interface TimerProps {
  seconds: number;
  limit: number;
}

const Timer: React.FC<TimerProps> = ({ seconds, limit }) => {
  const remaining = Math.max(0, limit - seconds);
  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  
  // Visual states
  const isUrgent = remaining <= 60 && remaining > 10;
  const isCritical = remaining <= 10;

  let bgClass = "bg-slate-900 text-white";
  if (isUrgent) bgClass = "bg-amber-500 text-white shadow-lg shadow-amber-200";
  if (isCritical) bgClass = "bg-red-600 text-white urgent-pulse shadow-lg shadow-red-200";

  return (
    <div className={`
      relative overflow-hidden flex items-center justify-center font-mono text-2xl font-bold rounded-xl px-5 py-2 transition-all duration-500
      ${bgClass}
    `}>
      <span className="mr-3 text-xs font-sans uppercase tracking-widest opacity-80 font-semibold">
        {isCritical ? 'Hurry!' : 'Time Left'}
      </span>
      <div className="tabular-nums tracking-wider z-10">
        {m}:{s.toString().padStart(2, '0')}
      </div>
      
      {/* Background progress fill */}
      {!isCritical && !isUrgent && (
          <div 
            className="absolute bottom-0 left-0 h-1 bg-white/20 transition-all duration-1000 ease-linear"
            style={{ width: `${(remaining / limit) * 100}%` }}
          />
      )}
    </div>
  );
};

export default Timer;