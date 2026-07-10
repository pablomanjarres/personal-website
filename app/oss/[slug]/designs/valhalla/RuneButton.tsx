"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import styles from "../valhalla.module.css";

/**
 * The signature Valhalla CTA. A stepped 8-bit rune button: the primary variant
 * is a molten-heat gradient that flows slowly and ignites on hover; the ghost
 * variant is a stepped outline whose rune (ᛟ) flickers in on hover. On strike
 * (pointer or keyboard) it throws a dependency-free burst of square pixel sparks
 * — green + ember — that move with steps() timing like 8-bit particles. All
 * motion is gated on prefers-reduced-motion (the strike is a no-op when reduced,
 * leaving the fully-legible static button).
 */
export default function RuneButton({
  href,
  variant = "molten",
  external = false,
  ariaLabel,
  style,
  children,
}: {
  href: string;
  variant?: "molten" | "ghost";
  external?: boolean;
  ariaLabel?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const layerRef = useRef<HTMLSpanElement | null>(null);
  const reduced = useRef(false);
  const mounted = useRef(true);

  useEffect(() => {
    reduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
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
    const n = 14;
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span");
      s.className = styles.spark;
      const ang = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.2;
      const dist = 22 + Math.random() * 58;
      const tx = Math.cos(ang) * dist;
      const ty = Math.sin(ang) * dist - Math.random() * 20;
      s.style.left = `${x}px`;
      s.style.top = `${y}px`;
      s.style.setProperty("--tx", `${tx.toFixed(1)}px`);
      s.style.setProperty("--ty", `${ty.toFixed(1)}px`);
      s.style.setProperty("--dur", `${(0.5 + Math.random() * 0.45).toFixed(2)}s`);
      s.style.setProperty("--sk", Math.random() < 0.5 ? "#7ee787" : "#ff9a4a");
      s.addEventListener("animationend", () => s.remove(), { once: true });
      layer.appendChild(s);
    }
  };

  const cls =
    variant === "ghost"
      ? `${styles.btn} ${styles.btnGhost}`
      : `${styles.btn} ${styles.btnMolten}`;

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
      <span className={styles.sparkLayer} ref={layerRef} aria-hidden="true" />
      <span className={styles.btnLabel}>
        {variant === "ghost" && (
          <span className={styles.btnRune} aria-hidden="true">
            ᛟ
          </span>
        )}
        {children}
      </span>
    </a>
  );
}
