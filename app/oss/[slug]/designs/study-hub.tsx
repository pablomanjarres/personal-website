"use client";

// Study Hub — "the marked-up textbook, brought to life." HYBRID build.
// The cinematic pixel-art scene (/oss/study-hub.png) is the full-bleed atmospheric
// background — the product's visual metaphor — and the bespoke editorial layer is
// composited ON TOP: a serif headline whose second line sits in true italic and
// carries a single accent that drifts through the three subject colors (sapphire ·
// jade · amethyst), Caveat-style marginalia scribbled into the gutter, and a
// signature highlighter-marker sweep on every CTA. A directional dark scrim (heavy
// on the text column + bottom, near-clear over the lamp/book focal point) plus
// text-shadows and frosted chips/CTAs keep type crisp over the art. The
// dependency-free finite-automaton canvas — the product's step-through gesture — is
// dialed back to a faint screen-blended accent that floats over the art, never
// hiding it. All looping motion is gated behind prefers-reduced-motion.
// See ./CONTRACT.md — the signature/props/nav shape are locked.
import type { CSSProperties, ReactNode } from "react";
import { useEffect, useRef } from "react";
import Link from "next/link";
import type { Hero } from "../../heroes";
import styles from "./study-hub.module.css";

// One orchestrated page-load timeline (ms): atmosphere → nav → kicker → headline
// → body → note → CTAs → footer cascade like ink settling onto a page.
const T = {
  frame: 220,
  brand: 340,
  nav: 460,
  kicker: 620,
  chips: 720,
  lead: 860,
  main: 1000,
  underline: 1180,
  sub: 1300,
  note: 1440,
  cta1: 1580,
  cta2: 1680,
  cta3: 1760,
  marg: 1900,
  foot: 1980,
};

const ms = (n: number): CSSProperties => ({ ["--delay" as string]: `${n}ms` });

// The three subjects, each with its curated accent (from the repo's design
// system: [data-subject] accent bridge). Rendered as chips in the kicker row.
const SUBJECTS: { label: string; accent: string }[] = [
  { label: "Lenguajes Formales", accent: "#4d8df5" }, // sapphire
  { label: "Estructuras de Datos", accent: "#26bd93" }, // jade
  { label: "Sistemas de Gestión", accent: "#9b7cf6" }, // amethyst
];

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

// A ghost CTA / primary CTA with the shared highlighter-marker sweep. The sweep
// is a hover-driven pseudo-stroke in the current (drifting) accent — user gesture
// only, so it stays out of the reduced-motion gate.
function Cta({
  href,
  label,
  icon,
  external,
  primary,
  delay,
}: {
  href: string;
  label: string;
  icon: string;
  external?: boolean;
  primary?: boolean;
  delay: number;
}) {
  const cls = `${styles.cta} ${primary ? styles.ctaPrimary : styles.ctaGhost} ${styles.reveal}`;
  const rel = external ? { target: "_blank", rel: "noreferrer" } : {};
  return (
    <a className={cls} style={ms(delay)} href={href} {...rel}>
      <span className={styles.hl} aria-hidden="true" />
      <span className={styles.ctaLabel}>{label}</span>
      <span className={styles.ctaIcon} aria-hidden="true">
        {icon}
      </span>
    </a>
  );
}

