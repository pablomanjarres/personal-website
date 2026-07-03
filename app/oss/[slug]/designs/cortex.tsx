"use client";

// Cortex — "your whole life, one encrypted dashboard."
// An OLED-black decryption vault: a faint ciphertext-rain field breathes behind
// a rotating hex cipher-dial; the headline renders as ciphertext and DECRYPTS on
// load (staggered per line); the CTAs rest as ciphertext and REFORM into words
// on hover — hero and buttons share one decrypt gesture. One phosphor-teal
// signal color on true black, with a single keychain-gold keyhole at the core.
// Dependency-free: canvas2d rain + CSS/SVG dial + a ~40-line rAF scramble hook.
// See ./CONTRACT.md — the signature/props/nav shape are locked.
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import type { Hero } from "../../heroes";
import styles from "./cortex.module.css";
import CipherRain from "./cortex/CipherRain";
import CipherCore from "./cortex/CipherCore";
import ScrambleLine from "./cortex/ScrambleLine";
import ScrambleButton from "./cortex/ScrambleButton";

// One orchestrated page-load timeline (ms). Shared by the CSS reveals (as
// --delay) and the JS decrypt starts so atmosphere → nav → headline → body →
// CTAs → footer cascade as a single act of decryption.
const T = {
  core: 200,
  frame: 260,
  brand: 360,
  nav: 480,
  kicker: 640,
  lead: 820,
  main: 980,
  caret: 1560,
  sub: 1260,
  note: 1410,
  cta1: 1560,
  cta2: 1670,
  foot: 1840,
};

const ms = (n: number): CSSProperties => ({ ["--delay" as string]: `${n}ms` });

// Split a headline line so a single key noun can carry the teal signal color,
// driven by the real copy (no accent if the word isn't present).
function splitAccent(line: string, keyword: string) {
  const i = line.toLowerCase().indexOf(keyword.toLowerCase());
  if (i < 0) return [{ text: line, accent: false }];
  const parts: { text: string; accent: boolean }[] = [];
  if (i > 0) parts.push({ text: line.slice(0, i), accent: false });
  parts.push({ text: line.slice(i, i + keyword.length), accent: true });
  if (i + keyword.length < line.length)
    parts.push({ text: line.slice(i + keyword.length), accent: false });
  return parts;
}

// Render the run/install line, promoting `code` spans if the copy contains them.
function NoteBody({ text }: { text: string }): ReactNode {
  return text.split("`").map((seg, i) =>
    i % 2 === 1 ? (
      <code key={i} className={styles.code}>
        {seg}
      </code>
    ) : (
      <span key={i}>{seg}</span>
    ),
  );
}

