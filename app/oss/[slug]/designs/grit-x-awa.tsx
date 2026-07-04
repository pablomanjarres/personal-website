"use client";

// GRIT-X-AWA — "classify exoplanets from Kepler and TESS."
// HYBRID hero: the cinematic pixel-art "observatory control room" (a holographic
// exoplanet + a ringed gas giant through a starfield dome) is the full-bleed
// ATMOSPHERE, and the bespoke deep-space design composites on top of it. A tuned
// void-navy scrim (darker on the text side + bottom) buys legibility; a faint
// canvas starfield drifts over the painted dome so the sky shimmers; the headline
// fades in line by line with a stellar-cyan accent; and the CTAs run a radar
// "signal acquire" sweep on hover. Void navy + stellar cyan + one amber beacon —
// the same palette the art is painted in. Dependency-free: a ~40-line canvas2d
// starfield leaf + CSS. See ./CONTRACT.md — the signature/props/nav shape are locked.
import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import type { Hero } from "../../heroes";
import styles from "./grit-x-awa.module.css";

// One orchestrated page-load timeline (ms), shared by the CSS reveals as
// --delay so art → frame → nav → headline → body → CTAs → footer cascade as a
// single boot sequence.
const T = {
  art: 120,
  frame: 340,
  brand: 440,
  nav: 540,
  kicker: 680,
  lead: 840,
  main: 1000,
  sub: 1220,
  note: 1360,
  cta1: 1500,
  cta2: 1610,
  cta3: 1720,
  foot: 1880,
};

const ms = (n: number): CSSProperties => ({ ["--delay" as string]: `${n}ms` });

// Split a headline line so a single key noun can carry the cyan signal color,
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

