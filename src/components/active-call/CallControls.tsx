import React from 'react';
import { 
  Mic, 
  MicOff, 
  Pause, 
  Play, 
  PhoneOff, 
  PhoneForwarded
} from 'lucide-react';

interface CallControlsProps {
  isMuted: boolean;
  isOnHold: boolean;
  isCallEnded: boolean;
  onToggleMute: () => void;
  onToggleHold: () => void;
  onEndCall: () => void;
}

export const CallControls: React.FC<CallControlsProps> = ({
  isMuted,
  isOnHold,
  isCallEnded,
  onToggleMute,
  onToggleHold,
  onEndCall,
}) => {
  if (isCallEnded) {
    return (
      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-center text-xs text-amber-800">
        <p className="font-semibold">Call has concluded.</p>
        <p className="mt-0.5 text-amber-700">Please review notes, select a disposition below, and click &quot;Save and Close&quot; to conclude the interaction.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-200">
      {/* Mute Button */}
      <button
        onClick={onToggleMute}
        aria-pressed={isMuted}
        aria-label={isMuted ? 'Unmute microphone' : 'Mute microphone'}
        className={`flex flex-col items-center justify-center w-20 h-16 rounded-xl border text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs ${
          isMuted
            ? 'bg-rose-50 border-rose-300 text-rose-700 hover:bg-rose-100 ring-2 ring-rose-200'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
        }`}
      >
        {isMuted ? <MicOff className="w-5 h-5 text-rose-600 mb-1" /> : <Mic className="w-5 h-5 text-slate-600 mb-1" />}
        <span>{isMuted ? 'Unmute' : 'Mute'}</span>
      </button>

      {/* Hold Button */}
      <button
        onClick={onToggleHold}
        aria-pressed={isOnHold}
        aria-label={isOnHold ? 'Resume call from hold' : 'Put customer on hold'}
        className={`flex flex-col items-center justify-center w-20 h-16 rounded-xl border text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs ${
          isOnHold
            ? 'bg-amber-50 border-amber-300 text-amber-800 hover:bg-amber-100 ring-2 ring-amber-200'
            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
        }`}
      >
        {isOnHold ? <Play className="w-5 h-5 text-amber-600 mb-1" /> : <Pause className="w-5 h-5 text-slate-600 mb-1" />}
        <span>{isOnHold ? 'Resume' : 'Hold'}</span>
      </button>

      {/* Transfer mock button */}
      <button
        onClick={() => alert('Warm / Blind Transfer modal would open here to forward caller to Tier 2 Support.')}
        className="flex flex-col items-center justify-center w-20 h-16 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-2xs"
        title="Transfer Call"
      >
        <PhoneForwarded className="w-5 h-5 text-slate-600 mb-1" />
        <span>Transfer</span>
      </button>

      {/* End Call Button */}
      <button
        onClick={onEndCall}
        className="flex flex-col items-center justify-center w-24 h-16 rounded-xl bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-rose-500 focus:ring-offset-2 shadow-sm ml-2"
        aria-label="Disconnect and end active call"
      >
        <PhoneOff className="w-5 h-5 text-white mb-1" />
        <span>End Call</span>
      </button>
    </div>
  );
};
