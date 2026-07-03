"use client";

import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Link from "next/link";
import type { Hero } from "../../heroes";
import styles from "./content-pipeline.module.css";

/* ------------------------------------------------------------------ *
 * Content Pipeline — a local-first content command center rendered as
 * an industrial assembly line crossed with mission control.
 *
 * Signature button effect: "conveyor label swap" (words-move) — the CTA
 * label rides up out of an overflow belt while a duplicate rides in from
 * below, per-character staggered left-to-right, with a notched amber belt
 * underline that runs on hover and a card that ships off on press.
 *
 * Hero motion (pure CSS): stacked conveyor belts of glassmorphic content
 * cards loop across the graphite control room, seven platform pills power
 * on station-by-station (amber -> green), and a Martian Mono readout
 * counts 00 -> 07 as the line boots. Everything is transform/opacity only
 * and gates behind prefers-reduced-motion.
 * ------------------------------------------------------------------ */

type Status = "live" | "proc" | "queue";

const PLATFORMS: { id: string; tag: string; status: Status }[] = [
  { id: "reels", tag: "IG REELS", status: "live" },
  { id: "tiktok", tag: "TIKTOK", status: "proc" },
  { id: "shorts", tag: "YT SHORTS", status: "queue" },
  { id: "x", tag: "X", status: "live" },
  { id: "linkedin", tag: "LINKEDIN", status: "proc" },
  { id: "reddit", tag: "REDDIT", status: "queue" },
  { id: "threads", tag: "THREADS", status: "proc" },
];

const RECORDS: { plat: string; file: string; status: Status }[] = [
  { plat: "IG REELS", file: "morning-flow.json", status: "live" },
  { plat: "TIKTOK", file: "hook-v3.json", status: "proc" },
  { plat: "YT SHORTS", file: "day-42.json", status: "queue" },
  { plat: "X", file: "launch-thread.json", status: "live" },
  { plat: "LINKEDIN", file: "founder-note.json", status: "proc" },
  { plat: "REDDIT", file: "r-selfhosted.json", status: "queue" },
  { plat: "THREADS", file: "teardown.json", status: "proc" },
  { plat: "IG REELS", file: "b-roll-cut.json", status: "proc" },
  { plat: "X", file: "reply-sweep.json", status: "queue" },
  { plat: "YT SHORTS", file: "retro-ep.json", status: "live" },
];

const STATUS_LABEL: Record<Status, string> = {
  live: "SHIPPED",
  proc: "PROCESSING",
  queue: "QUEUED",
};

const pad = (v: number) => String(v).padStart(2, "0");
const cssVar = (name: string, value: number | string): CSSProperties =>
  ({ [name]: value }) as CSSProperties;

/* Count 00 -> target once the line "boots"; jumps straight to target
 * for reduced-motion users. */
function useCountUp(target: number, delay = 950, duration = 1500) {
  const [n, setN] = useState(0);
  const raf = useRef(0);
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setN(target);
      return;
    }
    let startTs = 0;
    const tick = (ts: number) => {
      if (!startTs) startTs = ts;
      const p = Math.min(1, (ts - startTs) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * target));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    const to = window.setTimeout(() => {
      raf.current = requestAnimationFrame(tick);
    }, delay);
    return () => {
      window.clearTimeout(to);
      cancelAnimationFrame(raf.current);
    };
  }, [target, delay, duration]);
  return n;
}

/* The signature CTA: two stacked copies of the label inside an overflow
 * "belt"; each char rides the belt on hover/focus, staggered by index. */
function ConveyorButton({
  href,
  label,
  icon,
  variant,
  external = true,
}: {
  href: string;
  label: string;
  icon: string;
  variant: "primary" | "ghost";
  external?: boolean;
}) {
  const chars = [...label];
  const linkProps = external
    ? { target: "_blank", rel: "noreferrer" }
    : {};
  const row = (extra: string) => (
    <span className={`${styles.cbtnRow} ${extra}`}>
      {chars.map((c, i) => (
        <span key={i} className={styles.cbtnChar} style={cssVar("--i", i)}>
          {c === " " ? " " : c}
        </span>
      ))}
    </span>
  );
  return (
    <a
      href={href}
      aria-label={label}
      className={`${styles.cbtn} ${
        variant === "primary" ? styles.cbtnPrimary : styles.cbtnGhost
      }`}
      {...linkProps}
    >
      <span className={styles.cbtnIcon} aria-hidden="true">
        {icon}
      </span>
      <span className={styles.cbtnBelt} aria-hidden="true">
        {row(styles.cbtnRowTop)}
        {row(styles.cbtnRowBot)}
      </span>
      <span className={styles.cbtnPlane} aria-hidden="true">
        ➤
      </span>
    </a>
  );
}

function Card({ rec }: { rec: (typeof RECORDS)[number] }) {
  return (
    <div className={`${styles.card} ${styles[`card_${rec.status}`]}`}>
      <div className={styles.cardTop}>
        <span className={styles.cardPlat}>{rec.plat}</span>
        <span className={`${styles.dot} ${styles[`dot_${rec.status}`]}`} />
      </div>
      <div className={styles.cardFile}>{rec.file}</div>
      <div className={styles.cardMeta}>
        <span>status</span>
        <span className={styles.cardStatus}>{STATUS_LABEL[rec.status]}</span>
      </div>
      <div className={styles.cardBar}>
        <span className={styles.cardBarFill} />
      </div>
    </div>
  );
}

