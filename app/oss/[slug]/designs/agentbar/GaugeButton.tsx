"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import styles from "../agentbar.module.css";

const CELLS = 12;

/**
 * The CTA fills its own rate-limit window when you point at it.
 *
 * Twelve cells along the bottom edge light left to right, each with its own
 * transition-delay derived from an inline --i, so the whole gesture is CSS and
 * keyboard users get it through :focus-visible for free. The resting state is
 * the unfilled pill, which is also what reduced motion sees.
 */
export default function GaugeButton({
  href,
  children,
  tone = "primary",
  external = false,
  delay,
}: {
  href: string;
  children: ReactNode;
  tone?: "primary" | "ghost";
  /** Only an off-site href opens a tab; an internal route stays in the SPA. */
  external?: boolean;
  delay?: CSSProperties;
}) {
  const className = `${styles.gaugeBtn} ${
    tone === "ghost" ? styles.gaugeGhost : styles.gaugeSolid
  }`;

  const inner = (
    <>
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
    </>
  );

  if (external) {
    return (
      <a
        className={className}
        href={href}
        target="_blank"
        rel="noreferrer noopener"
        style={delay}
      >
        {inner}
      </a>
    );
  }

  return (
    <Link className={className} href={href} style={delay}>
      {inner}
    </Link>
  );
}