// Canvas2d starfield leaf — twinkling stars on a slow parallax drift, kept faint
// (see .stars opacity) so it reads as the painted dome shimmering rather than a
// second sky. Nested so the rAF loop never bloats the hero boundary. Draws a
// single static frame (no loop) when the user prefers reduced motion.
function Starfield({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let w = 0;
    let h = 0;
    let dpr = 1;
    type Star = { x: number; y: number; r: number; a: number; tw: number; vx: number };
    let stars: Star[] = [];

    const seed = () => {
      // fewer than the painted dome carries — this is an accent, not the sky
      const count = Math.min(130, Math.round((w * h) / 13000));
      stars = Array.from({ length: count }, () => {
        const depth = Math.random();
        return {
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.4 + depth * 1.4,
          a: 0.25 + Math.random() * 0.6,
          tw: 0.6 + Math.random() * 1.8,
          vx: (0.04 + depth * 0.16) * (window.devicePixelRatio || 1),
        };
      });
    };

    const paint = (s: Star, alpha: number) => {
      const rgb = s.r > 1.2 ? "150, 210, 255" : "214, 226, 255";
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r * dpr, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${rgb}, ${Math.max(0, Math.min(1, alpha)).toFixed(3)})`;
      ctx.fill();
    };

    const staticFrame = () => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) paint(s, s.a);
    };

    const loop = (t: number) => {
      ctx.clearRect(0, 0, w, h);
      for (const s of stars) {
        s.x -= s.vx;
        if (s.x < -2) s.x = w + 2;
        const flicker = s.a * (0.55 + 0.45 * Math.sin(t * 0.001 * s.tw + s.y));
        paint(s, flicker);
      }
      raf = requestAnimationFrame(loop);
    };

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      w = canvas.clientWidth * dpr;
      h = canvas.clientHeight * dpr;
      canvas.width = w;
      canvas.height = h;
      seed();
      if (reduce) staticFrame();
    };

    resize();
    window.addEventListener("resize", resize);
    if (reduce) {
      staticFrame();
    } else {
      raf = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}

export default function Hero({ hero, slug }: { hero: Hero; slug: string }) {
  const h = hero;
  const writeup = `https://pablomanjarres.com/portfolio/projects/${slug}`;
  const leadParts = splitAccent(h.titleLead, "exoplanets");
  const mainParts = splitAccent(h.titleMain, "exoplanets");

  return (
    <main className={styles.root}>
      {/* atmosphere — all decorative. The pixel-art observatory is the ground
          layer; everything else is a scrim/overlay tuned for legibility. */}
      <div
        className={`${styles.art} ${styles.artReveal}`}
        style={ms(T.art)}
        aria-hidden="true"
      />
      <Starfield className={styles.stars} />
      <div className={styles.scrim} aria-hidden="true" />
      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      {/* HUD frame */}
      <div
        className={`${styles.frame} ${styles.frameReveal}`}
        style={ms(T.frame)}
        aria-hidden="true"
      >
        <span className={`${styles.tick} ${styles.tickTL}`} />
        <span className={`${styles.tick} ${styles.tickTR}`} />
        <span className={`${styles.tick} ${styles.tickBL}`} />
        <span className={`${styles.tick} ${styles.tickBR}`} />
        <span className={styles.frameLabel}>OBSERVATORY // EXOPLANET CLASSIFIER</span>
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
          {/* astronomy-style coordinates — the original Kepler field in Cygnus–Lyra */}
          <span className={styles.coord} aria-hidden="true">
            R.A. 19ʰ22ᵐ · DEC +44°.5
          </span>
          <span className={styles.telemetry} aria-hidden="true">
            <span className={styles.chip}>ENSEMBLE · CAT/XGB/LGBM</span>
            <span className={styles.chip}>KEPLER + TESS</span>
            <span className={styles.chip}>KEYLESS DEMO</span>
          </span>
        </div>

        <h1 className={styles.title} aria-label={`${h.titleLead} ${h.titleMain}`}>
          <span className={styles.titleLine}>
            {leadParts.map((p, i) => (
              <span
                key={i}
                className={`${styles.seg} ${styles.fade} ${p.accent ? styles.accent : ""}`}
                style={ms(T.lead + i * 70)}
              >
                {p.text}
              </span>
            ))}
          </span>
          <span className={styles.titleLine}>
            {mainParts.map((p, i) => (
              <span
                key={i}
                className={`${styles.seg} ${styles.fade} ${p.accent ? styles.accent : ""}`}
                style={ms(T.main + i * 70)}
              >
                {p.text}
              </span>
            ))}
            <span className={styles.cursor} aria-hidden="true" />
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
            <a
              className={`${styles.cta} ${styles.ctaPrimary}`}
              href={h.repo}
              target="_blank"
              rel="noreferrer"
              aria-label="Star on GitHub"
            >
              <span className={styles.ctaIcon} aria-hidden="true">
                ★
              </span>
              <span className={styles.ctaLabel}>Star on GitHub</span>
            </a>
          </span>

          {h.live && (
            <span className={`${styles.ctaWrap} ${styles.reveal}`} style={ms(T.cta2)}>
              <a
                className={`${styles.cta} ${styles.ctaGhost}`}
                href={h.live}
                target="_blank"
                rel="noreferrer"
                aria-label="Live demo"
              >
                <span className={styles.ctaIcon} aria-hidden="true">
                  ↗
                </span>
                <span className={styles.ctaLabel}>Live demo</span>
              </a>
            </span>
          )}

          <span
            className={`${styles.ctaWrap} ${styles.reveal}`}
            style={ms(h.live ? T.cta3 : T.cta2)}
          >
            <Link className={`${styles.cta} ${styles.ctaGhost}`} href={writeup} aria-label="Write-up">
              <span className={styles.ctaIcon} aria-hidden="true">
                ›
              </span>
              <span className={styles.ctaLabel}>Write-up</span>
            </Link>
          </span>
        </div>
      </section>

      <footer className={`${styles.footer} ${styles.reveal}`} style={ms(T.foot)}>
        <span className={styles.license}>
          <span className={styles.beacon} aria-hidden="true" />
          {h.oss ? "MIT LICENSED" : "SOURCE AVAILABLE"}
        </span>
        <span className={styles.hudRight} aria-hidden="true">
          KEPLER FIELD · CYGNUS–LYRA · SIGNAL ACQUIRED
        </span>
        <span>© 2026 Pablo Manjarres</span>
      </footer>
    </main>
  );
}
