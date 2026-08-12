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



// new methode
export function pointToAngle(
  cx: number,
  cy: number,
  px: number,
  py: number,
): number {
  const dx = px - cx;
  const dy = py - cy;
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
  return (angle + 360) % 360;
}

export function angleToMinutes(angle: number, totalMinutes: number): number {
  if (totalMinutes <= 0) return 0;
  const raw = Math.round((angle / 360) * totalMinutes);
  return Math.min(totalMinutes, Math.max(1, raw));
}


// new
export function angleToSeconds(angle: number, totalSeconds: number): number {
  if (totalSeconds <= 0) return 0;
  const raw = Math.round((angle / 360) * totalSeconds);
  return Math.min(totalSeconds, Math.max(1, raw));
}

// new methode

export function minutesToAngle(minutes: number, totalMinutes: number): number {
  if (totalMinutes <= 0) return 0;
  return (minutes / totalMinutes) * 360;
}