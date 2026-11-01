"use client";

import Link from "next/link";
import { SiteMark } from "@/app/site/components";
import type { CSSProperties, ReactNode } from "react";
import type { Hero } from "../../heroes";
import s from "./vibethon-hackathon.module.css";
import TurnBoard from "./vibethon-hackathon/TurnBoard";
import StallButton from "./vibethon-hackathon/StallButton";
import TicketLink from "./vibethon-hackathon/TicketLink";

/* HEDGE PARKING — "Rush hour at the gate" (HYBRID).
   The dusk campus lot (/oss/vibethon-hackathon.png, animated by the Veo loop in
   /portfolio/banners/) is the full-bleed background. Over it the page reads as
   wayfinding: a road-sign headline in Barlow Condensed, painted lane lines,
   a headlight sweep from the two gates, and the live turn board that runs the
   app's split rule. CTAs are parking stalls that paint their lines and park a
   car on hover. Motion is opt-in; the reduced state is the finished page. */

const delay = (ms: number) => ({ ["--d" as string]: `${ms}ms` }) as CSSProperties;

/** Render hero.note, promoting `backtick` spans to mono chips like a plate. */
function renderNote(note: string): ReactNode[] {
  return note.split("`").map((part, i) =>
    i % 2 === 1 ? (
      <code key={i} className={s.plate}>
        {part}
      </code>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

/** The three facts the product is built on, shown as lane markers under the pitch. */
const RULES = [
  { code: "01", label: "First to arrive, either gate" },
  { code: "02", label: "Tie goes to the gate with fewer stalls" },
  { code: "03", label: "Every refusal says why" },
];

export default function Hero({ hero, slug }: { hero: Hero; slug: string }) {
  const h = hero;
  const writeup = `https://pablomanjarres.com/portfolio/projects/${slug}`;
  const leadWords = h.titleLead.split(" ");
  const mainWords = h.titleMain.split(" ");
  let wi = 0;
  return (
    <main className={s.root}>
      {/* ---- atmosphere: dusk lot loop, scrim, lane paint, headlights ---- */}
      <div className={s.atmosphere} aria-hidden="true">
        <div className={s.art} style={{ ["--bg" as string]: `url('/oss/${slug}.png')` } as CSSProperties} />
        <video className={s.loop} autoPlay muted loop playsInline preload="metadata" poster={`/oss/${slug}.png`}>
          <source
            src={`/portfolio/banners/${slug}.webm`}
            type="video/webm"
            media="(prefers-reduced-motion: no-preference)"
          />
          <source
            src={`/portfolio/banners/${slug}.mp4`}
            type="video/mp4"
            media="(prefers-reduced-motion: no-preference)"
          />
        </video>
        <div className={s.scrim} />
        <div className={s.lanes} />
        <div className={`${s.beam} ${s.beamLeft}`} />
        <div className={`${s.beam} ${s.beamRight}`} />
        <div className={s.grain} />
        <div className={s.vignette} />
        <div className={s.curb} />
      </div>

      {/* ---- nav: same three parts, restyled as a gate sign ---- */}
      <nav className={s.nav}>
        <SiteMark className={s.brand} href="/" />
        <div className={s.navRight}>
          <span className={s.navGates}>
            <span className={s.gateChip}>LV</span>
            <span className={s.gateJoin} />
            <span className={s.gateChip}>RG</span>
          </span>
          <div className={s.navLinks}>
            <Link className={s.navLink} href="/oss">
              Open source
            </Link>
            <Link className={s.navLink} href="/portfolio">
              Portfolio
            </Link>
            <a className={s.navLink} href={h.repo} target="_blank" rel="noreferrer">
              GitHub ↗
            </a>
          </div>
        </div>
      </nav>

      {/* ---- hero ---- */}
      <section className={s.stage}>
        <div className={s.col}>
          <p className={s.kicker} style={delay(120)}>
            <svg className={s.mark} viewBox="0 0 64 64" aria-hidden="true">
              <g className={s.markHedge}>
                <circle cx="18" cy="20" r="8" />
                <circle cx="32" cy="15" r="9" />
                <circle cx="46" cy="20" r="8" />
                <rect x="10" y="20" width="44" height="7" rx="2" />
              </g>
              <path className={s.markStall} d="M12 56V33H52V56" />
            </svg>
            {h.kicker}
          </p>

          <h1 className={s.title} aria-label={`${h.titleLead} ${h.titleMain}`}>
            <span className={s.lineLead} aria-hidden="true">
              {leadWords.map((w, i) => (
                <span className={s.mask} key={`l${i}`}>
                  <span className={s.word} style={delay(240 + wi++ * 70)}>
                    {w}
                  </span>
                </span>
              ))}
            </span>
            <span className={s.lineMain} aria-hidden="true">
              {mainWords.map((w, i) => (
                <span className={s.mask} key={`m${i}`}>
                  <span
                    className={`${s.word} ${i === mainWords.length - 2 ? s.wordFair : ""}`}
                    style={delay(240 + wi++ * 70)}
                  >
                    {w}
                  </span>
                </span>
              ))}
            </span>
          </h1>

          <div className={s.stripe} style={delay(760)} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>

          <p className={s.sub} style={delay(840)}>
            {h.subtitle}
          </p>

          <ul className={s.rules} aria-label="How the lot decides">
            {RULES.map((r, i) => (
              <li key={r.code} className={s.rule} style={delay(920 + i * 80)}>
                <span className={s.ruleCode}>{r.code}</span>
                <span>{r.label}</span>
              </li>
            ))}
          </ul>

          <p className={s.note} style={delay(1160)}>
            <span className={s.notePrompt} aria-hidden="true">
              P
            </span>
            <span>{renderNote(h.note)}</span>
          </p>

          <div className={s.ctaRow}>
            <StallButton href={h.repo} external ariaLabel={`Star ${h.title} on GitHub`} style={delay(1240)}>
              <span className={s.btnGlyph} aria-hidden="true">
                ★
              </span>
              Star on GitHub
            </StallButton>
            {h.live && (
              <StallButton href={h.live} tone="ticket" ariaLabel="Open the live demo" style={delay(1320)}>
                Try the lot
                <span className={s.btnGlyph} aria-hidden="true">
                  ↗
                </span>
              </StallButton>
            )}
            <TicketLink href={writeup} stub="F-001" style={delay(h.live ? 1400 : 1320)}>
              Read the write-up
            </TicketLink>
          </div>
        </div>

        <TurnBoard style={delay(620)} />
      </section>

      {/* ---- footer ---- */}
      <footer className={s.foot}>
        <span className={s.footLic}>{h.oss ? "MIT LICENSED" : "SOURCE AVAILABLE"}</span>
        <span className={s.footMid} aria-hidden="true">
          EAFIT · MEDELLÍN · 30.10.2026
        </span>
        <span>© 2026 Pablo Manjarres</span>
      </footer>
    </main>
  );
}
