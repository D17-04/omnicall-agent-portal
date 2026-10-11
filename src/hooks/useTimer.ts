import { useState, useEffect } from 'react';
import { formatDuration } from '../utils/formatters';

interface UseTimerOptions {
  isRunning: boolean;
  initialSeconds?: number;
  onTick?: (seconds: number) => void;
}

export function useTimer({ isRunning, initialSeconds = 0, onTick }: UseTimerOptions) {
  const [seconds, setSeconds] = useState<number>(initialSeconds);

  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          const next = prev + 1;
          if (onTick) onTick(next);
          return next;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, onTick]);

  const reset = (to = 0) => setSeconds(to);

  return {
    seconds,
    formatted: formatDuration(seconds),
    reset,
  };
}
