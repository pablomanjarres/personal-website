"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { Hero } from "../../heroes";
import styles from "./valhalla.module.css";
import AuroraEmbers from "./valhalla/AuroraEmbers";
import RuneButton from "./valhalla/RuneButton";
import FleetBoard from "./valhalla/FleetBoard";

/* VALHALLA — "The High Seat".
   The cinematic pixel-art aurora + molten rune-portal scene (/oss/valhalla.png)
   is the full-bleed atmospheric background; a green-black legibility scrim
   carries the Pixelify display type down the left column while the portal's
   molten glow stays near-clear on the right. The bespoke hall UI composites on
   top — a live faux-TUI fleet board that echoes the real product, aurora
   ribbons + rising square ember motes, CRT scanlines and an 8-bit rune frame,
   and the signature stepped molten RuneButton that throws a pixel-spark burst
   on strike. Motion is opt-in via prefers-reduced-motion, so the reduced/static
   state is the finished, fully-legible page. */

/* one boot timeline (ms), passed to the CSS reveals as --d */
const d = (ms: number): CSSProperties => ({ ["--d" as string]: `${ms}ms` });

/** Render hero.note, promoting `backtick` spans to mono command chips. */
function renderNote(note: string): ReactNode[] {
  return note.split("`").map((part, i) =>
    i % 2 === 1 ? (
      <code key={i} className={styles.kbd}>
        {part}
      </code>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function Hero({ hero, slug }: { hero: Hero; slug: string }) {
  const h = hero;
  const leadWords = h.titleLead.split(" ");
  const mainWords = h.titleMain.split(" ");
  const writeup = `https://pablomanjarres.com/portfolio/projects/${slug}`;
  let wi = 0;

  return (
    <main className={styles.root}>
      {/* -------- atmosphere: aurora + molten rune-portal scene ------------- */}
      <div className={styles.atmosphere} aria-hidden="true">
        <div
          className={styles.art}
          style={{ ["--bg" as string]: `url('/oss/${slug}.png')` } as CSSProperties}
        />
        <div className={styles.scrim} />
        <div className={styles.aurora}>
          <span className={`${styles.ribbon} ${styles.ribbonA}`} />
          <span className={`${styles.ribbon} ${styles.ribbonB}`} />
        </div>
        <AuroraEmbers className={styles.embers} />
        <div className={styles.vignette} />
        <div className={styles.scanlines} />
        <div className={styles.noise} />
        <div className={styles.frame} />
        <span className={`${styles.corner} ${styles.cTL}`}>ᚠ</span>
        <span className={`${styles.corner} ${styles.cTR}`}>ᚢ</span>
        <span className={`${styles.corner} ${styles.cBL}`}>ᚦ</span>
        <span className={`${styles.corner} ${styles.cBR}`}>ᛟ</span>
      </div>

      {/* -------- nav (hand-rolled, contract shape) ------------------------- */}
      <nav className={styles.nav}>
        <Link className={styles.brand} href="/">
          <span className={styles.brandMark}>✦</span> Pablo
        </Link>
        <div className={styles.navLinks}>
          <Link className={styles.navLink} href="/oss">
            Open source
          </Link>
          <Link className={styles.navLink} href="/portfolio">
            Portfolio
          </Link>
          <a
            className={`${styles.navLink} ${styles.navExt}`}
            href={h.repo}
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>
        </div>
      </nav>

      {/* -------- stage: masthead + fleet board ----------------------------- */}
      <section className={styles.stage}>
        <div className={styles.masthead}>
          <p className={styles.kicker} style={d(240)}>
            <span className={styles.kRune} aria-hidden="true">
              ᛟ
            </span>
            <span className={styles.kDash} aria-hidden="true" />
            {h.kicker}
          </p>

          <h1 className={styles.title} aria-label={`${h.titleLead} ${h.titleMain}`}>
            <span className={styles.lineLead} aria-hidden="true">
              {leadWords.map((w, i) => (
                <span className={styles.mask} key={`l${i}`}>
                  <span className={styles.word} style={d(360 + wi++ * 88)}>
                    {w}
                  </span>
                </span>
              ))}
            </span>
            <span className={styles.lineMain} aria-hidden="true">
              {mainWords.map((w, i) => (
                <span className={styles.mask} key={`m${i}`}>
                  <span className={styles.word} style={d(360 + wi++ * 88)}>
                    <span className={styles.molten}>{w}</span>
                  </span>
                </span>
              ))}
            </span>
          </h1>

          <div className={styles.titleFoot} style={d(760)} aria-hidden="true">
            8 SURFACES · ONE BOARD <span className={styles.tfBar} /> {h.title}
          </div>
          <div className={styles.runes} style={d(820)} aria-hidden="true">
            ᚠᚢᚦᚨᚱᚲᚷᚹ·ᚺᚾᛁᛃ
          </div>

          <p className={styles.sub} style={d(840)}>
            {h.subtitle}
          </p>

          <p className={styles.note} style={d(960)}>
            <span className={styles.notePrompt} aria-hidden="true">
              ❯
            </span>
            <span>{renderNote(h.note)}</span>
          </p>

          <div className={styles.cta} style={d(1080)}>
            <RuneButton
              href={h.repo}
              external
              ariaLabel={`Star ${h.title} on GitHub`}
            >
              <span className={styles.btnStar} aria-hidden="true">
                ★
              </span>
              Star on GitHub
            </RuneButton>

            {h.live && (
              <RuneButton
                href={h.live}
                variant="ghost"
                external
                ariaLabel="Open the live demo"
              >
                Live demo
                <span className={styles.btnStar} aria-hidden="true">
                  ↗
                </span>
              </RuneButton>
            )}

            <RuneButton href={writeup} variant="ghost" ariaLabel="Read the write-up">
              Write-up
              <span className={styles.btnStar} aria-hidden="true">
                →
              </span>
            </RuneButton>
          </div>
        </div>

        <FleetBoard className={styles.board} style={d(500)} />
      </section>

      {/* -------- runestone stamp ------------------------------------------ */}
      <aside className={styles.stamp} style={d(1240)} aria-hidden="true">
        <div className={styles.stampHead}>
          <span>HALL · VALHALLA</span>
          <span className={styles.stampDot} />
        </div>
        <div className={styles.stampGrid}>
          <span>Board</span>
          <span>ink</span>
          <span>Surfaces</span>
          <span>8</span>
          <span>Daemons</span>
          <span>~24</span>
          <span>Oracle</span>
          <span>status --json</span>
        </div>
      </aside>

      {/* -------- footer --------------------------------------------------- */}
      <footer className={styles.foot}>
        <span className={styles.footLic}>
          {h.oss ? "MIT LICENSED" : "SOURCE AVAILABLE"}
        </span>
        <span>© 2026 Pablo Manjarres</span>
      </footer>
    </main>
  );
}
