"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { Hero } from "../../heroes";
import styles from "./forge.module.css";
import ForgeEmbers from "./forge/ForgeEmbers";
import ForgeButton from "./forge/ForgeButton";
import ForgeConsole from "./forge/ForgeConsole";

/* FORGE — "The Smithy" (HYBRID).
   The cinematic pixel-art molten-blacksmith scene (/oss/forge.png) is the
   full-bleed atmospheric background; a warm-dark legibility scrim carries the
   type down the left column while the forge's molten focal point (the anvil,
   spark-burst and glowing film-strip) stays near-clear. The bespoke smithy UI
   composites on top — brushed-metal type struck into hot metal, live ember
   sparks riding subtly over the photo, and the signature molten-heat CTA that
   ignites on hover and throws a spark burst on strike. */

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
      {/* -------- atmosphere: cinematic pixel-art forge photo + scrim ------- */}
      <div className={styles.atmosphere} aria-hidden="true">
        <div
          className={styles.art}
          style={{ ["--bg"]: `url('/oss/${slug}.png')` } as CSSProperties}
        />
        <div className={styles.scrim} />
        {/* live molten sparks, riding subtly OVER the photo (additive/screen) */}
        <ForgeEmbers className={styles.embers} />
        <div className={styles.grain} />
        <div className={styles.vignette} />
      </div>

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
