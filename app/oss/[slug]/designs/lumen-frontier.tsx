"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import type { Hero } from "../../heroes";
import styles from "./lumen-frontier.module.css";
import GalaxyCanvas from "./lumen-frontier/GalaxyCanvas";

// Lumen Frontier — "a private observatory reading a heritage celestial atlas."
// Deep-space navy ground, brass/burgundy/cognac lit by ivory starlight; the
// product's own fly-through galaxy (ported to raw WebGL, zero deps) is the live
// hero. One orchestrated page-load: the galaxy fades up, then the Fraunces
// headline, a brass hairline rule and a Space-Mono caption stagger in like an
// atlas plate drawing itself. See ./CONTRACT.md — signature/props are locked.
export default function Hero({ hero, slug }: { hero: Hero; slug: string }) {
  const h = hero;
  const writeup = `https://pablomanjarres.com/portfolio/projects/${slug}`;
  const d = (v: string): CSSProperties => ({ ["--delay" as string]: v });

  return (
    <main className={styles.root}>
      {/* atmosphere — decorative */}
      <div className={styles.poster} aria-hidden="true" />
      <GalaxyCanvas className={styles.canvas} />
      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />
      <div className={styles.frame} aria-hidden="true">
        <span className={`${styles.tick} ${styles.tickTL}`} />
        <span className={`${styles.tick} ${styles.tickTR}`} />
        <span className={`${styles.tick} ${styles.tickBL}`} />
        <span className={`${styles.tick} ${styles.tickBR}`} />
        <span className={styles.frameLabel}>Plate IV · Lumen Atlas</span>
      </div>

      <nav className={styles.nav}>
        <Link className={`${styles.brand} ${styles.rise}`} href="/" style={d("0.15s")}>
          <b className={styles.brandMark}>✦</b> Pablo
        </Link>
        <div className={`${styles.navLinks} ${styles.rise}`} style={d("0.28s")}>
          <Link href="/oss">Open source</Link>
          <Link href="/portfolio">Portfolio</Link>
          <a href={h.repo} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={`${styles.kickerRow} ${styles.rise}`} style={d("0.5s")}>
          <span className={styles.kicker}>
            <span className={styles.kickerTick} aria-hidden="true" />
            {h.kicker}
          </span>
          <span className={styles.coord} aria-hidden="true">
            R.A. 17ʰ32ᵐ · DEC +34° · MAG 4.2
          </span>
        </div>

        <h1 className={styles.title} aria-label={`${h.titleLead} ${h.titleMain}`}>
          <span className={styles.titleLine} aria-hidden="true">
            <span className={styles.lineInner} style={d("0.68s")}>
              {h.titleLead}
            </span>
          </span>
          <span className={styles.titleLine} aria-hidden="true">
            <span className={`${styles.lineInner} ${styles.titleAccent}`} style={d("0.82s")}>
              {h.titleMain}
            </span>
          </span>
        </h1>

        <div className={`${styles.rule} ${styles.ruleReveal}`} style={d("1.08s")} aria-hidden="true">
          <span className={styles.ruleNode} />
        </div>

        <p className={`${styles.subtitle} ${styles.rise}`} style={d("1.2s")}>
          {h.subtitle}
        </p>

        <p className={`${styles.note} ${styles.rise}`} style={d("1.34s")}>
          <span className={styles.noteTick} aria-hidden="true" />
          <span>{h.note}</span>
        </p>

        <div className={styles.ctaRow}>
          <span className={styles.riseBtn} style={d("1.5s")}>
            <a
              className={`${styles.cta} ${styles.ctaPrimary}`}
              href={h.repo}
              target="_blank"
              rel="noreferrer"
            >
              <span className={styles.ctaLabel}>★ Star on GitHub</span>
              <span className={styles.satelliteRing} aria-hidden="true">
                <span className={styles.satellite} />
              </span>
            </a>
          </span>

          {h.live && (
            <span className={styles.riseBtn} style={d("1.62s")}>
              <a
                className={`${styles.cta} ${styles.ctaLive}`}
                href={h.live}
                target="_blank"
                rel="noreferrer"
              >
                <span className={styles.ctaLabel}>Live demo ↗</span>
                <span className={styles.satelliteRing} aria-hidden="true">
                  <span className={styles.satellite} />
                </span>
              </a>
            </span>
          )}

          <span className={styles.riseBtn} style={d("1.74s")}>
            <a className={styles.writeup} href={writeup}>
              <span>Write-up</span>
            </a>
          </span>
        </div>
      </section>

      <footer className={`${styles.footer} ${styles.rise}`} style={d("1.9s")}>
        <span className={styles.license}>{h.oss ? "MIT LICENSED" : "SOURCE AVAILABLE"}</span>
        <span className={styles.plate} aria-hidden="true">
          Lat. 4°35′N · Observ. Bogotá
        </span>
        <span>© 2026 Pablo Manjarres</span>
      </footer>
    </main>
  );
}