function Belt({
  recs,
  variant,
}: {
  recs: (typeof RECORDS)[number][];
  variant: "a" | "b" | "c";
}) {
  const doubled = [...recs, ...recs];
  return (
    <div className={styles.belt}>
      <div className={`${styles.track} ${styles[`track_${variant}`]}`}>
        {doubled.map((rec, i) => (
          <Card key={i} rec={rec} />
        ))}
      </div>
    </div>
  );
}

function renderNote(note: string) {
  return note.split("`").map((seg, i) =>
    i % 2 === 1 ? (
      <code key={i} className={styles.code}>
        {seg}
      </code>
    ) : (
      <span key={i}>{seg}</span>
    ),
  );
}

export default function Hero({ hero, slug }: { hero: Hero; slug: string }) {
  const total = PLATFORMS.length;
  const count = useCountUp(total);
  const done = count >= total;

  const leadWords = hero.titleLead.split(" ");
  const mainWords = hero.titleMain.split(" ");
  const writeup = `https://pablomanjarres.com/portfolio/projects/${slug}`;

  const beltA = RECORDS;
  const beltB = [...RECORDS.slice(4), ...RECORDS.slice(0, 4)];
  const beltC = [...RECORDS.slice(7), ...RECORDS.slice(0, 7)];

  return (
    <main className={styles.stage}>
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.scan} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />

      <nav className={styles.bar}>
        <Link className={styles.brand} href="/">
          <b>✦</b> Pablo
        </Link>
        <div className={styles.navlinks}>
          <Link href="/oss">Open source</Link>
          <Link href="/portfolio">Portfolio</Link>
          <a href={hero.repo} target="_blank" rel="noreferrer">
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
      </nav>

      <div className={styles.inner}>
        <div className={styles.leadCol}>
          <div className={styles.kicker}>
            <span className={styles.kickerDot} aria-hidden="true" />
            {hero.kicker}
          </div>

          <h1 className={styles.title}>
            <span className={styles.titleLead}>
              {leadWords.map((w, i) => (
                <span className={styles.mask} key={`l${i}`}>
                  <span className={styles.hlWord} style={cssVar("--i", i)}>
                    {w}
                  </span>
                </span>
              ))}
            </span>
            <span className={styles.titleMain}>
              {mainWords.map((w, i) => (
                <span className={styles.mask} key={`m${i}`}>
                  <span
                    className={styles.hlWord}
                    style={cssVar("--i", leadWords.length + i)}
                  >
                    {w}
                  </span>
                </span>
              ))}
            </span>
          </h1>

          <p className={styles.sub}>{hero.subtitle}</p>
          <p className={styles.note}>{renderNote(hero.note)}</p>

          <div className={styles.cta}>
            <ConveyorButton
              href={hero.repo}
              label="Star on GitHub"
              icon="★"
              variant="primary"
            />
            {hero.live && (
              <ConveyorButton
                href={hero.live}
                label="Live demo"
                icon="▶"
                variant="ghost"
              />
            )}
            <ConveyorButton
              href={writeup}
              label="Read the write-up"
              icon="↳"
              variant="ghost"
              external={false}
            />
          </div>
        </div>

        <aside className={styles.consoleCol} aria-hidden="true">
          <div className={styles.panel}>
            <div className={styles.panelHead}>
              <span className={styles.panelTitle}>PIPELINE // STATUS</span>
              <span className={styles.panelLive}>
                <span className={styles.panelLiveDot} /> LIVE
              </span>
            </div>

            <div className={styles.readout}>
              <span
                className={`${styles.readNum} ${done ? styles.readNumDone : ""}`}
              >
                {pad(count)}
              </span>
              <span className={styles.readSlash}>/ {pad(total)}</span>
              <span className={styles.readLabel}>
                PLATFORMS
                <br />
                ONLINE
              </span>
            </div>

            <div className={styles.pills}>
              {PLATFORMS.map((p, i) => (
                <span
                  key={p.id}
                  className={styles.pill}
                  style={cssVar("--i", i)}
                >
                  <span
                    className={`${styles.dot} ${styles[`dot_${p.status}`]}`}
                  />
                  {p.tag}
                </span>
              ))}
            </div>

            <div className={styles.legend}>
              <span className={styles.legendItem}>
                <span className={`${styles.dot} ${styles.dot_proc}`} />
                PROCESSING
              </span>
              <span className={styles.legendItem}>
                <span className={`${styles.dot} ${styles.dot_live}`} />
                SHIPPED
              </span>
            </div>

            <div className={styles.meta}>
              <span>~/.content-pipeline/*.json</span>
              <span className={styles.metaTag}>LOCALHOST + TAILSCALE</span>
            </div>
          </div>
        </aside>
      </div>

      <div className={styles.belts} aria-hidden="true">
        <Belt recs={beltA} variant="a" />
        <Belt recs={beltB} variant="b" />
        <Belt recs={beltC} variant="c" />
      </div>

      <footer className={styles.foot}>
        <span className={styles.footTag}>
          {hero.oss ? "MIT LICENSED" : "SOURCE AVAILABLE"}
        </span>
        <span>© 2026 Pablo Manjarres</span>
      </footer>
    </main>
  );
}
