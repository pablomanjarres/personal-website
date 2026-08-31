"use client";

import type { CSSProperties } from "react";
import Sprout, { type Mood } from "./Sprout";
import { useOdometer } from "./useOdometer";
import styles from "../agentbar.module.css";

const CELLS = 24;

export type Row = {
  agent: "cc" | "cx";
  label: string;
  window: string;
  pct: number;
  resets: string;
};

/** Green until it matters, amber when it does, rose when it is nearly gone. */
function band(pct: number) {
  if (pct >= 85) return styles.hot;
  if (pct >= 60) return styles.warn;
  return styles.ok;
}

/**
 * The dropdown, which is the other half of the strip.
 *
 * The rows are the real shape agentbar prints: one per agent per window, a
 * block gauge, and the percentage on tabular figures so nothing shifts as the
 * numbers change. Cells are elements rather than block characters because
 * Google's latin subset carries no U+2588, and a silent fallback to the system
 * mono would break the grid.
 */
export default function GaugePanel({
  rows,
  mood,
  cost,
  status,
  style,
}: {
  rows: Row[];
  mood: Mood;
  cost: number;
  status: string;
  style?: CSSProperties;
}) {
  const dollars = useOdometer(cost, 2400, 1100);

  return (
    <div className={styles.panel} style={style} aria-hidden="true">
      <div className={styles.panelHead}>
        <Sprout mood={mood} scale={4} />
        <div>
          <p className={styles.panelTitle}>agentbar</p>
          <p className={styles.panelStatus}>{status}</p>
        </div>
      </div>

      <div className={styles.panelRows}>
        {rows.map((row, i) => (
          <div
            className={styles.row}
            key={`${row.agent}-${row.window}`}
            style={{ ["--r" as string]: String(i) } as CSSProperties}
          >
            <span className={`${styles.rowLabel} ${row.agent === "cc" ? styles.laneCc : styles.laneCx}`}>
              {row.label}
              <span className={styles.rowWindow}>{row.window}</span>
            </span>
            <span className={styles.gauge}>
              {Array.from({ length: CELLS }, (_, c) => {
                const filled = c < Math.round((row.pct / 100) * CELLS);
                return (
                  <i
                    key={c}
                    className={`${styles.cell} ${filled ? band(row.pct) : styles.empty}`}
                    style={{ ["--c" as string]: String(c) } as CSSProperties}
                  />
                );
              })}
            </span>
            <span className={styles.rowPct}>{row.pct}%</span>
            <span className={styles.rowResets}>{row.resets}</span>
          </div>
        ))}
      </div>

      <div className={styles.panelFoot}>
        <span className={styles.cost}>${dollars.toFixed(2)}</span>
        <span className={styles.costNote}>what today would have cost at API rates</span>
      </div>
    </div>
  );
}
