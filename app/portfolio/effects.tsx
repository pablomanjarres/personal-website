"use client";

// Tiny, dependency-free kinetic-type + pointer leaves for the portfolio.
// Grounded in the technique catalog: a hand-rolled requestAnimationFrame
// scramble (soulwire pattern) and a center-offset magnetic pull. Both render
// their final content on the server for SSR + a11y and only animate on the
// client, and both no-op under prefers-reduced-motion.

import { useCallback, useEffect, useRef, type ReactNode } from "react";

const GLYPHS = "!<>-_/[]{}=+*^?#§±·:";

function prefersReduced(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

// Decrypt/scramble reveal. Cycles random glyphs left-to-right until each
// character locks to its final value. Plays once on mount (optionally after a
// stagger `delay`) and again on pointer-enter.
export function ScrambleText({
  text,
  className,
  delay = 0,
  duration = 620,
  playOnMount = true,
}: {
  text: string;
  className?: string;
  delay?: number;
  duration?: number;
  playOnMount?: boolean;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const raf = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const run = useCallback(
    (dur = duration) => {
      const el = ref.current;
      if (!el) return;
      if (prefersReduced()) {
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
            i < lock || c === " "
              ? c
              : GLYPHS[(Math.random() * GLYPHS.length) | 0],
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
    },
    [text, duration],
  );

  useEffect(() => {
    if (playOnMount && !prefersReduced()) {
      timer.current = setTimeout(() => run(), delay);
    }
    return () => {
      cancelAnimationFrame(raf.current);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [playOnMount, delay, run]);

  return (
    <span
      ref={ref}
      className={className}
      aria-label={text}
      onPointerEnter={() => run(460)}
    >
      {text}
    </span>
  );
}

// Center-offset magnetic pull. Translates the wrapper toward the cursor; a
// CSS transition on transform gives the elastic settle on leave.
export function Magnetic({
  children,
  className,
  strength = 0.28,
  cap = 14,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
  cap?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReduced()) return;
    let raf = 0;
    const clamp = (n: number) => Math.max(-cap, Math.min(cap, n));
    const onMove = (e: PointerEvent) => {
      const b = el.getBoundingClientRect();
      const x = clamp((e.clientX - (b.left + b.width / 2)) * strength);
      const y = clamp((e.clientY - (b.top + b.height / 2)) * strength);
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        el.style.setProperty("--mx", `${x}px`);
        el.style.setProperty("--my", `${y}px`);
      });
    };
    const reset = () => {
      cancelAnimationFrame(raf);
      el.style.setProperty("--mx", "0px");
      el.style.setProperty("--my", "0px");
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", reset);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", reset);
      cancelAnimationFrame(raf);
    };
  }, [strength, cap]);

  return (
    <span ref={ref} className={className} data-magnetic>
      {children}
    </span>
  );
}
