"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import s from "../portpeek.module.css";

/**
 * PortScope — the signature PortPeek set-piece. A faux macOS menu-bar dropdown
 * that live-scans localhost: rows blip in, a scan bar sweeps the list, and a
 * port gets "evicted" (struck + removed) on a ~2.6s cadence, exactly like the
 * real 3-second PortScanner loop. Ports, labels, process names and the colored
 * dots are grounded in Sources/PortPeek/CommonPorts.swift.
 *
 * aria-hidden (decorative, not content). Under prefers-reduced-motion the
 * cadence never starts and a static, finished list is the fallback frame.
 */

type Port = {
  key: string;
  port: number;
  label: string;
  proc: string;
  pid: number;
  dot: string;
  state?: "entering" | "evicting";
};

// honest process-dot colors, curated from CommonPorts.swift's SwiftUI color map
const C = {
  azure: "#5b9bff",
  violet: "#b98cff",
  emerald: "#34d399",
  teal: "#2dd4bf",
  sky: "#38bdf8",
  amber: "#fbbf24",
  pink: "#f472b6",
  cyan: "#22d3ee",
  gold: "#f5c451",
  mint: "#6ee7b7",
};

// the scan pool — real ports + real CommonPorts labels + plausible PIDs
const POOL: Omit<Port, "key" | "state">[] = [
  { port: 3000, label: "Next.js dev", proc: "node", pid: 48213, dot: C.azure },
  { port: 5173, label: "Vite", proc: "node", pid: 51902, dot: C.violet },
  { port: 5432, label: "PostgreSQL", proc: "postgres", pid: 1123, dot: C.emerald },
  { port: 6379, label: "Redis", proc: "redis-server", pid: 1187, dot: C.teal },
  { port: 8080, label: "HTTP Alt", proc: "com.docker", pid: 52310, dot: C.sky },
  { port: 7700, label: "Meilisearch", proc: "meilisearch", pid: 6640, dot: C.amber },
  { port: 11434, label: "Ollama", proc: "ollama", pid: 7781, dot: C.pink },
  { port: 4000, label: "Remix / GraphQL", proc: "node", pid: 49004, dot: C.cyan },
  { port: 8000, label: "Django / Uvicorn", proc: "python3.12", pid: 53120, dot: C.gold },
  { port: 5555, label: "Prisma Studio", proc: "node", pid: 51771, dot: C.mint },
];

const START = 6; // initial live rows (also the static reduced-motion frame)

const initialRows = (): Port[] =>
  POOL.slice(0, START).map((p) => ({ ...p, key: `${p.port}-${p.pid}` }));

// small inline glyphs (SF-Symbol-ish), all decorative
const NetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18" strokeLinecap="round" />
  </svg>
);
const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 11a8 8 0 1 0-.9 4.5" strokeLinecap="round" />
    <path d="M20 4v5h-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.2-3.2" strokeLinecap="round" />
  </svg>
);
const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M3.5 12h17M12 3.5c2.4 2.3 2.4 14.7 0 17M12 3.5c-2.4 2.3-2.4 14.7 0 17" />
  </svg>
);
const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
    <rect x="9" y="9" width="11" height="11" rx="2" />
    <path d="M5 15V6a2 2 0 0 1 2-2h9" strokeLinecap="round" />
  </svg>
);
const KillIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
    <path d="m9 9 6 6M15 9l-6 6" strokeLinecap="round" />
  </svg>
);

export default function PortScope({ style }: { style?: CSSProperties }) {
  const [rows, setRows] = useState<Port[]>(initialRows);

  // Mirror of committed rows so the interval can decide without depending on the
  // closure, keeping every setRows updater pure (no side effects inside them, so
  // dev StrictMode double-invocation can't advance the cursor or double-schedule).
  const rowsRef = useRef<Port[]>(rows);
  useEffect(() => {
    rowsRef.current = rows;
  }, [rows]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timers = new Set<number>();
    let cursor = START;
    let tick = 0;

    const settle = (key: string) =>
      timers.add(
        window.setTimeout(() => {
          setRows((prev) =>
            prev.map((r) => (r.key === key ? { ...r, state: undefined } : r))
          );
        }, 560)
      );
    const drop = (key: string) =>
      timers.add(
        window.setTimeout(() => {
          setRows((prev) => prev.filter((r) => r.key !== key));
        }, 440)
      );

    const id = window.setInterval(() => {
      tick++;
      const prev = rowsRef.current;
      const live = prev.filter((r) => r.state !== "evicting");
      const present = new Set(prev.map((r) => r.port));

      // next un-listed port, rotating through the pool
      let next: (typeof POOL)[number] | undefined;
      let advance = 0;
      for (let i = 0; i < POOL.length; i++) {
        const cand = POOL[(cursor + i) % POOL.length];
        if (!present.has(cand.port)) {
          next = cand;
          advance = i + 1;
          break;
        }
      }

      const add =
        !!next && (live.length <= 3 || (live.length < 6 && tick % 2 === 0));

      if (add && next) {
        cursor = (cursor + advance) % POOL.length;
        const key = `${next.port}-${next.pid}-${tick}`;
        setRows((p) => [...p, { ...next!, key, state: "entering" as const }]);
        settle(key);
        return;
      }

      const victim = prev.find((r) => r.state !== "evicting");
      if (!victim) return;
      setRows((p) =>
        p.map((r) =>
          r.key === victim.key ? { ...r, state: "evicting" as const } : r
        )
      );
      drop(victim.key);
    }, 2600);

    return () => {
      window.clearInterval(id);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  const count = rows.filter((r) => r.state !== "evicting").length;

  return (
    <div className={s.scope} style={style} aria-hidden="true">
      {/* the menu-bar cap the dropdown hangs from */}
      <div className={s.cap}>
        <span className={s.capGlyph}>
          <NetIcon />
        </span>
        <span className={s.capDot} />
        <span className={s.capCount}>{count} open</span>
      </div>

      <div className={s.popWrap}>
        <span className={s.beak} />
        <div className={s.popover}>
          <div className={s.popHeader}>
            <span className={s.popTitle}>PortPeek</span>
            <span className={s.popCount}>{count} listening</span>
            <span className={s.refresh}>
              <RefreshIcon />
            </span>
          </div>

          <div className={s.searchRow}>
            <SearchIcon />
            <span className={s.searchText}>Filter ports</span>
            <span className={s.caret} />
          </div>

          <div className={s.list}>
            <span className={s.listScan} />
            {rows.map((r) => (
              <div
                key={r.key}
                className={`${s.row}${
                  r.state === "entering"
                    ? " " + s.entering
                    : r.state === "evicting"
                      ? " " + s.evicting
                      : ""
                }`}
                style={{ ["--dot" as string]: r.dot } as CSSProperties}
              >
                <span className={s.rowDot} />
                <span className={s.rowBody}>
                  <span className={s.rowTop}>
                    <span className={s.rowPort}>:{r.port}</span>
                    <span className={s.rowLabel}>{r.label}</span>
                  </span>
                  <span className={s.rowSub}>
                    {r.proc} · PID {r.pid}
                  </span>
                </span>
                <span className={s.rowActions}>
                  <span className={s.act}>
                    <GlobeIcon />
                  </span>
                  <span className={s.act}>
                    <CopyIcon />
                  </span>
                  <span className={`${s.act} ${s.actKill}`}>
                    <KillIcon />
                  </span>
                </span>
              </div>
            ))}
          </div>

          <div className={s.popFoot}>
            <span className={s.quit}>Quit</span>
            <span className={s.footMeta}>
              <span className={s.footDot} />
              auto-scan · 3s
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
