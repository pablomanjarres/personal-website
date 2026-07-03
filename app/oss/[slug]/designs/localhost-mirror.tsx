"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { Hero } from "../../heroes";
import styles from "./localhost-mirror.module.css";
import TunnelCanvas from "./localhost-mirror/TunnelCanvas";

/* Localhost Mirror — "Through the Mirror".
   A cool near-black private void holds mirror-silver instrument chrome and one
   tailnet-green signal (#4ADE80) that behaves as literal light — flowing through
   a receding canvas2d tunnel and glinting across every mirrored surface. The
   mirror primitive (-webkit-box-reflect + a traveling light-sweep) is shared by
   the hero screen and the CTAs, so hero and buttons run on ONE mechanic.
   Signature CTA effect: the mirror sweep. */

const rise = (d: string): CSSProperties => ({ ["--d"]: d } as CSSProperties);
const gleam = (d: string, g: string): CSSProperties =>
  ({ ["--d"]: d, ["--gleam"]: g } as CSSProperties);

/** Render hero.note, promoting `backtick` spans to mono command chips. */
function renderNote(note: string): ReactNode[] {
  return note.split("`").map((part, i) =>
    i % 2 === 1 ? (
      <code key={i} className={styles.chip}>
        {part}
      </code>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function Hero({ hero, slug }: { hero: Hero; slug: string }) {
  const h = hero;
  const writeup = `https://pablomanjarres.com/portfolio/projects/${slug}`;

  return (
    <main className={styles.root}>
      {/* atmosphere: tailnet lattice, tunnel wash, mirror horizon, vignette, grain */}
      <div className={styles.atmosphere} aria-hidden="true">
        <div className={styles.grid} />
        <div className={styles.glow} />
        <div className={styles.horizon} />
        <div className={styles.vignette} />
        <div className={styles.grain} />
      </div>

      {/* nav — same three parts, restyled as an instrument header */}
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
            className={styles.navLink}
            href={h.repo}
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>
        </div>
      </nav>

      <section className={styles.stage}>
        {/* -------- copy column -------- */}
        <div className={styles.content}>
          <p className={styles.kicker} style={rise("0.12s")}>
            <span className={styles.kickerDot} aria-hidden="true" />
            {h.kicker}
          </p>

          <h1 className={styles.title}>
            <span className={styles.titleLead} style={rise("0.24s")}>
              {h.titleLead}
            </span>
            <span className={styles.titleMain} style={rise("0.36s")}>
              {h.titleMain}
            </span>
          </h1>

          <p className={styles.subtitle} style={rise("0.52s")}>
            {h.subtitle}
          </p>
          <p className={styles.note} style={rise("0.62s")}>
            {renderNote(h.note)}
          </p>

          <div className={styles.ctaRow} style={rise("0.74s")}>
            <a
              className={`${styles.btn} ${styles.btnPrimary}`}
              href={h.repo}
              target="_blank"
              rel="noreferrer"
              style={gleam("0.74s", "1.7s")}
              aria-label="Star Localhost Mirror on GitHub"
            >
              <span className={styles.btnStar} aria-hidden="true">
                ★
              </span>
              Star on GitHub
            </a>

            {h.live && (
              <a
                className={`${styles.btn} ${styles.btnGhost}`}
                href={h.live}
                target="_blank"
                rel="noreferrer"
                style={gleam("0.82s", "1.9s")}
                aria-label="Open the live demo"
              >
                Live demo
                <span className={styles.btnArrow} aria-hidden="true">
                  ↗
                </span>
              </a>
            )}

            <a
              className={`${styles.btn} ${styles.btnGhost}`}
              href={writeup}
              style={gleam("0.9s", "2s")}
            >
              Write-up
              <span className={styles.btnArrow} aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </div>

        {/* -------- instrument viewport: the tunnel of light, mirrored -------- */}
        <div className={styles.screenWrap} style={rise("0.5s")}>
          <div className={styles.screen}>
            <TunnelCanvas className={styles.canvas} />
            <div className={styles.screenHead} aria-hidden="true">
              <span className={styles.screenTag}>lm://:3000</span>
              <span className={styles.screenStatus}>
                <span className={styles.screenDot} />
                tailnet-only
              </span>
            </div>
            <div className={styles.screenRim} aria-hidden="true" />
            <div
              className={styles.screenFlash}
              style={rise("1.4s")}
              aria-hidden="true"
            />
          </div>

          <div className={styles.readout} aria-hidden="true">
            <span>
              <b>:3000</b> <span className={styles.readAccent}>→</span>{" "}
              <b>100.71.0.14</b>
            </span>
            <span className={styles.readWire} />
            <span>
              <span className={styles.readAccent}>●</span> mirror ready
            </span>
          </div>
        </div>
      </section>

      <footer className={styles.foot}>
        <span className={styles.footTag}>
          {h.oss ? "MIT Licensed" : "Source Available"}
        </span>
        <span>© 2026 Pablo Manjarres</span>
      </footer>
    </main>
  );
}
