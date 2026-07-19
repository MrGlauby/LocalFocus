export type TimerMode = "pomodoro" | "break";

export interface TimerState {
  timeLeft: number;
  duration: number;
  isRunning: boolean;
  mode: TimerMode;
}
