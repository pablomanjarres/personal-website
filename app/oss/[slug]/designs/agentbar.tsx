"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import type { Hero } from "../../heroes";
import MenuStrip from "./agentbar/MenuStrip";
import GaugePanel, { type Row } from "./agentbar/GaugePanel";
import GaugeButton from "./agentbar/GaugeButton";
import Sprout from "./agentbar/Sprout";
import styles from "./agentbar.module.css";

/**
 * agentbar — the page behaves like the product.
 *
 * The set-piece is a real macOS menu bar pinned to the top of the viewport,
 * with the agentbar item in it, and the dropdown panel rendered beside the
 * masthead. Nobody else on this site can do that, because nobody else's
 * product is the top of your screen.
 *
 * Every animation lives inside a prefers-reduced-motion: no-preference block,
 * so the cascade outside it IS the finished page: gauges filled, sprout grown,
 * numbers at their real values, panel open.
 */

/** Inline stagger token, consumed as animation-delay: var(--d). */
const d = (ms: number): CSSProperties => ({ ["--d" as string]: `${ms}ms` });

/** The real shape agentbar prints, with numbers that are plausible, not claimed. */
const ROWS: Row[] = [
  { agent: "cc", label: "Claude Code", window: "5h", pct: 62, resets: "19:00" },
  { agent: "cc", label: "Claude Code", window: "7d", pct: 41, resets: "Fri" },
  { agent: "cx", label: "Codex", window: "5h", pct: 18, resets: "21:14" },
  { agent: "cx", label: "Codex", window: "7d", pct: 74, resets: "Sun" },
];

/** The pet's four states and what puts him in each. This is the feature, so the
 *  page shows all of it rather than describing one frame in a caption. */
const MOODS = [
  { mood: "calm", name: "calm", when: "room to work" },
  { mood: "working", name: "working", when: "a block is burning" },
  { mood: "strained", name: "strained", when: "past 80%" },
  { mood: "spent", name: "spent", when: "window gone" },
] as const;

/** Backticks in hero.note become keycap chips, the way forge does it. */
function renderNote(note: string) {
  return note.split("`").map((part, i) =>
    i % 2 === 1 ? (
      <code className={styles.kbd} key={i}>
        {part}
      </code>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export default function Hero({ hero, slug }: { hero: Hero; slug: string }) {
  const leadWords = hero.titleLead.split(" ");
  const mainWords = hero.titleMain.split(" ");
  let wi = 0;

  return (
    <div className={styles.root}>
      {/* ---- atmosphere ------------------------------------------------- */}
      <div className={styles.art} aria-hidden="true" />
      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.desktop} aria-hidden="true" />
      <div className={styles.scanline} aria-hidden="true" />
      <div className={styles.pxgrid} aria-hidden="true" />
      <div className={styles.noise} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.windowEdge} aria-hidden="true">
        <i className={`${styles.light} ${styles.lightRed}`} />
        <i className={`${styles.light} ${styles.lightAmber}`} />
        <i className={`${styles.light} ${styles.lightGreen}`} />
      </div>

      <MenuStrip mood="working" cc={62} cx={74} />

      {/* ---- nav --------------------------------------------------------- */}
      <nav className={styles.nav}>
        <Link className={styles.brand} href="/">
          <span className={styles.brandMark}>✦</span> Pablo
        </Link>
        <div className={styles.navLinks}>
          <Link href="/oss">OSS</Link>
          <Link href="/portfolio">Portfolio</Link>
          <Link href={`/portfolio/projects/${slug}`}>Write-up</Link>
          <a href={hero.repo} target="_blank" rel="noreferrer noopener">
            GitHub
          </a>
        </div>
      </nav>

      {/* ---- hero -------------------------------------------------------- */}
      <main className={styles.hero}>
        <div className={styles.masthead}>
          <p className={styles.kicker} style={d(700)}>
            <i className={styles.kickerDot} aria-hidden="true" />
            {hero.kicker}
          </p>

          <h1 className={styles.title}>
            <span className={styles.titleLine}>
              {leadWords.map((w, i) => (
                <span className={styles.mask} key={`l${i}`}>
                  <span className={styles.word} style={d(820 + wi++ * 88)}>
                    {w}
                  </span>
                </span>
              ))}
            </span>
            <span className={styles.titleLine}>
              {mainWords.map((w, i) => (
                <span className={styles.mask} key={`m${i}`}>
                  <span
                    className={`${styles.word}${i === mainWords.length - 1 ? ` ${styles.accentWord}` : ""}`}
                    style={d(820 + wi++ * 88)}
                  >
                    {w}
                  </span>
                </span>
              ))}
            </span>
          </h1>

          <div className={styles.seam} style={d(1180)} aria-hidden="true">
            <i style={{ left: "0%" }} />
            <i style={{ left: "25%" }} />
            <i style={{ left: "50%" }} />
            <i style={{ left: "75%" }} />
            <i style={{ left: "100%" }} />
          </div>

          <p className={styles.subtitle} style={d(1260)}>
            {hero.subtitle}
          </p>

          <p className={styles.note} style={d(1360)}>
            <span className={styles.prompt} aria-hidden="true">
              ~ ❯
            </span>
            {/* one span, so the flex gap falls between prompt and text rather
                than at every backtick in the install line */}
            <span className={styles.noteBody}>{renderNote(hero.note)}</span>
          </p>

          <div className={styles.cta}>
            <GaugeButton href={hero.repo} external delay={d(1440)}>
              Read the source
            </GaugeButton>
            <GaugeButton href={`/portfolio/projects/${slug}`} tone="ghost" delay={d(1540)}>
              How it works
            </GaugeButton>
          </div>
        </div>

        <div className={styles.panelWrap}>
          <GaugePanel
            rows={ROWS}
            mood="working"
            cost={41.28}
            status="on the clock"
            style={d(1500)}
          />
          <div className={styles.moodRail} style={d(1900)}>
            {MOODS.map((m, i) => (
              <div
                className={styles.mood}
                key={m.mood}
                style={{ ["--m" as string]: String(i) } as CSSProperties}
              >
                <Sprout mood={m.mood} scale={3} />
                <span className={styles.moodName}>{m.name}</span>
                <span className={styles.moodWhen}>{m.when}</span>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className={styles.foot}>
        <span>{hero.oss ? "MIT LICENSED" : "SOURCE AVAILABLE"}</span>
        <span className={styles.footDot}>·</span>
        <span>© 2026 Pablo Manjarres</span>
      </footer>
    </div>
  );
}
