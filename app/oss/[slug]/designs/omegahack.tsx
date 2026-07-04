"use client";

import Link from "next/link";
import type { ReactNode, CSSProperties } from "react";
import type { Hero } from "../../heroes";
import styles from "./omegahack.module.css";
import CaseDossier from "./omegahack/CaseDossier";

/* CAROL — "The Night Archive" (HYBRID).
   The cinematic pixel-art scene (/oss/omegahack.png) — a lamplit civic archive
   of case boxes, an open ledger and a deadline clock — is the full-bleed
   ATMOSPHERIC background (the product's visual metaphor). Over a warm dark scrim
   the bespoke "Deadline Dossier" typography, warm palette and signature effect
   composite ON TOP: the official rubber-seal STAMP on the primary CTAs (radial
   dome + worn-ink grunge + double-ruled frame; presses on :active, stamps down
   on load), and the cream case file laid on the lamplit desk. */

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

/** The signature seal-stamp CTA. */
function SealButton({
  href,
  variant = "solid",
  external = false,
  style,
  ariaLabel,
  children,
}: {
  href: string;
  variant?: "solid" | "ghost";
  external?: boolean;
  style?: CSSProperties;
  ariaLabel?: string;
  children: ReactNode;
}) {
  const ext = external
    ? { target: "_blank", rel: "noreferrer" }
    : {};
  return (
    <a
      className={variant === "ghost" ? styles.sealGhost : styles.seal}
      href={href}
      aria-label={ariaLabel}
      style={style}
      {...ext}
    >
      <span className={styles.sealInk} aria-hidden="true" />
      <span className={styles.sealGrain} aria-hidden="true" />
      <span className={styles.sealFrame} aria-hidden="true" />
      <span className={styles.sealLabel}>{children}</span>
    </a>
  );
}

export default function Hero({ hero, slug }: { hero: Hero; slug: string }) {
  const h = hero;
  const mainWords = h.titleMain.split(" ");
  const writeup = `https://pablomanjarres.com/portfolio/projects/${slug}`;

  return (
    <main className={styles.root}>
      {/* atmosphere: the pixel-art archive as full-bleed background, a warm lamp
          bloom over its focal point, a legibility scrim, vignette, grain + the
          seal-ink brand rule — the bespoke design composites above this. */}
      <div className={styles.atmosphere} aria-hidden="true">
        <div className={styles.art} />
        <div className={styles.glow} />
        <div className={styles.scrim} />
        <div className={styles.vignette} />
        <div className={styles.grain} />
        <div className={styles.topRule} />
      </div>

      {/* nav — same three parts, restyled as a filing header */}
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

      <section className={styles.hero}>
        {/* -------- masthead -------- */}
        <div className={styles.masthead}>
          <span className={styles.kickerMask}>
            <span className={styles.kicker} style={delay("0.12s")}>
              <span className={styles.kickerDot} aria-hidden="true" />
              {h.kicker}
            </span>
          </span>

          <h1 className={styles.title}>
            <span className={styles.titleMask}>
              <span className={styles.titleLine} style={delay("0.26s")}>
                {h.titleLead}
              </span>
            </span>
            <span className={styles.titleMask}>
              <span
                className={`${styles.titleLine} ${styles.titleLine2}`}
                style={delay("0.4s")}
              >
                {mainWords.map((w, i) => (
                  <span
                    key={i}
                    className={i === mainWords.length - 1 ? styles.titleAccent : undefined}
                  >
                    {w}
                    {i < mainWords.length - 1 ? " " : ""}
                  </span>
                ))}
                <span className={styles.titleRule} aria-hidden="true" />
              </span>
            </span>
          </h1>

          <p className={styles.subtitle} style={delay("0.56s")}>
            {h.subtitle}
          </p>
          <p className={styles.note} style={delay("0.66s")}>
            {renderNote(h.note)}
          </p>

          <div className={styles.ctaRow}>
            <SealButton
              href={h.repo}
              external
              ariaLabel="Star CAROL on GitHub"
              style={delay("0.8s")}
            >
              <span className={styles.sealStar} aria-hidden="true">
                ★
              </span>
              Star on GitHub
            </SealButton>

            {h.live && (
              <SealButton
                href={h.live}
                variant="ghost"
                external
                ariaLabel="Open the live demo"
                style={delay("0.92s")}
              >
                Live demo
                <span className={styles.sealStar} aria-hidden="true">
                  ↗
                </span>
              </SealButton>
            )}

            <a className={styles.ledgerLink} href={writeup} style={delay("1s")}>
              Write-up
              <span className={styles.ledgerArrow} aria-hidden="true">
                →
              </span>
            </a>
          </div>
        </div>

        {/* -------- live case dossier -------- */}
        <CaseDossier system={h.title} />
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
