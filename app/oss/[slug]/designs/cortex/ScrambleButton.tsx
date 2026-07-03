"use client";

// A CTA whose label rests as ciphertext and REFORMs into the word on
// hover/focus. The primary variant fires the "AES seal" beat on click: a gold
// glow pulse plus a fast block-shuffle re-lock. aria-label carries the clean
// label; the animated inner span is aria-hidden.
import { useEffect, useRef, useState } from "react";
import type { RefObject } from "react";
import { cipherOf, prefersReducedMotion, useScramble } from "./useScramble";

export default function ScrambleButton({
  label,
  href,
  icon,
  external = false,
  seal = false,
  delay = 0,
  className,
  iconClass,
  labelClass,
  dudClass,
  sealingClass,
}: {
  label: string;
  href: string;
  icon?: string;
  external?: boolean;
  seal?: boolean;
  delay?: number;
  className?: string;
  iconClass?: string;
  labelClass?: string;
  dudClass?: string;
  sealingClass?: string;
}) {
  const { ref, setText } = useScramble(dudClass);
  const reduce = useRef(false);
  const [sealing, setSealing] = useState(false);

  useEffect(() => {
    reduce.current = prefersReducedMotion();
    if (reduce.current) return;
    const t = window.setTimeout(() => setText(cipherOf(label), 26), delay);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const decrypt = () => {
    if (!reduce.current) setText(label, 22);
  };
  const encrypt = () => {
    if (!reduce.current) setText(cipherOf(label), 22);
  };
  const onClick = () => {
    if (!seal || reduce.current) return;
    setSealing(true);
    window.setTimeout(() => setSealing(false), 540);
    // block-shuffle "seal", then re-reveal the word (page stays; link is _blank)
    setText("▉".repeat(label.length), 6).then(() => setText(label, 14));
  };

  const rel = external ? "noreferrer" : undefined;
  const target = external ? "_blank" : undefined;

  return (
    <a
      className={`${className ?? ""}${sealing && sealingClass ? ` ${sealingClass}` : ""}`}
      href={href}
      target={target}
      rel={rel}
      aria-label={label}
      onMouseEnter={decrypt}
      onFocus={decrypt}
      onMouseLeave={encrypt}
      onBlur={encrypt}
      onClick={onClick}
    >
      {icon && (
        <span className={iconClass} aria-hidden="true">
          {icon}
        </span>
      )}
      <span
        className={labelClass}
        aria-hidden="true"
        ref={ref as RefObject<HTMLSpanElement>}
      >
        {label}
      </span>
    </a>
  );
}
