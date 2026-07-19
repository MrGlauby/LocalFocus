import { describe, it, expect } from "vitest";
import { formatTime, minutesToSeconds, calculateAngle } from "../lib/timer";

describe("formatTime", () => {
  it("formatiert 1500 Sekunden zu 25:00", () => {
    expect(formatTime(1500)).toBe("25:00");
  });

  it("formatiert 65 Sekunden zu 01:05", () => {
    expect(formatTime(65)).toBe("01:05");
  });

  it("formatiert 0 Sekunden zu 00:00", () => {
    expect(formatTime(0)).toBe("00:00");
  });

  it("formatiert 3661 Sekunden zu 61:01", () => {
    expect(formatTime(3661)).toBe("61:01");
  });
});

describe("minutesToSeconds", () => {
  it("rechnet 25 Minuten in 1500 Sekunden um", () => {
    expect(minutesToSeconds(25)).toBe(1500);
  });

  it("rechnet 5 Minuten in 300 Sekunden um", () => {
    expect(minutesToSeconds(5)).toBe(300);
  });

  it("rechnet 0 Minuten in 0 Sekunden um", () => {
    expect(minutesToSeconds(0)).toBe(0);
  });
});

describe("calculateAngle", () => {
  it("gibt 360° zurück bei vollem Fortschritt", () => {
    expect(calculateAngle(1500, 1500)).toBe(360);
  });

  it("gibt 180° zurück bei halbem Fortschritt", () => {
    expect(calculateAngle(750, 1500)).toBe(180);
  });

  it("gibt 0° zurück bei leerem Fortschritt", () => {
    expect(calculateAngle(0, 1500)).toBe(0);
  });

  it("gibt 0° zurück wenn total 0 ist", () => {
    expect(calculateAngle(0, 0)).toBe(0);
  });
});
