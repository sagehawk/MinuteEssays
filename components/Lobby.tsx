import React, { useState, useEffect } from 'react';
import Button from './Button';

interface LobbyProps {
  encodedTopic: string;
  onStart: () => void;
  onCancel: () => void;
}

const Lobby: React.FC<LobbyProps> = ({ encodedTopic, onStart, onCancel }) => {
  const [inviteUrl, setInviteUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [countDownToSync, setCountDownToSync] = useState<number | null>(null);

  useEffect(() => {
    try {
      // Construct a clean URL without existing query params or hashes
      // using origin + pathname ensures we strip out anything else
      const url = new URL(window.location.pathname, window.location.origin);
      url.searchParams.set('challenge', encodedTopic);
      setInviteUrl(url.toString());
    } catch (e) {
      // Fallback for weird environments (like some preview blobs)
      const url = new URL(window.location.href);
      url.searchParams.set('challenge', encodedTopic);
      setInviteUrl(url.toString());
    }
  }, [encodedTopic]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  const handleSyncStart = () => {
    // Logic to sync start times without a socket server.
    // We wait for the next 10-second mark on the system clock.
    const now = new Date();
    const msUntilNext10s = 10000 - (now.getTime() % 10000);
    
    // Set a visual countdown
    const targetTime = now.getTime() + msUntilNext10s;
    
    setCountDownToSync(Math.ceil(msUntilNext10s / 1000));

    const interval = setInterval(() => {
      const remaining = targetTime - Date.now();
      if (remaining <= 0) {
        clearInterval(interval);
        onStart();
      } else {
        setCountDownToSync(Math.ceil(remaining / 1000));
      }
    }, 100);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center animate-fadeIn max-w-2xl mx-auto">
      <div className="bg-white p-8 rounded-3xl shadow-2xl border border-slate-200 w-full relative overflow-hidden">
        {/* Decorative background element */}
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

        <div className="mb-8">
           <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold tracking-wider uppercase mb-4">
             Multiplayer Challenge
           </span>
           <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Essay Lobby</h2>
           <p className="text-slate-500">Send the link to your friends. Press "Start" together.</p>
        </div>

        {/* Invite Link Section */}
        <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-200">
           <label className="block text-left text-xs font-bold text-slate-400 uppercase mb-2">Invite Link</label>
           <div className="flex gap-2">
             <input 
               readOnly 
               value={inviteUrl} 
               className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-600 focus:outline-none"
             />
             <button 
               onClick={handleCopy}
               className="bg-white border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 text-slate-700 font-semibold px-4 py-2 rounded-lg text-sm transition-colors flex items-center"
             >
               {copied ? (
                 <span className="text-green-600">Copied!</span>
               ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                 </svg>
               )}
             </button>
           </div>
           {inviteUrl.startsWith('blob:') && (
             <p className="text-xs text-amber-600 mt-2 text-left">
               <strong>Note:</strong> You are viewing a local preview URL (blob). You must deploy this app (e.g. to Vercel) to get a shareable link.
             </p>
           )}
        </div>

        {/* Topic Placeholder */}
        <div className="mb-8 relative group cursor-help">
          <div className="text-sm text-slate-400 font-medium mb-2">Topic Status</div>
          <div className="h-16 bg-slate-100 rounded-xl flex items-center justify-center border border-dashed border-slate-300">
             <span className="flex items-center text-slate-400 font-mono text-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                HIDDEN UNTIL START
             </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {countDownToSync !== null ? (
            <div className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold text-2xl animate-pulse shadow-lg shadow-indigo-200">
               Starting in {countDownToSync}...
            </div>
          ) : (
            <Button onClick={handleSyncStart} className="w-full py-4 text-lg">
               Sync Start (Wait for :00)
            </Button>
          )}
          
          <button 
            onClick={onCancel}
            disabled={countDownToSync !== null}
            className="w-full py-3 text-slate-400 hover:text-slate-600 font-medium transition-colors text-sm"
          >
            Cancel Challenge
          </button>
        </div>
        
        <p className="mt-4 text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
          <strong className="text-slate-500">How to sync:</strong> Get on a call with your friend. Count to 3, and both click "Sync Start". The app will align the start time automatically to the nearest 10-second mark.
        </p>
      </div>
    </div>
  );
};

export default Lobby;