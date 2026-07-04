"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { Hero } from "../../heroes";
import s from "./archgraph.module.css";

/* ==========================================================================
   Archgraph — HYBRID hero.
   The cinematic pixel-art drafting-table scene (/oss/archgraph.png) — whose
   glowing C4 blueprint IS the product's visual metaphor — is the full-bleed
   atmospheric background. The bespoke Chakra-Petch drafting UI (kicker,
   conveyor-reveal headline, terminal note, signature draw-on CTAs, architect's
   title-block stamp, hairline sheet frame) composites ON TOP over a legibility
   scrim, exactly like the Lumen page. Motion is opt-in via
   prefers-reduced-motion:no-preference, so the reduced/static state is the
   finished, fully-legible page.
   ========================================================================== */

const cssv = (d: number): CSSProperties => ({ ["--d" as string]: `${d}ms` });

/* ---- Draw-on CTA (signature button) ------------------------------------ */
function DrawButton({
  href,
  external,
  ghost,
  children,
}: {
  href: string;
  external?: boolean;
  ghost?: boolean;
  children: ReactNode;
}) {
  const rel = external ? "noreferrer" : undefined;
  const target = external ? "_blank" : undefined;
  return (
    <a className={`${s.drawBtn}${ghost ? ` ${s.ghost}` : ""}`} href={href} target={target} rel={rel}>
      <span className={s.drawLabel}>{children}</span>
      <svg className={s.drawSvg} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <rect className={s.drawRect} x={1} y={1} width={98} height={98} rx={9} pathLength={1} />
      </svg>
      <i className={`${s.node} ${s.n1}`} aria-hidden="true" />
      <i className={`${s.node} ${s.n2}`} aria-hidden="true" />
    </a>
  );
}

/* ---- Hero -------------------------------------------------------------- */
export default function Hero({ hero, slug }: { hero: Hero; slug: string }) {
  const h = hero;
  const leadWords = h.titleLead.split(" ");
  const mainWords = h.titleMain.split(" ");
  let wi = 0;

  return (
    <main className={s.root}>
      {/* atmosphere — pixel-art hero + legibility scrim + drafting overlays (decorative) */}
      <div className={s.art} aria-hidden="true" />
      <div className={s.scrim} aria-hidden="true" />
      <div className={s.grid} aria-hidden="true" />
      <div className={s.vignette} aria-hidden="true" />
      <div className={s.noise} aria-hidden="true" />
      <div className={s.frame} aria-hidden="true" />
      <span className={`${s.corner} ${s.cTL}`} aria-hidden="true" />
      <span className={`${s.corner} ${s.cTR}`} aria-hidden="true" />
      <span className={`${s.corner} ${s.cBL}`} aria-hidden="true" />
      <span className={`${s.corner} ${s.cBR}`} aria-hidden="true" />

      <nav className={s.bar}>
        <Link className={s.brand} href="/">
          <span className={s.brandMark}>✦</span> Pablo
        </Link>
        <div className={s.navLinks}>
          <Link className={s.navLink} href="/oss">
            Open source
          </Link>
          <Link className={s.navLink} href="/portfolio">
            Portfolio
          </Link>
          <a className={`${s.navLink} ${s.navExt}`} href={h.repo} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </div>
      </nav>

      <section className={s.stage}>
        <div className={s.col}>
          <p className={s.kicker} style={cssv(240)}>
            <span className={s.kTick} /> {h.kicker}
          </p>

          <h1 className={s.title} aria-label={`${h.titleLead} ${h.titleMain}`}>
            <span className={s.lineLead} aria-hidden="true">
              {leadWords.map((w, i) => (
                <span className={s.mask} key={`l${i}`}>
                  <span className={s.word} style={cssv(360 + wi++ * 88)}>
                    {w}
                  </span>
                </span>
              ))}
            </span>
            <span className={s.lineMain} aria-hidden="true">
              {mainWords.map((w, i) => (
                <span className={s.mask} key={`m${i}`}>
                  <span className={s.word} style={cssv(360 + wi++ * 88)}>
                    {w}
                  </span>
                </span>
              ))}
            </span>
          </h1>

          <div className={s.titleFoot} style={cssv(760)} aria-hidden="true">
            C4 · CONTEXT → CODE <span className={s.bar2} /> {h.title}
          </div>

          <p className={s.sub} style={cssv(840)}>
            {h.subtitle}
          </p>

          <p className={s.note} style={cssv(960)}>
            <span className={s.prompt}>$</span>
            <span>{h.note}</span>
          </p>

          <div className={s.cta} style={cssv(1080)}>
            <DrawButton href={h.repo} external>
              <span className={s.star} aria-hidden="true">★</span> Star on GitHub
            </DrawButton>
            {h.live && (
              <DrawButton href={h.live} external ghost>
                Live demo <span className={s.arrow} aria-hidden="true">↗</span>
              </DrawButton>
            )}
            <a
              className={s.writeup}
              href={`https://pablomanjarres.com/portfolio/projects/${slug}`}
            >
              Write-up
            </a>
          </div>
        </div>
      </section>

      <div className={s.titleBlock} style={cssv(1240)} aria-hidden="true">
        <div className={s.tbHead}>
          <span>DRAWING · C4 MODEL</span>
          <span className={s.amberDot} />
        </div>
        <div className={s.tbGrid}>
          <span>Sheet</span>
          <span>01 / 01</span>
          <span>Project</span>
          <span>{slug}</span>
          <span>Scale</span>
          <span>1:1 ISO</span>
          <span>Drawn by</span>
          <span>/graph</span>
        </div>
      </div>

      <footer className={s.foot}>
        <span className={s.footLic}>{h.oss ? "MIT LICENSED" : "SOURCE AVAILABLE"}</span>
        <span>© 2026 Pablo Manjarres</span>
      </footer>
    </main>
  );
}
