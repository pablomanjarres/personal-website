"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts up to `target` once, after `delayMs`.
 *
 * Under prefers-reduced-motion it returns the final value immediately and never
 * schedules a frame, so the page is correct and finished with motion disabled,
 * which is the same discipline the CSS uses.
 */
export function useOdometer(target: number, delayMs = 0, durationMs = 900) {
  const [value, setValue] = useState(0);
  const frame = useRef<number | null>(null);

  useEffect(() => {
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setValue(target);
      return;
    }

    let start = 0;
    const timer = window.setTimeout(() => {
      const step = (now: number) => {
        if (!start) start = now;
        const t = Math.min(1, (now - start) / durationMs);
        // ease-out cubic: fast off the mark, settles rather than stops dead
        setValue(target * (1 - Math.pow(1 - t, 3)));
        if (t < 1) frame.current = window.requestAnimationFrame(step);
      };
      frame.current = window.requestAnimationFrame(step);
    }, delayMs);

    return () => {
      window.clearTimeout(timer);
      if (frame.current !== null) window.cancelAnimationFrame(frame.current);
    };
  }, [target, delayMs, durationMs]);

  return value;
}
