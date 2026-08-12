"use client";

import { useRef } from "react";
import {
  pointToAngle,
  angleToSeconds,
  minutesToAngle,
  formatTime,
} from "@/src/lib/timer";

interface CircleTimerProps {
  progress: number;
  size?: number;
  color?: string;
  bgColor?: string;
  minutes?: number;
  maxMinutes?: number;
  onChange?: (minutes: number) => void;
  children?: React.ReactNode;
}

export function CircleTimer({
  progress,
  size = 280,
  color = "#e63946",
  bgColor = "#e5e5e5",
  minutes = 25,
  maxMinutes = 60,
  onChange,
  children,
}: CircleTimerProps) {
  const cx = size / 2;
  const cy = size / 2;
  const radius = size / 2;
  const svgRef = useRef<SVGSVGElement | null>(null);
  const draggingRef = useRef(false);

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

  const pointerAngleRad =
    ((minutesToAngle(minutes, maxMinutes) - 90) * Math.PI) / 180;
  const pointerX = cx + radius * Math.cos(pointerAngleRad);
  const pointerY = cy + radius * Math.sin(pointerAngleRad);

  const updateFromPointer = (clientX: number, clientY: number) => {
    if (!onChange || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const localX = ((clientX - rect.left) / rect.width) * size;
    const localY = ((clientY - rect.top) / rect.height) * size;

    const angle = pointToAngle(cx, cy, localX, localY);
    const seconds = angleToSeconds(angle, maxMinutes * 60);
    if (seconds !== Math.round(minutes * 60)) onChange(seconds / 60);
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        ref={svgRef}
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="touch-none"
        onPointerDown={(e) => {
          draggingRef.current = true;
          e.currentTarget.setPointerCapture(e.pointerId);
          updateFromPointer(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (draggingRef.current) updateFromPointer(e.clientX, e.clientY);
        }}
        onPointerUp={(e) => {
          draggingRef.current = false;
          e.currentTarget.releasePointerCapture(e.pointerId);
        }}
        onPointerCancel={() => {
          draggingRef.current = false;
        }}
      >
        <circle cx={cx} cy={cy} r={radius} fill={bgColor} />
        {sectorPath && <path d={sectorPath} fill={color} />}
        {onChange && (
          <>
            <line
              x1={cx}
              y1={cy}
              x2={pointerX}
              y2={pointerY}
              stroke={color}
              strokeWidth={3}
            />
            <circle
              cx={pointerX}
              cy={pointerY}
              r={10}
              fill="#fff"
              stroke={color}
              strokeWidth={3}
            />
          </>
        )}
      </svg>
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {onChange ? (
          <input
            type="text"
            inputMode="numeric"
            value={formatTime(minutes * 60)}
            onChange={(e) => {
              const parsed = parseInt(e.target.value, 10);
              if (!Number.isNaN(parsed)) {
                onChange(Math.min(maxMinutes, Math.max(1, parsed)));
              }
            }}
            className="w-24 pointer-events-auto bg-transparent text-center text-4xl font-mono font-semibold tabular-nums text-black outline-non"
          />
        ) : (
          children
        )}
      </div>
    </div>
  );
}
