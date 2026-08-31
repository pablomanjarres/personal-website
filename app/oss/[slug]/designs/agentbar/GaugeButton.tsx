"use client";

import type { CSSProperties, ReactNode } from "react";
import styles from "../agentbar.module.css";

const CELLS = 12;

/**
 * The CTA fills its own rate-limit window when you point at it.
 *
 * Twelve cells along the bottom edge light left to right, each with its own
 * transition-delay derived from an inline --i, so the whole gesture is CSS and
 * keyboard users get it for free through :focus-visible. The resting state is
 * the unfilled pill, which is also what reduced-motion sees.
 */
export default function GaugeButton({
  href,
  children,
  tone = "primary",
  delay,
}: {
  href: string;
  children: ReactNode;
  tone?: "primary" | "ghost";
  delay?: CSSProperties;
}) {
  return (
    <a
      className={`${styles.gaugeBtn} ${tone === "ghost" ? styles.gaugeGhost : styles.gaugeSolid}`}
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      style={delay}
    >
      <span className={styles.gaugeSweep} aria-hidden="true" />
      <span className={styles.gaugeLabel}>{children}</span>
      <span className={styles.gaugeTrack} aria-hidden="true">
        {Array.from({ length: CELLS }, (_, i) => (
          <i
            key={i}
            className={styles.gaugeCell}
            style={{ ["--i" as string]: String(i) } as CSSProperties}
          />
        ))}
      </span>
    </a>
  );
}
