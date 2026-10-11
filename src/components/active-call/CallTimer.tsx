import React from 'react';
import { Clock, Volume2, MicOff, Pause } from 'lucide-react';
import { formatDuration } from '../../utils/formatters';

interface CallTimerProps {
  durationSeconds: number;
  isCallEnded: boolean;
  isOnHold: boolean;
  isMuted: boolean;
}

export const CallTimer: React.FC<CallTimerProps> = ({
  durationSeconds,
  isCallEnded,
  isOnHold,
  isMuted,
}) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-slate-900 text-white rounded-xl shadow-inner gap-4">
      {/* Timer and status */}
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isCallEnded
              ? 'bg-slate-700 text-slate-300'
              : isOnHold
              ? 'bg-amber-600 text-white animate-pulse'
              : 'bg-emerald-600 text-white animate-pulse'
          }`}
        >
          {isCallEnded ? (
            <Clock className="w-5 h-5" />
          ) : isOnHold ? (
            <Pause className="w-5 h-5" />
          ) : (
            <Volume2 className="w-5 h-5" />
          )}
        </div>

        <div>
          <div className="text-2xl sm:text-3xl font-mono font-bold tracking-wider">
            {formatDuration(durationSeconds)}
          </div>
          <div className="text-xs text-slate-400 flex items-center gap-2">
            {isCallEnded ? (
              <span className="text-amber-400 font-semibold">● Call Disconnected • Wrap-Up Mode</span>
            ) : isOnHold ? (
              <span className="text-amber-400 font-semibold">● Call On Hold (Timer Paused)</span>
            ) : (
              <span className="text-emerald-400 font-semibold">● Call Active & Encrypted</span>
            )}
            {isMuted && !isCallEnded && (
              <span className="text-rose-400 font-semibold flex items-center gap-1">
                <MicOff className="w-3 h-3" /> Muted
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Simulated Live Audio Waveform (Enterprise feel) */}
      {!isCallEnded && !isOnHold && (
        <div className="flex items-center gap-1 h-8 px-4 bg-slate-800/80 rounded-lg border border-slate-700">
          <span className="text-[10px] text-slate-400 mr-2 font-mono uppercase">Audio In:</span>
          <div className="w-1 h-3 bg-emerald-400 rounded-full animate-[pulse_0.6s_ease-in-out_infinite]" />
          <div className="w-1 h-5 bg-emerald-500 rounded-full animate-[pulse_0.4s_ease-in-out_infinite]" />
          <div className="w-1 h-7 bg-emerald-400 rounded-full animate-[pulse_0.8s_ease-in-out_infinite]" />
          <div className="w-1 h-4 bg-emerald-500 rounded-full animate-[pulse_0.5s_ease-in-out_infinite]" />
          <div className="w-1 h-6 bg-emerald-400 rounded-full animate-[pulse_0.7s_ease-in-out_infinite]" />
          <div className="w-1 h-3 bg-emerald-500 rounded-full animate-[pulse_0.3s_ease-in-out_infinite]" />
        </div>
      )}
    </div>
  );
};

