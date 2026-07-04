"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { Hero } from "../../heroes";
import styles from "./band-of-agents.module.css";
import VerdictRing from "./band-of-agents/VerdictRing";
import VerdictStamp from "./band-of-agents/VerdictStamp";

/* ============================================================================
   BAND OF AGENTS — "The Verdict Docket"
   A sci-fi legal war-room: a marketing-compliance tribunal where 17 specialist
   agents with competing mandates argue to a single auditable verdict. Editorial-
   legal authority (court-gazette Fraunces, parchment Spectral testimony, Martian
   Mono machine record) over a HUD-lit ink console. Two verdict signals only —
   resolution green vs dissent red.

   Signature button: the VERDICT STAMP — an embossed rubber-stamp CTA that lands
   with a thud, flips its action to a green PUBLISHED verdict on hover, and bleeds
   ink + flecks on click (band-of-agents/VerdictStamp.tsx).
   Hero motion: the VERDICT RING — an inline-SVG constellation of the 17 agents
   whose argument-edges send lit signal packets and resolve to a stamped verdict
   (band-of-agents/VerdictRing.tsx). All scoped to band-of-agents.module.css.
   ========================================================================== */

const delay = (d: string): CSSProperties => ({ ["--d"]: d } as CSSProperties);

/** Render hero.note, promoting parenthetical `(command)` groups to mono chips. */
function renderNote(note: string): ReactNode[] {
  return note.split(/(\([^()]*\))/g).map((part, i) =>
    part.startsWith("(") && part.endsWith(")") ? (
      <code key={i} className={styles.cmd}>
        {part.slice(1, -1)}
      </code>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function Hero({ hero, slug }: { hero: Hero; slug: string }) {
  const h = hero;
  const mainWords = h.titleMain.split(" ");
  const writeup = `https://pablomanjarres.com/portfolio/projects/${slug}`;
  const license = h.oss ? "MIT LICENSED" : "SOURCE AVAILABLE";

  return (
    <main className={styles.root}>
      {/* -------------------------------- atmosphere ------------------------ */}
      <div className={styles.atmosphere} aria-hidden="true">
        <div
          className={styles.art}
          style={{ ["--bg"]: `url('/oss/${slug}.png')` } as CSSProperties}
        />
        <div className={styles.glow} />
        <div className={styles.grid} />
        <div className={styles.scrim} />
        <div className={styles.grain} />
        <div className={styles.vignette} />
        <span className={styles.watermark}>§</span>
      </div>

      {/* ------------------------------------ nav --------------------------- */}
      <nav className={styles.nav}>
        <Link className={styles.brand} href="/">
          <span className={styles.brandMark} aria-hidden="true">
            ✦
          </span>
          Pablo
        </Link>
        <div className={styles.navLinks}>
          <Link className={styles.navLink} href="/oss">
            Open source
          </Link>
          <Link className={styles.navLink} href="/portfolio">
            Portfolio
          </Link>
          <a
            className={styles.navLink}
            href={h.repo}
            target="_blank"
            rel="noreferrer"
          >
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
      </nav>

      {/* ------------------------------------ hero -------------------------- */}
      <section className={styles.hero}>
        {/* --------- masthead (the human argument) --------- */}
        <div className={styles.masthead}>
          <div className={styles.kicker} style={delay("0.14s")}>
            <span className={styles.kickerSeal} aria-hidden="true" />
            {h.kicker}
          </div>

          <div className={styles.docket} style={delay("0.2s")}>
            <span>CASE No. BoA·2026·017</span>
            <span className={styles.docketDiv} aria-hidden="true" />
            <span>17 AGENTS</span>
            <span className={styles.docketDiv} aria-hidden="true" />
            <span className={styles.docketVote}>
              VERDICT 11–<em>6</em>
            </span>
          </div>

          <h1 className={styles.title}>
            <span className={styles.titleMask}>
              <span className={styles.titleLine} style={delay("0.3s")}>
                {h.titleLead}
              </span>
            </span>
            <span className={styles.titleMask}>
              <span
                className={`${styles.titleLine} ${styles.titleLine2}`}
                style={delay("0.42s")}
              >
                {mainWords.map((w, i) => {
                  const last = i === mainWords.length - 1;
                  return (
                    <span
                      key={i}
                      className={last ? styles.titleAccent : undefined}
                    >
                      {w}
                      {!last ? " " : ""}
                      {last && (
                        <span className={styles.titleRule} aria-hidden="true" />
                      )}
                    </span>
                  );
                })}
              </span>
            </span>
          </h1>

          <p className={styles.subtitle} style={delay("0.58s")}>
            {h.subtitle}
          </p>
          <p className={styles.note} style={delay("0.68s")}>
            {renderNote(h.note)}
          </p>

          <div className={styles.ctaRow}>
            <VerdictStamp
              href={h.repo}
              variant="primary"
              verdict="PUBLISHED"
              external
              ariaLabel={`Star ${h.title} on GitHub`}
              style={delay("0.82s")}
            >
              <span className={styles.stampStar} aria-hidden="true">
                ★
              </span>
              Star on GitHub
            </VerdictStamp>

            {h.live && (
              <VerdictStamp
                href={h.live}
                variant="ghost"
                verdict="IN SESSION"
                external
                ariaLabel={`Open the live ${h.title} room`}
                style={delay("0.92s")}
              >
                Live demo
                <span className={styles.stampStar} aria-hidden="true">
                  ↗
                </span>
              </VerdictStamp>
            )}

            <a className={styles.fileLink} href={writeup} style={delay("1.02s")}>
              Read the case file
              <span className={styles.fileArrow} aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </div>

        {/* --------- console (the auditable record) --------- */}
        <div className={styles.console} style={delay("0.46s")}>
          <div className={styles.consoleHead}>
            <span className={styles.consoleLive}>
              <span className={styles.livePip} aria-hidden="true" />
              TRIBUNAL · LIVE
            </span>
            <span className={styles.consoleSession}>SESSION 017</span>
          </div>

          <VerdictRing />

          <div className={styles.legend}>
            <span className={styles.legendItem}>
              <span
                className={`${styles.legendDot} ${styles.dotConcur}`}
                aria-hidden="true"
              />
              CONCUR 11
            </span>
            <span className={styles.legendItem}>
              <span
                className={`${styles.legendDot} ${styles.dotDissent}`}
                aria-hidden="true"
              />
              DISSENT 6
            </span>
            <span className={styles.legendTrace}>traced · rule ↔ agent</span>
          </div>
        </div>
      </section>

      {/* ----------------------------------- footer ------------------------- */}
      <footer className={styles.foot}>
        <span className={styles.footTag}>{license}</span>
        <span className={styles.footRule} aria-hidden="true" />
        <span>© 2026 Pablo Manjarres</span>
      </footer>
    </main>
  );
}
