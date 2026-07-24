"use client";

interface CircleTimerProps {
  progress: number;
  size?: number;
  color?: string;
  bgColor?: string;
  children?: React.ReactNode;
}

export function CircleTimer({
  progress,
  size = 280,
  color = "#e63946",
  bgColor = "#e5e5e5",
  children,
}: CircleTimerProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2;

  const startAngle = -Math.PI / 2;
  const endAngle = startAngle + (progress / 100) * 2 * Math.PI;

  const endX = cx + radius * Math.cos(endAngle);
  const endY = cy + radius * Math.sin(endAngle);
  const largeArc = progress > 50 ? 1 : 0;

  const sectorPath =
    progress <= 0
      ? ""
      : progress >= 100
        ? `M ${cx} ${cy - radius} A ${radius} ${radius} 0 1 1 ${cx - 0.01} ${cy - radius} Z`
        : `M ${cx} ${cy} L ${cx} ${cy - radius} A ${radius} ${radius} 0 ${largeArc} 1 ${endX} ${endY} Z`;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={radius} fill={bgColor} />
        {sectorPath && <path d={sectorPath} fill={color} />}
      </svg>
      {children && (
        <div className="absolute inset-0 flex items-center justify-center">
          {children}
        </div>
      )}
    </div>
  );
}
