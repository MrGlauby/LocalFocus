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

  const alertAudio = useRef<HTMLAudioElement | null>(null);

  // audio ini
  useEffect(() => {
    alertAudio.current = new Audio("/sounds/alert.mp3");
    alertAudio.current.preload = "auto";
  }, []);

  //helper
  const stopSound = useCallback(() => {
    if (alertAudio.current) {
      alertAudio.current.pause();
      alertAudio.current.currentTime = 0;
    }
  }, []);

  const pause = useCallback(() => setIsRunning(false), []);

  // start verhindern wenn zeit bereits 0 ist
  const start = useCallback(() => {
    if (timeLeft > 0) setIsRunning(true);
  }, [timeLeft]);

  const reset = useCallback(() => {
    setIsRunning(false);
    setTimeLeft(duration);
    stopSound(); // sound reset!
  }, [duration, stopSound]);

  const setDuration = useCallback(
    (minutes: number) => {
      setIsRunning(false);
      const seconds = Math.round(minutes * 60);
      setDurationState(seconds);
      setTimeLeft(seconds);
      stopSound(); // Fix: Sound aus bei Preset-Wahl
    },
    [stopSound],
  );

  const progress = duration > 0 ? (timeLeft / duration) * 100 : 0;

  useEffect(() => {
    if (!isRunning) return;

    intervalRef.current = setInterval(() => {
      let isDone = false;

      // 1. Zeit aktualisieren
      setTimeLeft((prev) => {
        if (prev <= 1) {
          isDone = true; // Lokale Variable setzen
          return 0;
        }
        return prev - 1;
      });

      if (isDone) {
        setIsRunning(false);
        alertAudio.current
          ?.play()
          .catch((err) => console.warn("SoundError:", err));
      }
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
