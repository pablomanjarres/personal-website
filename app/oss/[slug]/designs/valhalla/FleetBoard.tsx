"use client";

import { useEffect, useState, type CSSProperties } from "react";
import styles from "../valhalla.module.css";

/**
 * Decorative product chrome — the live Valhalla "high seat" TUI: the eight
 * surfaces of the fleet reporting in on one Ink board, a prompt that types on
 * boot, one card cycling ok -> restarting/idle -> ok, a ticking uptime, and a
 * bottom command line that clears and types the next verb + its canned response.
 * aria-hidden (illustrative, not content). Under prefers-reduced-motion no
 * interval starts and the completed, all-healthy frame is rendered statically.
 */

type Surface = { rune: string; name: string; ok: string };

const SURFACES: Surface[] = [
  { rune: "ᚨ", name: "accounts", ok: "ok · 2 accts" },
  { rune: "ᚹ", name: "agents · lima vm", ok: "vm running" },
  { rune: "ᛞ", name: "daemons · launchd", ok: "23 up · 1 idle" },
  { rune: "ᛗ", name: "mcp servers", ok: "4 serving" },
  { rune: "ᛊ", name: "skills", ok: "18 loaded" },
  { rune: "ᚱ", name: "repos", ok: "12 clean" },
  { rune: "ᛜ", name: "models", ok: "opus · sonnet" },
  { rune: "ᚺ", name: "health", ok: "all green" },
];

const COMMANDS: { cmd: string; res: string }[] = [
  { cmd: "valhalla status --json", res: '{"fleet":"ok","surfaces":8}' },
  { cmd: "valhalla vm start", res: "lima · agents online" },
  { cmd: "valhalla daemons", res: "24 launchd · 23 up" },
  { cmd: "valhalla mcp list", res: "4 servers · serving" },
];

const BOOT = "valhalla";
const WIN = 54; // ticks (~8.1s) per command line
const UPTIME0 = 41207;

export default function FleetBoard({
  className,
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  const [tick, setTick] = useState(0);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setAnimate(true);
    const id = window.setInterval(() => setTick((t) => t + 1), 150);
    return () => window.clearInterval(id);
  }, []);

  // Boot prompt types once, then holds. Static = fully typed.
  const typedBoot = animate ? BOOT.slice(0, Math.min(BOOT.length, tick)) : BOOT;

  // One card cycles ok -> restarting (warn) / idle (off) -> ok, rotating.
  const slot = Math.floor(tick / 17);
  const cycleCard =
    animate && tick > 10 && tick % 17 < 3 ? slot % SURFACES.length : -1;
  const cycleOff = slot % 4 === 3; // 1-in-4 cycles goes idle instead of restarting

  // Ticking uptime on the health card (~1s per real second).
  const uptime = UPTIME0 + (animate ? Math.floor(tick * 0.15) : 0);

  // Bottom command line: clears and types the next verb, then shows its response.
  const cmdIndex = animate ? Math.floor(tick / WIN) % COMMANDS.length : 0;
  const local = animate ? tick % WIN : WIN + 99;
  const command = COMMANDS[cmdIndex];
  const typedCmd = animate
    ? command.cmd.slice(0, Math.min(command.cmd.length, local))
    : command.cmd;
  const showRes = !animate || local >= command.cmd.length + 3;

  return (
    <div className={className} style={style} aria-hidden="true">
      <div className={styles.boardInner}>
        <div className={styles.boardBar}>
          <span className={styles.studs}>
            <span className={`${styles.stud} ${styles.studHot}`} />
            <span className={styles.stud} />
            <span className={styles.stud} />
          </span>
          <span className={styles.boardName}>
            <b>valhalla</b> · the high seat
          </span>
          <span className={styles.boardBadge}>:ink</span>
        </div>

        <div className={styles.boardBody}>
          <div className={styles.promptRow}>
            <span className={styles.prompt}>❯</span>
            <span>{typedBoot}</span>
            <span className={styles.cursor} />
          </div>

          <div className={styles.summary}>
            <span className={styles.livedot} />
            <span>
              fleet · <b>8/8</b> surfaces · live
            </span>
          </div>

          <div className={styles.cardGrid}>
            {SURFACES.map((surf, i) => {
              const cycling = i === cycleCard;
              const state = cycling ? (cycleOff ? "off" : "warn") : "ok";
              const status =
                state === "warn"
                  ? "restarting"
                  : state === "off"
                    ? "idle"
                    : i === 7
                      ? `up ${uptime}s`
                      : surf.ok;
              const dotCls =
                state === "warn"
                  ? styles.dotWarn
                  : state === "off"
                    ? styles.dotOff
                    : styles.dotOk;
              const cardCls =
                state === "warn"
                  ? `${styles.card} ${styles.cardWarn}`
                  : styles.card;
              return (
                <div key={surf.name} className={cardCls}>
                  <div className={styles.cardHead}>
                    <span className={styles.cardIcon}>{surf.rune}</span>
                    <span className={styles.cardName}>{surf.name}</span>
                    <span className={`${styles.cardDot} ${dotCls}`} />
                  </div>
                  <div className={styles.cardStatus}>{status}</div>
                </div>
              );
            })}
          </div>

          <div className={styles.cmdLine}>
            <div className={styles.cmdRow}>
              <span className={styles.prompt}>❯</span>
              <span>{typedCmd}</span>
            </div>
            <div className={styles.cmdRes}>{showRes ? command.res : ""}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
