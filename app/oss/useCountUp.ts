"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/app/site/useReducedMotion";

export function useCountUp(target: number, delayMs: number, durationMs: number) {
  const reduced = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (reduced) return;
    let start: number | null = null;
    let frame: number | null = null;
    const timer = window.setTimeout(() => {
      const step = (now: number) => {
        if (start === null) start = now;
        const progress = Math.min(1, (now - start) / durationMs);
        setValue(target * (1 - Math.pow(1 - progress, 3)));
        if (progress < 1) frame = window.requestAnimationFrame(step);
      };
      frame = window.requestAnimationFrame(step);
    }, delayMs);

    return () => {
      window.clearTimeout(timer);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, [target, delayMs, durationMs, reduced]);

  return reduced ? target : value;
}
