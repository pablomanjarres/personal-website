"use client";

import { useCallback, useRef, type CSSProperties, type ReactNode } from "react";
import styles from "../band-of-agents.module.css";

/* ---------------------------------------------------------------------------
   The signature VERDICT STAMP CTA (STAMP family, ink-spread EXPLODE flourish).

   Rest  : an embossed rubber stamp — radial ink dome + inset emboss shadows,
           a double-ruled mount frame, worn-ink grunge via mask-image.
   Hover : the action label rides up and out while a green verdict word stamps
           in; the mount frame + glow shift to the verdict colour. Width is
           reserved (grid-stacked labels) so the flip never reflows neighbours.
   Press : scale/rotate/brightness overshoot on :active (ease-out-back thunk).
   Click : a one-shot radial ink-spread blot + a burst of ink flecks with
           random --tx/--ty/--rot (removed on animationend). Motion-gated.

   Everything visual is pure CSS; only the click flourish is JS, isolated to
   this leaf so 'use client' never bleeds further up the tree.
   --------------------------------------------------------------------------- */

type Props = {
  href: string;
  variant?: "primary" | "ghost";
  verdict: string;
  external?: boolean;
  ariaLabel?: string;
  style?: CSSProperties;
  children: ReactNode;
};

const FLECK_COUNT = 14;

export default function VerdictStamp({
  href,
  variant = "primary",
  verdict,
  external = false,
  ariaLabel,
  style,
  children,
}: Props) {
  const blotRef = useRef<HTMLSpanElement>(null);
  const fleckRef = useRef<HTMLSpanElement>(null);

  const stamp = useCallback(() => {
    if (
      typeof window === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    // 1) re-trigger the ink-spread blot animation from the start.
    const blot = blotRef.current;
    if (blot) {
      blot.classList.remove(styles.blotGo);
      // force reflow so the animation can restart on rapid re-clicks
      void blot.offsetWidth;
      blot.classList.add(styles.blotGo);
    }

    // 2) burst a handful of ink flecks outward.
    const layer = fleckRef.current;
    if (layer) {
      for (let i = 0; i < FLECK_COUNT; i++) {
        const s = document.createElement("span");
        s.className = styles.fleck;
        const ang = (Math.PI * 2 * i) / FLECK_COUNT + Math.random() * 0.5;
        const dist = 26 + Math.random() * 40;
        s.style.setProperty("--tx", `${Math.cos(ang) * dist}px`);
        s.style.setProperty("--ty", `${Math.sin(ang) * dist}px`);
        s.style.setProperty("--rot", `${(Math.random() * 2 - 1) * 120}deg`);
        s.style.setProperty("--s", `${0.5 + Math.random() * 0.9}`);
        s.addEventListener("animationend", () => s.remove(), { once: true });
        layer.appendChild(s);
      }
    }
  }, []);

  const rel = external ? "noreferrer" : undefined;
  const target = external ? "_blank" : undefined;

  return (
    <a
      className={`${styles.stamp} ${
        variant === "ghost" ? styles.stampGhost : styles.stampPrimary
      }`}
      href={href}
      target={target}
      rel={rel}
      aria-label={ariaLabel}
      style={style}
      onClick={stamp}
    >
      <span className={styles.stampInk} aria-hidden="true" />
      <span className={styles.stampGrain} aria-hidden="true" />
      <span className={styles.stampFrame} aria-hidden="true" />
      <span className={styles.stampBlot} ref={blotRef} aria-hidden="true" />
      <span className={styles.stampFlecks} ref={fleckRef} aria-hidden="true" />
      <span className={styles.stampLabels}>
        <span className={styles.stampAction}>{children}</span>
        <span className={styles.stampVerdict} aria-hidden="true">
          {verdict}
        </span>
      </span>
    </a>
  );
}
