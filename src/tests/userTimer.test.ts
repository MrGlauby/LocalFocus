import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTimer } from "../hooks/useTimer";

describe("useTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("initialisiert mit 25 Minuten (1500 Sekunden)", () => {
    const { result } = renderHook(() => useTimer(25));
    expect(result.current.timeLeft).toBe(1500);
    expect(result.current.duration).toBe(1500);
    expect(result.current.isRunning).toBe(false);
  });

  it("startet den Timer", () => {
    const { result } = renderHook(() => useTimer(25));

    act(() => {
      result.current.start();
    });

    expect(result.current.isRunning).toBe(true);
  });

  it("pausiert den Timer", () => {
    const { result } = renderHook(() => useTimer(25));

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.pause();
    });

    expect(result.current.isRunning).toBe(false);
  });

  it("zählt eine Sekunde runter", () => {
    const { result } = renderHook(() => useTimer(25));

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.timeLeft).toBe(1499);
  });

  it("zählt 5 Sekunden runter", () => {
    const { result } = renderHook(() => useTimer(25));

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.timeLeft).toBe(1495);
  });

  it("setzt den Timer zurück", () => {
    const { result } = renderHook(() => useTimer(25));

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.timeLeft).toBe(1500);
    expect(result.current.isRunning).toBe(false);
  });

  it("ändert die Dauer", () => {
    const { result } = renderHook(() => useTimer(25));

    act(() => {
      result.current.setDuration(10);
    });

    expect(result.current.duration).toBe(600);
    expect(result.current.timeLeft).toBe(600);
    expect(result.current.isRunning).toBe(false);
  });

  it("berechnet den Fortschritt korrekt", () => {
    const { result } = renderHook(() => useTimer(25));

    expect(result.current.progress).toBe(100);

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(750000); // 750 Sekunden = 50%
    });

    expect(result.current.progress).toBe(50);
  });
});