// ---------------------------------------------------------------------------
// AutomatonField — dependency-free canvas2d. Draws a faint DFA (states + directed
// edges, one accepting node double-ringed) and a single token that eases from
// state to state along the walk, echoing the product's step-through runner. Under
// reduced motion it paints ONE static frame and never starts the rAF loop.
// ---------------------------------------------------------------------------
function AutomatonField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // normalized node layout (0..1) + the subject-hue palette
    const nodes: { x: number; y: number; hue: string; accept?: boolean }[] = [
      { x: 0.14, y: 0.32, hue: "#4d8df5" },
      { x: 0.4, y: 0.18, hue: "#26bd93" },
      { x: 0.66, y: 0.34, hue: "#9b7cf6" },
      { x: 0.86, y: 0.6, hue: "#4d8df5", accept: true },
      { x: 0.56, y: 0.7, hue: "#26bd93" },
      { x: 0.26, y: 0.64, hue: "#9b7cf6" },
    ];
    // directed edges (index pairs)
    const edges: [number, number][] = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 5],
      [5, 0],
      [1, 4],
      [2, 4],
    ];
    // the token's walk through the states
    const walk = [0, 1, 2, 3, 4, 5, 0, 1, 4, 2, 3];

    let w = 0;
    let h = 0;
    let dpr = 1;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = Math.max(1, r.width);
      h = Math.max(1, r.height);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const P = (i: number) => ({ x: nodes[i].x * w, y: nodes[i].y * h });

    const drawEdge = (a: number, b: number) => {
      const p = P(a);
      const q = P(b);
      const mx = (p.x + q.x) / 2;
      const my = (p.y + q.y) / 2 - 26;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.quadraticCurveTo(mx, my, q.x, q.y);
      ctx.strokeStyle = "rgba(150,160,180,0.16)";
      ctx.lineWidth = 1;
      ctx.stroke();
      // arrowhead at q, angled from the control point
      const ang = Math.atan2(q.y - my, q.x - mx);
      ctx.beginPath();
      ctx.moveTo(q.x, q.y);
      ctx.lineTo(q.x - 7 * Math.cos(ang - 0.4), q.y - 7 * Math.sin(ang - 0.4));
      ctx.lineTo(q.x - 7 * Math.cos(ang + 0.4), q.y - 7 * Math.sin(ang + 0.4));
      ctx.closePath();
      ctx.fillStyle = "rgba(150,160,180,0.22)";
      ctx.fill();
    };

    const drawNode = (i: number, lit: boolean) => {
      const p = P(i);
      const n = nodes[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, 12, 0, Math.PI * 2);
      ctx.strokeStyle = lit ? n.hue : "rgba(150,160,180,0.34)";
      ctx.lineWidth = lit ? 2 : 1.25;
      ctx.stroke();
      if (n.accept) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 7.5, 0, Math.PI * 2);
        ctx.strokeStyle = lit ? n.hue : "rgba(150,160,180,0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      if (lit) {
        ctx.save();
        ctx.shadowBlur = 16;
        ctx.shadowColor = n.hue;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = n.hue;
        ctx.fill();
        ctx.restore();
      }
    };

    const frame = (litIndex: number, tok?: { x: number; y: number; hue: string }) => {
      ctx.clearRect(0, 0, w, h);
      for (const [a, b] of edges) drawEdge(a, b);
      for (let i = 0; i < nodes.length; i++) drawNode(i, i === litIndex);
      if (tok) {
        ctx.save();
        ctx.shadowBlur = 20;
        ctx.shadowColor = tok.hue;
        ctx.beginPath();
        ctx.arc(tok.x, tok.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = "#f4f4f6";
        ctx.fill();
        ctx.restore();
      }
    };

    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let ro: ResizeObserver | undefined;
    if (typeof ResizeObserver === "function") {
      ro = new ResizeObserver(() => {
        resize();
        if (reduce) frame(0);
      });
      ro.observe(canvas);
    }

    if (reduce) {
      frame(0);
      return () => ro?.disconnect();
    }

    // animate: token eases node → node, dwelling briefly at each state
    const HOP = 900; // ms per hop
    const DWELL = 260; // ms at each node
    const ease = (t: number) => t * t * (3 - 2 * t);
    let raf = 0;
    let start = 0;
    const loop = (now: number) => {
      if (!start) start = now;
      const elapsed = now - start;
      const per = HOP + DWELL;
      const seg = Math.floor(elapsed / per) % (walk.length - 1);
      const local = elapsed % per;
      const from = P(walk[seg]);
      const to = P(walk[seg + 1]);
      const litIdx = walk[seg + 1];
      const hue = nodes[litIdx].hue;
      let tx = to.x;
      let ty = to.y;
      if (local < HOP) {
        const t = ease(local / HOP);
        tx = from.x + (to.x - from.x) * t;
        ty = from.y + (to.y - from.y) * t;
      }
      frame(local < HOP ? -1 : litIdx, { x: tx, y: ty, hue });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}

export default function Hero({ hero, slug }: { hero: Hero; slug: string }) {
  const h = hero;
  const writeup = `https://pablomanjarres.com/portfolio/projects/${slug}`;

  return (
    <main className={styles.root} style={{ ["--bg-art" as string]: `url('/oss/${slug}.png')` }}>
      {/* atmosphere — all decorative */}
      <div className={styles.bgArt} aria-hidden="true" />
      <div className={styles.paper} aria-hidden="true" />
      <div className={styles.marginRule} aria-hidden="true" />
      <div className={styles.fieldWrap} aria-hidden="true">
        <AutomatonField className={styles.field} />
      </div>
      <div className={styles.vignette} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      {/* editorial frame label */}
      <div className={`${styles.frame} ${styles.fade}`} style={ms(T.frame)} aria-hidden="true">
        <span className={styles.frameLabel}>STUDY HUB · SEM. 2026-1 · OFFLINE</span>
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
        </div>

        <div className={`${styles.chips} ${styles.reveal}`} style={ms(T.chips)}>
          {SUBJECTS.map((s) => (
            <span key={s.label} className={styles.chip} style={{ ["--chip" as string]: s.accent }}>
              <span className={styles.chipDot} aria-hidden="true" />
              {s.label}
            </span>
          ))}
        </div>

        <h1 className={styles.title} aria-label={`${h.titleLead} ${h.titleMain}`}>
          <span className={`${styles.titleLead} ${styles.fade}`} style={ms(T.lead)}>
            {h.titleLead}
          </span>
          <span className={styles.titleMainWrap}>
            <span className={`${styles.titleMain} ${styles.fade}`} style={ms(T.main)}>
              {h.titleMain}
            </span>
            {/* hand-drawn highlighter underline */}
            <svg
              className={`${styles.underline} ${styles.underlineReveal}`}
              style={ms(T.underline)}
              viewBox="0 0 320 18"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path
                className={styles.underlinePath}
                d="M4 11 C 60 4, 120 15, 180 8 S 300 5, 316 10"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="4"
                strokeLinecap="round"
              />
            </svg>
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
          <Cta href={h.repo} label="Star on GitHub" icon="★" external primary delay={T.cta1} />
          {h.live && <Cta href={h.live} label="Live demo" icon="↗" external delay={T.cta2} />}
          <Cta href={writeup} label="Write-up" icon="›" delay={h.live ? T.cta3 : T.cta2} />
        </div>

        {/* Caveat marginalia — decorative "study notes" scribbled into the gutter */}
        <span className={`${styles.margNote} ${styles.reveal}`} style={ms(T.marg)} aria-hidden="true">
          <svg className={styles.margArrow} viewBox="0 0 60 40" fill="none">
            <path
              d="M58 4 C 30 6, 8 16, 4 36"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M4 36 L 12 30 M4 36 L 12 38"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          step through every machine, one symbol at a time
        </span>
      </section>

      <footer className={`${styles.footer} ${styles.reveal}`} style={ms(T.foot)}>
        <span className={styles.license}>
          <span className={styles.mark} aria-hidden="true" />
          {h.oss ? "MIT LICENSED" : "SOURCE AVAILABLE"}
        </span>
        <span className={styles.hudRight} aria-hidden="true">
          study-hub // 3 subjects · 16-tool MCP · key-free
        </span>
        <span>© 2026 Pablo Manjarres</span>
      </footer>
    </main>
  );
}
