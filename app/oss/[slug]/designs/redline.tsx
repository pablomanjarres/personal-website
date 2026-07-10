"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { Hero } from "../../heroes";
import styles from "./redline.module.css";
import RedlinePen from "./redline/RedlinePen";
import RedlineAudit from "./redline/RedlineAudit";

/* REDLINE — "The Red Pen".
   A dark, clinical peer-review desk for the single-cell statistical-rigor
   auditor. The left column is the manuscript masthead: editorial display type
   with the aggressive verb marked in red pen and a hand-drawn reviewer's
   underline inked under the claim. The right column is a live audit set-piece
   (RedlineAudit) where a volcano plot's false discoveries get ringed and drained
   by a red sweep, a p-value is struck through with its corrected q, and an
   8-check ledger runs over a 46/46 · 0% FP benchmark. The whole scene is painted
   in CSS (no hero PNG). Motion is opt-in; the reduced/static state is finished. */

const cssv = (d: number): CSSProperties => ({ ["--d" as string]: `${d}ms` });

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

const RULES = [
  {
    n: "RULE 01",
    claim: "Correct, and show your work.",
    sub: "Every correction is reproducible and cited, and the corrected code downloads and runs on your own data.",
  },
  {
    n: "RULE 02",
    claim: "No fabricated fixes.",
    sub: "When a design is unsalvageable, a full confound or n = 1, Redline says so and shows no corrected result.",
  },
  {
    n: "RULE 03",
    claim: "Never cry wolf.",
    sub: "A clean analysis renders as Verified, in green, with the same confidence as a flag.",
  },
];

export default function Hero({ hero, slug }: { hero: Hero; slug: string }) {
  const h = hero;
  const leadWords = h.titleLead.split(" ");
  const writeup = `https://pablomanjarres.com/portfolio/projects/${slug}`;

  return (
    <main className={styles.root}>
      {/* -------- atmosphere: painted clinical scene (decorative) ---------- */}
      <div className={styles.atmosphere} aria-hidden="true">
        <div className={styles.art} />
        <div className={styles.grid} />
        <div className={styles.strikes} />
        <div className={styles.scrim} />
        <div className={styles.vignette} />
        <div className={styles.noise} />
      </div>
      <div className={styles.frame} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.cTL}`} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.cTR}`} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.cBL}`} aria-hidden="true" />
      <span className={`${styles.corner} ${styles.cBR}`} aria-hidden="true" />

      {/* -------- nav (restyled, same three parts) ------------------------- */}
      <nav className={styles.nav}>
        <Link className={styles.brand} href="/">
          <span className={styles.brandMark}>✦</span> Pablo
        </Link>
        <div className={styles.navRight}>
          <span className={styles.status} aria-hidden="true">
            <span className={styles.statusDot} /> 46/46 · 0% FP
          </span>
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
        </div>
      </nav>

      {/* -------- hero ----------------------------------------------------- */}
      <section className={styles.hero}>
        <div className={styles.masthead}>
          <p className={styles.kicker} style={cssv(120)}>
            <span className={styles.kickerTick} /> {h.kicker}
          </p>

          <h1 className={styles.title} aria-label={`${h.titleLead} ${h.titleMain}`}>
            <span className={styles.titleMask}>
              <span className={styles.lineLead} style={cssv(240)} aria-hidden="true">
                <span className={styles.accentWord}>{leadWords[0]}</span>
                {leadWords.length > 1 ? ` ${leadWords.slice(1).join(" ")}` : ""}
              </span>
            </span>
            <span className={styles.titleMask}>
              <span className={styles.lineMain} style={cssv(360)} aria-hidden="true">
                {h.titleMain}
              </span>
            </span>
            <svg
              className={styles.underline}
              viewBox="0 0 560 15"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                className={styles.underlinePath}
                d="M4 9 C 120 3, 240 13, 360 7 S 520 3, 556 9"
                pathLength={1}
              />
            </svg>
          </h1>

          <div className={styles.specStrip} style={cssv(520)} aria-hidden="true">
            <span className={styles.specStrong}>8 ERROR CLASSES</span>
            <span className={styles.specDivider} />
            <span>46 / 46 CAUGHT · 0% FP</span>
          </div>

          <p className={styles.sub} style={cssv(600)}>
            {h.subtitle}
          </p>

          <p className={styles.note} style={cssv(680)}>
            <span className={styles.notePrompt} aria-hidden="true">
              $
            </span>
            <span>{renderNote(h.note)}</span>
          </p>

          <div className={styles.ctaRow} style={cssv(800)}>
            <RedlinePen href={h.repo} external ariaLabel={`Star ${h.title} on GitHub`}>
              <span className={styles.penStar} aria-hidden="true">
                ★
              </span>
              Star on GitHub
            </RedlinePen>

            {h.live && (
              <RedlinePen href={h.live} variant="ghost" external ariaLabel="Open the live demo">
                Live demo
                <span className={styles.penStar} aria-hidden="true">
                  ↗
                </span>
              </RedlinePen>
            )}

            <a className={styles.writeup} href={writeup}>
              Write-up →
            </a>
          </div>
        </div>

        <RedlineAudit style={cssv(500)} />
      </section>

      {/* -------- creed: the three unbreakable rules ----------------------- */}
      <section className={styles.creed}>
        <div className={styles.creedInner}>
          {RULES.map((rule) => (
            <div className={styles.rule} key={rule.n}>
              <div className={styles.ruleNum}>{rule.n}</div>
              <div className={styles.ruleClaim}>{rule.claim}</div>
              <div className={styles.ruleSub}>{rule.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* -------- footer --------------------------------------------------- */}
      <footer className={styles.foot}>
        <span className={styles.footTag}>{h.oss ? "MIT LICENSED" : "SOURCE AVAILABLE"}</span>
        <span>© 2026 Pablo Manjarres</span>
      </footer>
    </main>
  );
}
