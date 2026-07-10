"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import styles from "../redline.module.css";

/**
 * The signature Redline CTA. A red proofreader's underline strokes across the
 * label on hover / focus (SVG stroke-dashoffset), and on strike (pointer or
 * keyboard) it throws a dependency-free burst of small red ink marks from the
 * strike point. All motion is gated on prefers-reduced-motion; the reduced
 * state is a static, fully-usable button with no ink flourish.
 */
export default function RedlinePen({
  href,
  variant = "solid",
  external = false,
  ariaLabel,
  style,
  children,
}: {
  href: string;
  variant?: "solid" | "ghost";
  external?: boolean;
  ariaLabel?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const layerRef = useRef<HTMLSpanElement | null>(null);
  const reduced = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    reduced.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    return () => {
      mounted.current = false;
    };
  }, []);

  const strike = (cx: number, cy: number) => {
    const layer = layerRef.current;
    if (!layer || reduced.current || !mounted.current) return;
    const rect = layer.getBoundingClientRect();
    const x = cx - rect.left;
    const y = cy - rect.top;
    const n = 12;
    for (let i = 0; i < n; i++) {
      const mark = document.createElement("span");
      mark.className = styles.penMark;
      const ang = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.2;
      const dist = 22 + Math.random() * 52;
      const tx = Math.cos(ang) * dist;
      const ty = Math.sin(ang) * dist - Math.random() * 18;
      mark.style.left = `${x}px`;
      mark.style.top = `${y}px`;
      mark.style.setProperty("--tx", `${tx.toFixed(1)}px`);
      mark.style.setProperty("--ty", `${ty.toFixed(1)}px`);
      mark.style.setProperty("--rot", `${(Math.random() * 120 - 60).toFixed(0)}deg`);
      mark.style.setProperty("--dur", `${(0.5 + Math.random() * 0.4).toFixed(2)}s`);
      mark.addEventListener("animationend", () => mark.remove(), { once: true });
      layer.appendChild(mark);
    }
  };

  const cls = variant === "ghost" ? `${styles.pen} ${styles.penGhost}` : styles.pen;
  const ext = external ? { target: "_blank", rel: "noreferrer" } : {};

  return (
    <a
      className={cls}
      href={href}
      aria-label={ariaLabel}
      style={style}
      onPointerDown={(e) => strike(e.clientX, e.clientY)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          const r = e.currentTarget.getBoundingClientRect();
          strike(r.left + r.width / 2, r.top + r.height / 2);
        }
      }}
      {...ext}
    >
      <span className={styles.penMarkLayer} ref={layerRef} aria-hidden="true" />
      <span className={styles.penLabel}>{children}</span>
      <svg
        className={styles.penUnderline}
        viewBox="0 0 100 8"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          className={styles.penUnderlinePath}
          d="M1 5 C 18 2, 34 7, 52 4 S 84 2, 99 5"
          pathLength={1}
        />
      </svg>
    </a>
  );
}
