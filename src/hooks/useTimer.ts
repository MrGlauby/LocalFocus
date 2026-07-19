"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseTimerReturn {
  timeLeft: number;
  duration: number;
  isRunning: boolean;
  progress: number;
  start: () => void;
  pause: () => void;
  reset: () => void;
  setDuration: (minutes: number) => void;
}

export function useTimer(initialMinutes: number = 25): UseTimerReturn {
  const [duration, setDurationState] = useState(initialMinutes * 60);
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(duration);
  }, [duration]);

  const setDuration = useCallback((minutes: number) => {
    setIsRunning(false);
    setDurationState(minutes * 60);
    setTimeLeft(minutes * 60);
  }, []);

  const progress = duration > 0 ? (timeLeft / duration) * 100 : 0;

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  return {
    timeLeft,
    duration,
    isRunning,
    progress,
    start,
    pause,
    reset,
    setDuration,
  };
}
