"use client";

import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import styles from "../forge.module.css";

/**
 * Decorative product chrome — the Forge menu-bar app "casting" media on
 * localhost:3400: the forge_* tool rack plus a live Remotion render queue that
 * heats coal -> gold as frames land. aria-hidden (illustrative, not content);
 * fully static under prefers-reduced-motion.
 */

type Tool = { name: string; sub: string; icon: ReactNode };

const FRAMES = 20;

const tools: Tool[] = [
  {
    name: "forge_image",
    sub: "generate · 4 variants",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <circle cx="8.5" cy="9.5" r="1.6" />
        <path d="M4 17l5-5 4 4 3-3 4 4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "forge_video",
    sub: "Seedance · 6s clip",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <rect x="3" y="5" width="14" height="14" rx="2" />
        <path d="M17 10l4-2.5v9L17 14z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "forge_voice",
    sub: "narrate · 22s",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M4 10v4M8 7v10M12 4v16M16 8v8M20 11v2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "forge_agent",
    sub: "claude · run on repo",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13 5l-2 14" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "forge_render",
    sub: "Remotion · 1080p",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
        <circle cx="12" cy="12" r="8.5" />
        <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function ForgeConsole({ style }: { style?: CSSProperties }) {
  // head = current Remotion render frame; active tool derived from cadence.
  const [head, setHead] = useState(13);
  const [active, setActive] = useState(4);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tick = 0;
    const id = window.setInterval(() => {
      tick++;
      setHead((h) => (h + 1) % (FRAMES + 6));
      if (tick % 11 === 0) setActive((a) => (a + 1) % tools.length);
    }, 150);
    return () => window.clearInterval(id);
  }, []);

  const pct = Math.min(100, Math.round((Math.min(head, FRAMES) / FRAMES) * 100));

  return (
    <div className={styles.console} style={style} aria-hidden="true">
      <div className={styles.consoleInner}>
        <div className={styles.consoleBar}>
          <span className={styles.rivets}>
            <span className={`${styles.rivet} ${styles.hot}`} />
            <span className={styles.rivet} />
            <span className={styles.rivet} />
          </span>
          <span className={styles.consoleName}>
            <b>forge</b>&nbsp;· localhost:3400
          </span>
        </div>

        <div className={styles.consoleBody}>
          {tools.map((t, i) => {
            const on = i === active;
            return (
              <div
                key={t.name}
                className={`${styles.toolRow}${on ? " " + styles.active : ""}`}
              >
                <span className={styles.toolIco}>{t.icon}</span>
                <span className={styles.toolMeta}>
                  <span className={styles.toolName}>{t.name}</span>
                  <span className={styles.toolSub}>{t.sub}</span>
                </span>
                <span className={styles.toolState}>{on ? "casting" : "ready"}</span>
              </div>
            );
          })}

          <div className={styles.queue}>
            <div className={styles.queueTop}>
              <span>
                <b>Remotion</b> · scene_03.mp4
              </span>
              <span className={styles.queuePct}>{pct}%</span>
            </div>
            <div className={styles.track}>
              <span className={styles.fill} style={{ width: `${pct}%` }} />
            </div>
            <div className={styles.frames}>
              {Array.from({ length: FRAMES }).map((_, i) => {
                const cls =
                  i === Math.min(head, FRAMES - 1)
                    ? `${styles.frame} ${styles.head}`
                    : i < head
                      ? `${styles.frame} ${styles.done}`
                      : styles.frame;
                return <span key={i} className={cls} />;
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
