"use client";

import { useCallback, useEffect, useRef } from "react";

/**
 * Hand-rolled ~40-line requestAnimationFrame decrypt/scramble (the soulwire
 * pattern) — zero dependencies. Cycles not-yet-settled characters through a
 * glyph set, resolving left-to-right until every char locks to its target.
 * Respects prefers-reduced-motion by resolving instantly.
 */
const GLYPHS = "!<>-_\\/[]{}=+*^?#0123456789ABCDEF§";

export function useScramble() {
  const raf = useRef<number>(0);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  return useCallback((el: HTMLElement, text: string, dur = 900) => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = text;
      return;
    }
    const chars = [...text];
    const t0 = performance.now();
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const lock = Math.floor(p * chars.length);
      el.textContent = chars
        .map((c, i) =>
          c === " " ? " " : i < lock ? c : GLYPHS[(Math.random() * GLYPHS.length) | 0]
        )
        .join("");
      if (p < 1) {
        raf.current = requestAnimationFrame(step);
      } else {
        el.textContent = text;
      }
    };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(step);
  }, []);
}