export default function Hero({ hero, slug }: { hero: Hero; slug: string }) {
  const h = hero;
  const writeup = `https://pablomanjarres.com/portfolio/projects/${slug}`;
  const mainParts = splitAccent(h.titleMain, "encrypted");

  return (
    <main className={styles.root}>
      {/* atmosphere — all decorative */}
      <CipherRain className={styles.rain} />
      <div className={styles.coreWrap} aria-hidden="true">
        <CipherCore className={styles.core} styles={styles} />
      </div>
      <div className={styles.rainMask} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      {/* HUD frame */}
      <div className={`${styles.frame} ${styles.frameReveal}`} style={ms(T.frame)} aria-hidden="true">
        <span className={`${styles.tick} ${styles.tickTL}`} />
        <span className={`${styles.tick} ${styles.tickTR}`} />
        <span className={`${styles.tick} ${styles.tickBL}`} />
        <span className={`${styles.tick} ${styles.tickBR}`} />
        <span className={styles.frameLabel}>VAULT // ENCRYPTED · LOCAL-FIRST</span>
      </div>

      <nav className={styles.nav}>
        <Link className={`${styles.brand} ${styles.reveal}`} href="/" style={ms(T.brand)}>
          <b className={styles.brandMark}>✦</b> Pablo
        </Link>
        <div className={`${styles.navLinks} ${styles.reveal}`} style={ms(T.nav)}>
          <Link className={styles.navLink} href="/oss">
            Open source
          </Link>
          <Link className={styles.navLink} href="/portfolio">
            Portfolio
          </Link>
          <a className={styles.navLink} href={h.repo} target="_blank" rel="noreferrer">
            GitHub <span aria-hidden="true">↗</span>
          </a>
        </div>
      </nav>

      <section className={styles.hero}>
        <div className={`${styles.kickerRow} ${styles.reveal}`} style={ms(T.kicker)}>
          <span className={styles.kicker}>
            <span className={styles.kickerTick} aria-hidden="true" />
            {h.kicker}
          </span>
          <span className={styles.telemetry} aria-hidden="true">
            <span className={styles.chip}>AES · ENCRYPTED AT REST</span>
            <span className={styles.chip}>LOCAL-FIRST</span>
            <span className={styles.chip}>51-TOOL MCP</span>
          </span>
        </div>

        <h1 className={styles.title} aria-label={`${h.titleLead} ${h.titleMain}`}>
          <span className={styles.titleLine}>
            <ScrambleLine
              text={h.titleLead}
              delay={T.lead}
              spread={30}
              className={`${styles.seg} ${styles.fade}`}
              dudClass={styles.dud}
            />
          </span>
          <span className={styles.titleLine}>
            {mainParts.map((p, i) => (
              <ScrambleLine
                key={i}
                text={p.text}
                delay={T.main + i * 70}
                spread={30}
                className={`${styles.seg} ${styles.fade} ${p.accent ? styles.accent : ""}`}
                dudClass={styles.dud}
              />
            ))}
            <span
              className={styles.cursor}
              style={{ ["--caret-delay" as string]: `${T.caret}ms` }}
              aria-hidden="true"
            />
          </span>
        </h1>

        <p className={`${styles.subtitle} ${styles.reveal}`} style={ms(T.sub)}>
          {h.subtitle}
        </p>

        <p className={`${styles.note} ${styles.reveal}`} style={ms(T.note)}>
          <span className={styles.notePrompt} aria-hidden="true">
            ▸
          </span>
          <span className={styles.noteBody}>
            <NoteBody text={h.note} />
          </span>
        </p>

        <div className={styles.ctaRow}>
          <span className={`${styles.ctaWrap} ${styles.reveal}`} style={ms(T.cta1)}>
            <ScrambleButton
              label="Star on GitHub"
              href={h.repo}
              icon="★"
              external
              seal
              delay={T.cta1 + 260}
              className={`${styles.cta} ${styles.ctaPrimary}`}
              iconClass={styles.ctaIcon}
              labelClass={styles.ctaLabel}
              dudClass={styles.dud}
              sealingClass={styles.sealing}
            />
          </span>

          {h.live && (
            <span className={`${styles.ctaWrap} ${styles.reveal}`} style={ms(T.cta2)}>
              <ScrambleButton
                label="Live demo"
                href={h.live}
                icon="↗"
                external
                delay={T.cta2 + 260}
                className={`${styles.cta} ${styles.ctaGhost}`}
                iconClass={styles.ctaIcon}
                labelClass={styles.ctaLabel}
                dudClass={styles.dud}
              />
            </span>
          )}

          <span className={`${styles.ctaWrap} ${styles.reveal}`} style={ms(h.live ? T.foot - 40 : T.cta2)}>
            <ScrambleButton
              label="Write-up"
              href={writeup}
              icon="›"
              delay={(h.live ? T.foot - 40 : T.cta2) + 260}
              className={`${styles.cta} ${styles.ctaGhost}`}
              iconClass={styles.ctaIcon}
              labelClass={styles.ctaLabel}
              dudClass={styles.dud}
            />
          </span>
        </div>
      </section>

      <footer className={`${styles.footer} ${styles.reveal}`} style={ms(T.foot)}>
        <span className={styles.license}>
          <span className={styles.lock} aria-hidden="true" />
          {h.oss ? "MIT LICENSED" : "SOURCE AVAILABLE"}
        </span>
        <span className={styles.hudRight} aria-hidden="true">
          cortex // decrypted · 0x33
        </span>
        <span>© 2026 Pablo Manjarres</span>
      </footer>
    </main>
  );
}
