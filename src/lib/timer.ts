export const CIRCLE_MINUTES = 60;

export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

export function minutesToSeconds(minutes: number): number {
  return minutes * 60;
}

export function calculateAngle(remaining: number, total: number): number {
  if (total === 0) return 0;
  return (remaining / total) * 360;
}
