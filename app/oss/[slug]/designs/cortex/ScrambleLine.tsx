"use client";

// One decrypting segment of the hero headline. Renders the real text on the
// server (so no-JS / reduced-motion / screen readers get plaintext), then on
// mount snaps to ciphertext and resolves to the word at `delay`, sharing the
// exact REFORM gesture used by the CTAs.
import { useEffect } from "react";
import type { RefObject } from "react";
import { cipherOf, prefersReducedMotion, useScramble } from "./useScramble";

export default function ScrambleLine({
  text,
  delay = 0,
  spread = 30,
  className,
  dudClass,
}: {
  text: string;
  delay?: number;
  spread?: number;
  className?: string;
  dudClass?: string;
}) {
  const { ref, setText, setInstant } = useScramble(dudClass);

  useEffect(() => {
    if (prefersReducedMotion()) return; // leave the plaintext in place
    setInstant(cipherOf(text)); // encrypted at rest, hidden behind the fade
    const t = window.setTimeout(() => setText(text, spread), delay);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <span
      ref={ref as RefObject<HTMLSpanElement>}
      aria-hidden="true"
      className={className}
      style={{ ["--delay" as string]: `${delay}ms` }}
    >
      {text}
    </span>
  );
}
