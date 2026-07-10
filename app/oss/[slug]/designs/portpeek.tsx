"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { Hero } from "../../heroes";
import s from "./portpeek.module.css";
import PortScope from "./portpeek/PortScope";
import ScanButton from "./portpeek/ScanButton";

/* PORTPEEK — "The Localhost Scope".
   A native-macOS system-utility landing for a menu-bar port scanner. localhost
   is PAINTED as a radar scope (dotted port-grid + concentric rings + a rotating
   sweep, no PNG); the signature set-piece is a live menu-bar dropdown that scans
   and evicts ports on the real 3-second cadence. ONE system-blue threads the
   chrome/CTA, ONE system-red is reserved for eviction, and the honest multi-color
   process dots come from CommonPorts.swift. Motion is opt-in; the base state is
   the finished, legible page (see the reduced-motion fallback in the module). */

const d = (delay: number): CSSProperties => ({ ["--d" as string]: `${delay}ms` });

/** Render hero.note, promoting `backtick` spans to mono command chips. */
function renderNote(note: string): ReactNode[] {
  return note.split("`").map((part, i) =>
    i % 2 === 1 ? (
      <code key={i} className={s.code}>
        {part}
      </code>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

// decorative strapline — the real lsof invocation the scanner shells every 3s
const STRAP = ["lsof", "-iTCP", "-sTCP:LISTEN"];

export default function Hero({ hero, slug }: { hero: Hero; slug: string }) {
  const h = hero;
  const writeup = `https://pablomanjarres.com/portfolio/projects/${slug}`;
  const leadWords = h.titleLead.split(" ");
  const mainWords = h.titleMain.split(" ");
  let wi = 0;

  return (
    <main className={s.root}>
      {/* ---- atmosphere: painted radar scope (all decorative) ------------- */}
      <div className={s.atmosphere} aria-hidden="true">
        <div className={s.grid} />
        <div className={s.rings} />
        <div className={s.sweepWrap}>
          <div className={s.sweep} />
        </div>
        <div className={s.scan} />
        <div className={s.vignette} />
        <div className={s.noise} />
      </div>

      {/* ---- nav: styled as a translucent macOS menu bar ------------------ */}
      <nav className={s.nav}>
        <Link className={s.brand} href="/">
          <span className={s.brandMark}>✦</span> Pablo
        </Link>
        <div className={s.navRight}>
          <span className={s.menuChip} aria-hidden="true">
            <span className={s.chipGlyph}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
                <circle cx="12" cy="12" r="9" />
                <path
                  d="M3 12h18M12 3c2.5 2.5 2.5 15 0 18M12 3c-2.5 2.5-2.5 15 0 18"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <span className={s.chipDot} />
            PortPeek
          </span>
          <div className={s.navLinks}>
            <Link className={s.navLink} href="/oss">
              Open source
            </Link>
            <Link className={s.navLink} href="/portfolio">
              Portfolio
            </Link>
            <a
              className={`${s.navLink} ${s.navExt}`}
              href={h.repo}
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
          </div>
        </div>
      </nav>

      {/* ---- stage: copy column + the live scope set-piece ---------------- */}
      <section className={s.stage}>
        <div className={s.copy}>
          <p className={s.kicker} style={d(220)}>
            <span className={s.kTick} /> {h.kicker}
          </p>

          <h1 className={s.title} aria-label={`${h.titleLead} ${h.titleMain}`}>
            <span className={s.lineLead} aria-hidden="true">
              {leadWords.map((w, i) => (
                <span className={s.mask} key={`l${i}`}>
                  <span className={s.word} style={d(340 + wi++ * 82)}>
                    {w}
                  </span>
                </span>
              ))}
            </span>
            <span className={s.lineMain} aria-hidden="true">
              {mainWords.map((w, i) => (
                <span className={s.mask} key={`m${i}`}>
                  <span className={s.word} style={d(340 + wi++ * 82)}>
                    {w}
                  </span>
                </span>
              ))}
            </span>
          </h1>

          <div className={s.strap} style={d(760)} aria-hidden="true">
            {STRAP.map((t, i) => (
              <span className={s.strapItem} key={t}>
                {i > 0 && <span className={s.strapSep} />} <b>{t}</b>
              </span>
            ))}
            <span className={s.strapLine} />
          </div>

          <p className={s.sub} style={d(840)}>
            {h.subtitle}
          </p>

          <p className={s.note} style={d(940)}>
            <span className={s.notePrompt} aria-hidden="true">
              $
            </span>
            <span>{renderNote(h.note)}</span>
          </p>

          <div className={s.ctaRow} style={d(1040)}>
            <ScanButton href={h.repo} external ariaLabel={`Star ${h.title} on GitHub`}>
              <span className={s.btnStar} aria-hidden="true">
                ★
              </span>
              Star on GitHub
            </ScanButton>

            {h.live && (
              <ScanButton
                href={h.live}
                variant="ghost"
                external
                ariaLabel="Open the live demo"
              >
                Live demo
                <span className={s.btnStar} aria-hidden="true">
                  ↗
                </span>
              </ScanButton>
            )}

            <a className={s.writeup} href={writeup}>
              Write-up
            </a>
          </div>
        </div>

        <div className={s.scopeCol}>
          <PortScope style={d(560)} />
        </div>
      </section>

      {/* ---- footer ------------------------------------------------------- */}
      <footer className={s.foot}>
        <span className={s.footTag}>
          {h.oss ? "MIT LICENSED" : "SOURCE AVAILABLE"}
        </span>
        <span>© 2026 Pablo Manjarres</span>
      </footer>
    </main>
  );
}
