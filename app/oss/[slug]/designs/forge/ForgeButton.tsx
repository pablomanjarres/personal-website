"use client";

import { useEffect, useRef, type CSSProperties, type ReactNode } from "react";
import styles from "../forge.module.css";

/**
 * The signature Forge CTA. A molten-heat gradient (idles slow at the coal end,
 * flows faster + ignites on hover via --forge-ignite) whose label reads as
 * struck metal, and — on strike (pointer or keyboard) — throws a dependency-free
 * ember spark burst from the strike point. All motion is gated on
 * prefers-reduced-motion.
 */
export default function ForgeButton({
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
    const n = 16;
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span");
      s.className = styles.spark;
      const ang = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.15;
      const dist = 26 + Math.random() * 66;
      const tx = Math.cos(ang) * dist;
      const ty = Math.sin(ang) * dist - Math.random() * 22;
      s.style.left = `${x}px`;
      s.style.top = `${y}px`;
      s.style.setProperty("--tx", `${tx.toFixed(1)}px`);
      s.style.setProperty("--ty", `${ty.toFixed(1)}px`);
      s.style.setProperty("--rot", `${(Math.random() * 220 - 110).toFixed(0)}deg`);
      s.style.setProperty("--sc", (0.5 + Math.random() * 0.9).toFixed(2));
      s.style.setProperty("--dur", `${(0.55 + Math.random() * 0.5).toFixed(2)}s`);
      s.style.setProperty(
        "--sk",
        Math.random() < 0.5 ? "#ffb04a" : "#ff6a1a"
      );
      s.addEventListener(
        "animationend",
        () => {
          s.remove();
        },
        { once: true }
      );
      layer.appendChild(s);
    }
  };

  const cls =
    variant === "ghost"
      ? `${styles.btn} ${styles.btnGhost}`
      : `${styles.btn} ${styles.btnMolten}`;
  const labelCls =
    variant === "ghost" ? styles.btnGhostLabel : styles.btnMoltenLabel;

  const ext = external
    ? { target: "_blank", rel: "noreferrer" }
    : {};

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
      <span className={labelCls}>{children}</span>
    </a>
  );
}
