import React from 'react';
import { Phone, MicOff, Pause, ArrowRight } from 'lucide-react';
import { useCallCenter } from '../../context/CallCenterContext';
import { formatDuration } from '../../utils/formatters';

interface ActiveCallBannerProps {
  onReturnToCall: () => void;
}

export const ActiveCallBanner: React.FC<ActiveCallBannerProps> = ({ onReturnToCall }) => {
  const { activeCall, activeCallDuration, isCallEnded, isMuted, isOnHold } = useCallCenter();

  if (!activeCall) return null;

  return (
    <aside
      aria-label="Active call banner"
      className="bg-emerald-600 text-white px-4 py-2.5 shadow-md flex items-center justify-between transition-all border-b border-emerald-700 animate-fadeIn"
    >
      <div className="max-w-7xl mx-auto w-full flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-500/80 flex items-center justify-center animate-pulse">
            <Phone className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm tracking-tight">{activeCall.customerName}</span>
              <span className="text-emerald-100 text-xs hidden sm:inline">({activeCall.customerPhone})</span>
              <span className="bg-emerald-800/80 text-[11px] px-2 py-0.5 rounded font-mono font-medium">
                {isCallEnded ? 'Call Ended • Wrap-Up' : formatDuration(activeCallDuration)}
              </span>
            </div>
            <div className="text-[11px] text-emerald-100 flex items-center gap-2">
              <span>Queue: {activeCall.queue}</span>
              {isOnHold && (
                <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.2 rounded font-semibold flex items-center gap-1">
                  <Pause className="w-3 h-3" /> ON HOLD
                </span>
              )}
              {isMuted && (
                <span className="bg-rose-500 text-white text-[10px] px-1.5 py-0.2 rounded font-semibold flex items-center gap-1">
                  <MicOff className="w-3 h-3" /> MUTED
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={onReturnToCall}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-semibold rounded-lg shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-white"
        >
          <span>Return to Active Call</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};

