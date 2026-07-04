"use client";

// REFORM — the decrypt / ciphertext scramble reveal that unifies the Cortex
// hero and its CTAs. Hand-rolled requestAnimationFrame character-cycling (the
// soulwire text-scramble class) wrapped as a tiny 'use client' hook so no
// animation library is pulled in. Monospace (Martian Mono) keeps advance width
// fixed, so glyph-cycling causes zero reflow. See ../CONTRACT.md — this file is
// slug-namespaced under designs/cortex/.
import { useCallback, useEffect, useRef } from "react";

// Hex-weighted so the noise reads as ciphertext, not lorem-glyph soup. The 0-9 /
// A-F run is duplicated to bias toward a crypto/hex look.
const CHARS = "ABCDEF0123456789ABCDEF0123456789!<>-_/[]{}=+*^?#";
const rand = (n: number) => (Math.random() * n) | 0;

/** A same-length ciphertext for `text`, preserving spaces (the resting state). */
export function cipherOf(text: string): string {
  let out = "";
  for (const c of text) out += c === " " ? " " : CHARS[rand(CHARS.length)];
  return out;
}

/** Escape the glyphs we splice into innerHTML — CHARS contains < > which would
 *  otherwise open a tag. */
function esc(c: string): string {
  if (c === "<") return "&lt;";
  if (c === ">") return "&gt;";
  if (c === "&") return "&amp;";
  return c;
}

export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

type Item = { from: string; to: string; start: number; end: number; char: string };

/**
 * Bind the returned `ref` to a fixed-advance element. `setText(next)` animates
 * the element's current text into `next` by cycling each not-yet-settled slot
 * through random glyphs, resolving left-to-right. `dudClass` styles the
 * in-flight glyphs (dim teal flicker).
 */
export function useScramble(dudClass?: string) {
  const ref = useRef<HTMLElement | null>(null);
  const st = useRef({
    raf: 0,
    frame: 0,
    queue: [] as Item[],
    resolve: null as null | (() => void),
  });

  const tick = useCallback(() => {
    const s = st.current;
    const el = ref.current;
    if (!el) return;
    let out = "";
    let done = 0;
    for (let i = 0; i < s.queue.length; i++) {
      const it = s.queue[i];
      if (s.frame >= it.end) {
        done++;
        out += esc(it.to);
      } else if (s.frame >= it.start) {
        if (!it.char || Math.random() < 0.28) it.char = CHARS[rand(CHARS.length)];
        out += dudClass
          ? `<span class="${dudClass}">${esc(it.char)}</span>`
          : esc(it.char);
      } else {
        out += esc(it.from);
      }
    }
    el.innerHTML = out;
    if (done === s.queue.length) {
      // Collapse back to clean text nodes so the next read is exact.
      el.textContent = s.queue.map((q) => q.to).join("");
      const r = s.resolve;
      s.resolve = null;
      if (r) r();
      return;
    }
    s.frame++;
    s.raf = requestAnimationFrame(tick);
  }, [dudClass]);

  const setText = useCallback(
    (next: string, spread = 34): Promise<void> => {
      const el = ref.current;
      const s = st.current;
      if (!el) return Promise.resolve();
      const prev = el.textContent ?? "";
      const len = Math.max(prev.length, next.length);
      const q: Item[] = [];
      for (let i = 0; i < len; i++) {
        const start = rand(spread);
        const end = start + rand(spread) + 8;
        q.push({ from: prev[i] ?? "", to: next[i] ?? "", start, end, char: "" });
      }
      cancelAnimationFrame(s.raf);
      if (s.resolve) {
        const r = s.resolve;
        s.resolve = null;
        r();
      }
      s.queue = q;
      s.frame = 0;
      return new Promise<void>((res) => {
        s.resolve = res;
        tick();
      });
    },
    [tick],
  );

  const setInstant = useCallback((text: string) => {
    const el = ref.current;
    const s = st.current;
    cancelAnimationFrame(s.raf);
    if (s.resolve) {
      const r = s.resolve;
      s.resolve = null;
      r();
    }
    if (el) el.textContent = text;
  }, []);

  useEffect(
    () => () => {
      const s = st.current;
      cancelAnimationFrame(s.raf);
      s.resolve = null;
    },
    [],
  );

  return { ref, setText, setInstant };
}
