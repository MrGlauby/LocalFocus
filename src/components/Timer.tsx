"use client";

import { CircleTimer } from "@/src/components/CircleTimer";
import { useTimer } from "@/src/hooks/useTimer";
import { formatTime, CIRCLE_MINUTES } from "@/src/lib/timer";

const PRESETS = [25, 15, 10, 5] as const;

export function Timer() {
  const { timeLeft, duration, isRunning, start, pause, reset, setDuration } =
    useTimer(25);

  const currentMinutes = Math.round(duration / 60);
  const progress = (timeLeft / (CIRCLE_MINUTES * 60)) * 100;

  return (
    <div className="flex flex-col items-center gap-8">
      <CircleTimer progress={progress} size={300}>
        <span className="text-4xl font-mono font-semibold tabular-nums text-gray-800">
          {formatTime(timeLeft)}
        </span>
      </CircleTimer>

      <div className="flex gap-3">
        {!isRunning ? (
          <button
            onClick={start}
            className="rounded-full bg-[#e63946] px-6 py-3 text-white font-semibold transition-colors hover:bg-[#c1121f]"
          >
            Start
          </button>
        ) : (
          <button
            onClick={pause}
            className="rounded-full bg-[#e63946] px-6 py-3 text-white font-semibold transition-colors hover:bg-[#c1121f]"
          >
            Pause
          </button>
        )}
        <button
          onClick={reset}
          className="rounded-full bg-gray-200 px-6 py-3 text-gray-700 font-semibold transition-colors hover:bg-gray-300"
        >
          Reset
        </button>
      </div>

      <div className="flex gap-2">
        {PRESETS.map((min) => (
          <button
            key={min}
            onClick={() => setDuration(min)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentMinutes === min
                ? "bg-[#e63946] text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {min} min
          </button>
        ))}
      </div>
    </div>
  );
}
