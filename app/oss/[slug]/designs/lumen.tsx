"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { Hero } from "../../heroes";
import s from "./lumen.module.css";
import MarkerButton from "./lumen/MarkerButton";
import LumenBoard from "./lumen/LumenBoard";

/* ==========================================================================
   LUMEN TUTOR — "The Live Whiteboard".
   A warm graph-paper teaching surface for an AI tutor that draws its calculus
   explanations. The bespoke set-piece (LumenBoard) strokes an "area under a
   curve" lesson on by itself and hand-letters the annotations in a marker
   script; the bespoke MarkerButton inks its border on like a felt pen on hover.
   Atmosphere: paper wash, blueprint grid, desk-lamp glow, grain, vignette, and
   a ruled left margin with pinned tacks. Motion is one choreographed lesson,
   opt-in via prefers-reduced-motion:no-preference — the reduced/static state is
   the finished, fully-drawn page. Scoped CSS Module; signature/props are locked
   per ./CONTRACT.md.
   ========================================================================== */

const cssv = (d: number): CSSProperties => ({ ["--d" as string]: `${d}ms` });

/** Render hero.note, promoting `backtick` spans to mono marker-command chips. */
function renderNote(note: string): ReactNode[] {
  return note.split("`").map((part, i) =>
    i % 2 === 1 ? (
      <code key={i} className={s.chip}>
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
    <main className={s.root}>
      {/* -------- atmosphere (decorative) --------------------------------- */}
      <div className={s.paper} aria-hidden="true" />
      <div className={s.grid} aria-hidden="true" />
      <div className={s.lamp} aria-hidden="true" />
      <div className={s.grain} aria-hidden="true" />
      <div className={s.vignette} aria-hidden="true" />
      <div className={s.margin} aria-hidden="true">
        <span className={`${s.tack} ${s.tackTL}`} />
        <span className={`${s.tack} ${s.tackTR}`} />
        <span className={s.marginLabel}>area = ∫ₐᵇ f(x) dx</span>
      </div>

      {/* -------- nav ----------------------------------------------------- */}
      <nav className={s.nav}>
        <Link className={s.brand} href="/">
          <span className={s.brandMark}>✦</span> Pablo
        </Link>
        <div className={s.navRight}>
          <span className={s.chalkTray} aria-hidden="true">
            <i className={`${s.nib} ${s.nibNavy}`} />
            <i className={`${s.nib} ${s.nibBlue}`} />
            <i className={`${s.nib} ${s.nibTeal}`} />
            <i className={`${s.nib} ${s.nibRed}`} />
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

      {/* -------- stage --------------------------------------------------- */}
      <section className={s.stage}>
        <div className={s.col}>
          <p className={s.kicker} style={cssv(220)}>
            <span className={s.kickerDot} aria-hidden="true" />
            {h.kicker}
          </p>

          <h1 className={s.title} aria-label={`${h.titleLead} ${h.titleMain}`}>
            <span className={s.lineLead} aria-hidden="true">
              {leadWords.map((w, i) => (
                <span className={s.mask} key={`l${i}`}>
                  <span className={s.word} style={cssv(360 + wi++ * 92)}>
                    {w}
                  </span>
                </span>
              ))}
            </span>
            <span className={s.lineMain} aria-hidden="true">
              {mainWords.map((w, i) => (
                <span className={s.mask} key={`m${i}`}>
                  <span
                    className={`${s.word} ${s.wordInk}`}
                    style={cssv(360 + wi++ * 92)}
                  >
                    {w}
                  </span>
                </span>
              ))}
              <span className={s.underline} style={cssv(360 + wi * 92)} aria-hidden="true" />
            </span>
          </h1>

          <p className={s.sub} style={cssv(1000)}>
            {h.subtitle}
          </p>

          <p className={s.note} style={cssv(1120)}>
            <span className={s.notePen} aria-hidden="true" />
            <span>{renderNote(h.note)}</span>
          </p>

          <div className={s.cta} style={cssv(1240)}>
            <MarkerButton href={h.repo} external color="navy">
              <span className={s.star} aria-hidden="true">
                ★
              </span>
              Star on GitHub
            </MarkerButton>

            {h.live && (
              <MarkerButton href={h.live} external ghost color="blue">
                Live demo
                <span className={s.arrow} aria-hidden="true">
                  ↗
                </span>
              </MarkerButton>
            )}

            <a className={s.writeup} href={writeup}>
              Write-up
            </a>
          </div>
        </div>

        <LumenBoard style={cssv(520)} />
      </section>

      {/* -------- footer -------------------------------------------------- */}
      <footer className={s.foot}>
        <span className={s.footLic}>
          {h.oss ? "MIT LICENSED" : "SOURCE AVAILABLE"}
        </span>
        <span className={s.footNote} aria-hidden="true">
          draws with GPT-4o → Excalidraw
        </span>
        <span>© 2026 Pablo Manjarres</span>
      </footer>
    </main>
  );
}
