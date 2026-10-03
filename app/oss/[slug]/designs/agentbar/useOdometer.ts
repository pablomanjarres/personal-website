"use client";

import { useCountUp } from "@/app/oss/useCountUp";

/** Fractional gauge values count up once, after the requested delay. */
export function useOdometer(target: number, delayMs = 0, durationMs = 900) {
  return useCountUp(target, delayMs, durationMs);
}
