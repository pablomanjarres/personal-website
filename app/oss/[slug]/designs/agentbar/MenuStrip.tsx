"use client";

import { useEffect, useState } from "react";
import Sprout, { type Mood } from "./Sprout";
import { useOdometer } from "./useOdometer";
import styles from "../agentbar.module.css";

/**
 * The signature set-piece: a real macOS menu bar welded to the top of the page.
 *
 * Every other landing here sits inside the browser. This product IS the top of
 * your screen, so the page wears one: vibrancy-blurred, pinned, with the
 * agentbar item on the right showing both agents and a clock reading the real
 * local time. Scroll and it stays exactly where a menu bar lives.
 */
export default function MenuStrip({
  mood,
  cc,
  cx,
}: {
  mood: Mood;
  cc: number;
  cx: number;
}) {
  const [clock, setClock] = useState<string | null>(null);
  const ccPct = useOdometer(cc, 600, 900);
  const cxPct = useOdometer(cx, 700, 900);

  useEffect(() => {
    // rendered only after mount: the server has no business guessing a clock,
    // and a mismatched first paint would hydrate badly
    const tick = () =>
      setClock(
        new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      );
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className={styles.strip} aria-hidden="true">
      <div className={styles.stripLeft}>
        <span className={styles.stripApple}>◍</span>
        <span className={styles.stripMenu}>Finder</span>
        <span className={styles.stripMenu}>File</span>
        <span className={styles.stripMenu}>Edit</span>
        <span className={styles.stripMenu}>View</span>
      </div>

      <div className={styles.stripRight}>
        <span className={styles.stripItem}>
          <Sprout mood={mood} scale={2} className={styles.stripSprout} />
          <span className={styles.stripCc}>{Math.round(ccPct)}%</span>
          <span className={styles.stripDot}>·</span>
          <span className={styles.stripCx}>{Math.round(cxPct)}%</span>
        </span>
        <span className={styles.stripGlyph}>▮</span>
        <span className={styles.stripGlyph}>◈</span>
        <span className={styles.stripClock}>{clock ?? " "}</span>
      </div>
    </div>
  );
}
