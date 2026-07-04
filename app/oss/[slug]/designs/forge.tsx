"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { Hero } from "../../heroes";
import styles from "./forge.module.css";
import ForgeEmbers from "./forge/ForgeEmbers";
import ForgeButton from "./forge/ForgeButton";
import ForgeConsole from "./forge/ForgeConsole";

/* FORGE — "The Smithy".
   A dark iron-black forge for the menu-bar app that casts image/video/voice,
   runs coding agents, and renders Remotion. Rising ember canvas + molten floor
   glow + brushed-metal type struck into hot metal. Signature CTA: molten-heat
   gradient that ignites on hover and throws a spark burst on strike. */

const delay = (d: string) => ({ ["--d"]: d } as CSSProperties);

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

  return (
    <main className={styles.root}>
      {/* -------- atmosphere: rising embers, molten pool, anvil, grain ------ */}
      <ForgeEmbers className={styles.embers} />
      <div className={styles.pool} aria-hidden="true" />
      <div className={styles.poolShine} aria-hidden="true" />
      <div className={styles.anvil} aria-hidden="true">
        <svg viewBox="0 0 640 150" preserveAspectRatio="xMidYMax meet">
          <defs>
            <linearGradient id="forgeMetal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#5a5048" />
              <stop offset="0.5" stopColor="#2c241d" />
              <stop offset="1" stopColor="#14100c" />
            </linearGradient>
            <linearGradient id="forgeFront" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#211a15" />
              <stop offset="1" stopColor="#0d0a07" />
            </linearGradient>
            <radialGradient id="forgeHot" cx="0.5" cy="0.5" r="0.6">
              <stop offset="0" stopColor="#ffe6b0" />
              <stop offset="0.4" stopColor="#ff7a1a" />
              <stop offset="1" stopColor="#7a0000" />
            </radialGradient>
          </defs>
          {/* billet body: lit top face + shadowed front face */}
          <polygon points="176,58 470,58 502,92 138,92" fill="url(#forgeMetal)" />
          <polygon points="138,92 502,92 486,122 154,122" fill="url(#forgeFront)" />
          {/* freshly-cut molten end */}
          <polygon points="176,58 138,92 154,122 176,120" fill="url(#forgeHot)" opacity="0.95" />
          {/* top rim light + a couple of brushed hairlines */}
          <line x1="176" y1="59" x2="470" y2="59" stroke="#c9b79a" strokeWidth="1.4" opacity="0.5" />
          <line x1="170" y1="103" x2="470" y2="103" stroke="#3a2f26" strokeWidth="1" opacity="0.7" />
          <line x1="170" y1="112" x2="452" y2="112" stroke="#3a2f26" strokeWidth="1" opacity="0.5" />
        </svg>
      </div>
      <div className={styles.floor} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />

      {/* -------- nav (restyled, same three parts) -------------------------- */}
      <nav className={styles.nav}>
        <Link className={styles.brand} href="/">
          <span className={styles.brandMark}>✦</span> Pablo
        </Link>
        <div className={styles.navRight}>
          <span className={styles.port} aria-hidden="true">
            <span className={styles.portDot} /> :3400
          </span>
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
        </div>
      </nav>

      {/* -------- hero ------------------------------------------------------ */}
      <section className={styles.hero}>
        <div className={styles.masthead}>
          <div className={styles.kicker} style={delay("0.12s")}>
            <span className={styles.kickerDot} aria-hidden="true" />
            {h.kicker}
          </div>

          <h1 className={styles.title} aria-label={`${h.titleLead} ${h.titleMain}`}>
            <span className={styles.titleMask}>
              <span
                className={`${styles.titleLine} ${styles.titleLead}`}
                style={delay("0.24s")}
                aria-hidden="true"
              >
                {leadWords.join(" ")}
              </span>
            </span>
            <span className={styles.titleMask}>
              <span
                className={styles.titleLine}
                style={delay("0.36s")}
                aria-hidden="true"
              >
                {mainWords.map((w, i) => (
                  <span
                    key={i}
                    className={
                      i === mainWords.length - 1 ? styles.accentWord : undefined
                    }
                  >
                    {w}
                    {i < mainWords.length - 1 ? " " : ""}
                  </span>
                ))}
              </span>
            </span>
          </h1>

          <div className={styles.seam} style={delay("0.52s")} aria-hidden="true" />

          <p className={styles.subtitle} style={delay("0.6s")}>
            {h.subtitle}
          </p>

          <p className={styles.note} style={delay("0.68s")}>
            <span className={styles.notePrompt} aria-hidden="true">
              »
            </span>
            <span>{renderNote(h.note)}</span>
          </p>

          <div className={styles.ctaRow}>
            <ForgeButton
              href={h.repo}
              external
              ariaLabel={`Star ${h.title} on GitHub`}
              style={delay("0.8s")}
            >
              <span className={styles.btnStar} aria-hidden="true">
                ★
              </span>
              Star on GitHub
            </ForgeButton>

            {h.live && (
              <ForgeButton
                href={h.live}
                variant="ghost"
                external
                ariaLabel="Open the live demo"
                style={delay("0.9s")}
              >
                Live demo
                <span className={styles.btnStar} aria-hidden="true">
                  ↗
                </span>
              </ForgeButton>
            )}

            <ForgeButton
              href={writeup}
              variant="ghost"
              ariaLabel="Read the write-up"
              style={delay(h.live ? "1s" : "0.9s")}
            >
              Write-up
              <span className={styles.btnStar} aria-hidden="true">
                →
              </span>
            </ForgeButton>
          </div>
        </div>

        <ForgeConsole style={delay("0.5s")} />
      </section>

      {/* -------- footer --------------------------------------------------- */}
      <footer className={styles.foot}>
        <span className={styles.footTag}>
          {h.oss ? "MIT Licensed" : "Source Available"}
        </span>
        <span>© 2026 Pablo Manjarres</span>
      </footer>
    </main>
  );
}
