"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import Link from "next/link";
import { profile, type Social } from "./socials";
import { BG, FG, ACCENT, MUTED, tokens } from "./theme";

// palette + font tokens now live in ./theme (shared with the portfolio pages)

type BadgeColor = { fill: string; stroke: string };
const BADGE_COLORS: BadgeColor[] = [
  { fill: BG, stroke: ACCENT }, // x (black)
  { fill: MUTED, stroke: BG }, // linkedin (white)
  { fill: FG, stroke: BG }, // reddit (orange)
  { fill: BG, stroke: FG }, // github (black cat)
];

// ---- responsive starting positions ----------------------------------------
// fractions of viewport for the badge's top-left corner: [fx, fy, rotation]
const DESK: [number, number, number][] = [
  [0.56, 0.4, -3],
  [0.78, 0.44, 10],
  [0.585, 0.66, -12],
  [0.8, 0.68, 5],
];
// mobile: a loosely-placed "sticker sheet" of fractions WITHIN the pinboard's
// own box (not the viewport) - two rows, gently staggered, never over the copy.
const MOB: [number, number, number][] = [
  [0.65, 0.07, -5],
  [0.12, 0.52, 8],
  [0.38, 0.57, -9],
  [0.65, 0.5, 4],
];

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

function badgeSize(w: number, h: number) {
  return Math.round(clamp(Math.min(w * 0.13, h * 0.21), 104, 170));
}

function mobileBadgeSize(w: number) {
  // a touch smaller than w/4 so a rotated pin + its drop-shadow clears the
  // screen edges (the die-cut rim/shadow needs ~16px beyond the circle).
  return Math.round(clamp(w * 0.215, 76, 98));
}

// Position a pin within its coordinate space (w x h). On desktop the space is
// the viewport (the fixed pinboard); on mobile it is the in-flow sticker zone.
function computeStart(i: number, mobile: boolean, w: number, h: number, size: number) {
  const table = mobile ? MOB : DESK;
  const [fx, fy, r] = table[i] ?? [0.5, 0.5, 0];
  if (mobile) {
    const pad = 12;
    return {
      x: clamp(fx * w, pad, Math.max(pad, w - size - pad)),
      y: clamp(fy * h, pad, Math.max(pad, h - size - pad)),
      r,
    };
  }
  const x = clamp(fx * w, w * 0.46, w - size - 12);
  const y = clamp(fy * h, 96, h - size - 14);
  return { x, y, r };
}

// ---- live clock with a blinking (ticking) colon ----------------------------
function Clock() {
  const [t, setT] = useState<Date | null>(null);
  useEffect(() => {
    setT(new Date());
    const id = setInterval(() => setT(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!t) return <span>--:-- --</span>;
  let h = t.getHours();
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  const hh = String(h).padStart(2, "0");
  const mm = String(t.getMinutes()).padStart(2, "0");
  return (
    <span>
      {hh}
      <span className="tick">:</span>
      {mm} {ampm}
    </span>
  );
}

// ---- per-letter split primitive -------------------------------------------
// Renders text as position-indexed inline-block glyphs so CSS calc() can
// stagger them. The wrapper is aria-hidden; the accessible label is supplied
// by the parent (aria-label on the nav link, or a visually-hidden sibling).
function charStyle(i: number, scatter: boolean): CSSProperties {
  if (!scatter) return { ["--i" as string]: String(i) };
  // deterministic pseudo-random scatter (same on server + client -> no
  // hydration mismatch) for the hero "explode" reassembly.
  return {
    ["--i" as string]: String(i),
    ["--tx" as string]: `${(Math.sin(i * 12.9898) * 40).toFixed(1)}px`,
    ["--ty" as string]: `${(-16 - Math.abs(Math.cos(i * 3.7)) * 34).toFixed(1)}px`,
    ["--rot" as string]: `${(Math.sin(i * 5.3) * 36).toFixed(1)}deg`,
  };
}

function SplitChars({ text, scatter = false }: { text: string; scatter?: boolean }) {
  return (
    <span className="at-split" aria-hidden>
      {[...text].map((ch, i) => (
        <span key={i} className="at-char" style={charStyle(i, scatter)}>
          {ch}
        </span>
      ))}
    </span>
  );
}

// ---- brand mark: PABLO decrypts on hover, the ✦ spins (reform / scramble) --
// Hand-rolled requestAnimationFrame char-cycling (soulwire technique) — zero
// deps. Honors prefers-reduced-motion and fires on focus for keyboard users.
const SCRAMBLE = "!<>-_\\/[]{}=+*#?◇✶✦·";
function BrandMark() {
  const word = useRef<HTMLSpanElement>(null);
  const raf = useRef(0);
  const run = useCallback(() => {
    const el = word.current;
    if (!el) return;
    const text = "PABLO";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = text;
      return;
    }
    const t0 = performance.now();
    const dur = 620;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const lock = Math.floor(p * text.length);
      el.textContent = [...text]
        .map((c, i) => (i < lock ? c : SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0]))
        .join("");
      if (p < 1) raf.current = requestAnimationFrame(step);
      else el.textContent = text;
    };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(step);
  }, []);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return (
    <Link
      href="/"
      className="topnav-brand"
      aria-label="Pablo, home"
      onMouseEnter={run}
      onFocus={run}
    >
      <span aria-hidden className="brand-star">
        ✦
      </span>{" "}
      <span aria-hidden className="brand-word" ref={word}>
        PABLO
      </span>
    </Link>
  );
}

// ---- one circular die-cut badge (performant: refs + direct DOM) ------------
type BadgeState = {
  x: number;
  y: number;
  r: number;
  spin: number;
  dragging: boolean;
  moved: boolean;
  // magnetic hover (pointer-follow lean + lift, eased in the idle loop)
  mx: number;
  my: number;
  tmx: number;
  tmy: number;
  sc: number;
  eng: boolean;
};
type DragRef = {
  sx: number;
  sy: number;
  bx: number;
  by: number;
  br: number;
  lx: number;
  lt: number;
  vx: number;
  far: boolean;
} | null;

function Badge({
  index,
  social,
  color,
  size,
  mobile,
  spaceW,
  spaceH,
}: {
  index: number;
  social: Social;
  color: BadgeColor;
  size: number;
  mobile: boolean;
  spaceW: number;
  spaceH: number;
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const st = useRef<BadgeState>({
    x: 0, y: 0, r: 0, spin: 0, dragging: false, moved: false,
    mx: 0, my: 0, tmx: 0, tmy: 0, sc: 1, eng: false,
  });
  const drag = useRef<DragRef>(null);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const apply = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    const s = st.current;
    el.style.transform =
      `translate3d(${s.x + s.mx}px, ${s.y + s.my}px, 0) rotate(${s.r}deg) scale(${s.sc})`;
  }, []);

  // place on mount + reposition on viewport change (unless user moved it)
  useLayoutEffect(() => {
    if (st.current.moved) return;
    const { x, y, r } = computeStart(index, mobile, spaceW, spaceH, size);
    st.current.x = x;
    st.current.y = y;
    if (!st.current.dragging) st.current.r = r;
    apply();
    if (ref.current) ref.current.style.opacity = "1";
  }, [index, mobile, spaceW, spaceH, size, apply]);

  // idle drift + spin decay - direct DOM, no React renders
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const s = st.current;
      if (!s.dragging) {
        s.r += (0.08 + index * 0.02) + s.spin;
        s.spin *= 0.94;
        if (Math.abs(s.spin) < 0.02) s.spin = 0;
        // ease the magnetic lean + lift toward their targets
        s.mx += (s.tmx - s.mx) * 0.16;
        s.my += (s.tmy - s.my) * 0.16;
        s.sc += ((s.eng ? 1.06 : 1) - s.sc) * 0.16;
        apply();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [index, apply]);

  const onMove = useCallback(
    (e: PointerEvent) => {
      const d = drag.current;
      if (!d) return;
      const s = st.current;
      const dx = e.clientX - d.sx;
      const dy = e.clientY - d.sy;
      if (!d.far && Math.hypot(dx, dy) > 4) d.far = true;
      s.x = d.bx + dx;
      s.y = d.by + dy;
      s.r = d.br + dx * 0.15;
      const now = performance.now();
      const dt = Math.max(8, now - d.lt);
      d.vx = (e.clientX - d.lx) / dt;
      d.lx = e.clientX;
      d.lt = now;
      apply();
    },
    [apply],
  );

  const onUp = useCallback(() => {
    window.removeEventListener("pointermove", onMove);
    window.removeEventListener("pointerup", onUp);
    const d = drag.current;
    const s = st.current;
    if (d) s.spin = clamp(d.vx * 6, -22, 22);
    s.dragging = false;
    drag.current = null;
    ref.current?.classList.remove("grabbing");
  }, [onMove]);

  const onDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault();
      const s = st.current;
      s.dragging = true;
      s.moved = true;
      s.spin = 0;
      // drop any magnetic offset so the grab starts from the true position
      s.mx = 0;
      s.my = 0;
      s.tmx = 0;
      s.tmy = 0;
      s.eng = false;
      s.sc = 1;
      drag.current = {
        sx: e.clientX,
        sy: e.clientY,
        bx: s.x,
        by: s.y,
        br: s.r,
        lx: e.clientX,
        lt: performance.now(),
        vx: 0,
        far: false,
      };
      ref.current?.classList.add("grabbing");
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    },
    [onMove, onUp],
  );

  // magnetic lean: while hovering (not dragging), pull the pin toward the
  // cursor and lift it slightly — the idle loop eases + snaps it back.
  const onHover = useCallback((e: React.PointerEvent) => {
    const s = st.current;
    if (s.dragging || reduce.current) return;
    const el = ref.current;
    if (!el) return;
    const b = el.getBoundingClientRect();
    const cx = b.left + b.width / 2;
    const cy = b.top + b.height / 2;
    s.tmx = clamp((e.clientX - cx) * 0.3, -22, 22);
    s.tmy = clamp((e.clientY - cy) * 0.3, -22, 22);
    s.eng = true;
  }, []);

  const onHoverLeave = useCallback(() => {
    const s = st.current;
    s.tmx = 0;
    s.tmy = 0;
    s.eng = false;
  }, []);

  useEffect(() => {
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [onMove, onUp]);

  const pathId = `rim-${social.id}`;
  const rim = `PABLO MANJARRES · ${social.label.toUpperCase()} · ${social.handle.toUpperCase()} · `;

  return (
    <a
      ref={ref}
      className="badge"
      href={social.url}
      target="_blank"
      rel="noreferrer"
      aria-label={`${social.label}, ${social.handle}`}
      draggable={false}
      onPointerDown={onDown}
      onPointerMove={onHover}
      onPointerLeave={onHoverLeave}
      onClick={(e) => {
        if (drag.current?.far) e.preventDefault();
      }}
      style={{ width: size, height: size, opacity: 0, transition: "opacity .25s ease, filter .2s ease" }}
    >
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <defs>
          <path id={pathId} d="M 50,50 m 0,-40 a 40,40 0 1,1 -0.01,0" fill="none" />
        </defs>

        {/* scalloped die-cut rim */}
        {Array.from({ length: 36 }).map((_, i) => {
          const a = (i / 36) * Math.PI * 2;
          return (
            <circle
              key={i}
              cx={50 + Math.cos(a) * 48}
              cy={50 + Math.sin(a) * 48}
              r="2.6"
              fill={color.fill}
            />
          );
        })}

        <circle cx="50" cy="50" r="46" fill={color.fill} stroke={color.stroke} strokeWidth="0.8" />
        <circle
          cx="50"
          cy="50"
          r="30"
          fill="none"
          stroke={color.stroke}
          strokeWidth="0.5"
          strokeDasharray="0.6 1.4"
          opacity="0.55"
        />

        <text
          fontFamily="var(--ff-mono)"
          fontSize="4.5"
          fill={color.stroke}
          letterSpacing="0.5"
          style={{ textTransform: "uppercase" }}
        >
          <textPath href={`#${pathId}`} startOffset="0">
            {rim + rim}
          </textPath>
        </text>

        <text
          x="50"
          y="30"
          textAnchor="middle"
          fontFamily="var(--ff-mono)"
          fontSize="5"
          fill={color.stroke}
          opacity="0.7"
          letterSpacing="0.4"
        >
          № {social.num}
        </text>

        {/* brand icon replaces the center letter */}
        <image href={social.icon} x="35" y="37" width="30" height="30" preserveAspectRatio="xMidYMid meet" />

        <text
          x="50"
          y="74"
          textAnchor="middle"
          fontFamily="var(--ff-mono)"
          fontSize="3.6"
          fill={color.stroke}
          letterSpacing="0.7"
          style={{ textTransform: "uppercase" }}
        >
          {social.label}
        </text>
      </svg>
    </a>
  );
}

// ---- the page --------------------------------------------------------------
export default function Atelier() {
  const [vp, setVp] = useState({ w: 1280, h: 800 });
  // The pinboard's own box. Pins are placed within it: on desktop it is the
  // fixed full-viewport layer; on mobile it is the in-flow sticker zone.
  const [board, setBoard] = useState({ w: 1280, h: 800 });
  const boardRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let raf = 0;
    const measure = () => {
      setVp({ w: window.innerWidth, h: window.innerHeight });
      const el = boardRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        setBoard({ w: r.width, h: r.height });
      }
    };
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const mobile = vp.w < 860;
  const size = mobile ? mobileBadgeSize(vp.w) : badgeSize(vp.w, vp.h);

  return (
    <main className="atelier" style={tokens}>
      <div className="paper" />
      <div className="corner-fold" />

      {/* paperclip flourish (positioned in CSS so it can hide on mobile) */}
      <svg aria-hidden className="paperclip" viewBox="0 0 56 110">
        <path
          d="M 16 8 Q 8 8 8 22 L 8 78 Q 8 96 28 96 Q 48 96 48 78 L 48 30 Q 48 18 36 18 Q 24 18 24 30 L 24 70"
          stroke="var(--fg)"
          strokeOpacity="0.5"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      <div className="peel">※ pg. D · peel a pin, drop it anywhere</div>

      <div className="wrap">
        <nav className="topnav">
          <BrandMark />
          <div className="topnav-links">
            <Link
              href="/portfolio"
              className="topnav-link topnav-link--portfolio"
              aria-label="portfolio"
            >
              <SplitChars text="portfolio" />
            </Link>
            <Link href="/oss" className="topnav-link topnav-link--oss">
              open source
            </Link>
            <a
              className="topnav-link topnav-link--call"
              href={profile.booking}
              target="_blank"
              rel="noreferrer"
            >
              book a call
            </a>
          </div>
        </nav>

        <header className="meta">
          <span className="who">Notebook № 8 · Atelier · pablomanjarres</span>
          <span className="mid">
            {profile.location} · <Clock />
          </span>
          <span className="status">
            <span className="pulse">●</span> in studio
          </span>
        </header>

        <section className="hero">
          <div className="intro">
            <div className="kicker">¶ 01 · Who</div>
            <h1 className="headline">
              17 y/o,
              <br />
              solo
              <br />
              <span className="accent at-explode">
                <span className="at-sr">founder</span>
                <SplitChars text="founder" scatter />
              </span>
              <br />
              &amp; content
              <br />
              creator.
            </h1>

            <p className="lede">
              Building <span className="brand">@{profile.building}</span>, the team you&apos;d hire
              if you had the budget, built from AI agents you run like a CEO. The pins come off the
              page. Drag one anywhere.
            </p>

            <a className="noelle-cta" href="https://trynoelle.com" target="_blank" rel="noreferrer">
              <span className="star" aria-hidden>
                ✶
              </span>
              Visit Noelle
              <span className="sep" aria-hidden>
                ·
              </span>
              trynoelle.com
              <span className="arr" aria-hidden>
                ↗
              </span>
            </a>

            <div className="email-row">
              <a className="email-pill" href={`mailto:${profile.email}`}>
                <svg className="email-circle" viewBox="0 0 100 34" preserveAspectRatio="none" aria-hidden>
                  <path
                    d="M 11 7 C 38 3, 63 3, 89 6 C 97 7, 99 13, 96 18 C 93 27, 64 31, 39 30 C 16 29, 2 26, 5 16 C 6.5 10, 9 7.5, 15 6"
                    stroke="var(--accent)"
                    strokeWidth="1.2"
                    fill="none"
                    opacity="0.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    vectorEffect="non-scaling-stroke"
                    pathLength={1}
                  />
                </svg>
                <span
                  style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--accent)" }}
                />
                {profile.email}
                <span style={{ color: "var(--muted)" }}>↗</span>
              </a>
              <span className="email-note">
                <span className="arr-desk" aria-hidden>←</span>
                <span className="arr-mob" aria-hidden>↑</span> write me ✶
              </span>
            </div>
          </div>

          <div className="findme">¶ 02 · Find me · 6 pins · throw to spin</div>
        </section>
      </div>

      <div className="pageno">pg. 015 / D</div>

      {/* draggable pins layer */}
      <div className="pinboard" ref={boardRef}>
        {profile.socials.map((s, i) => (
          <Badge
            key={s.id}
            index={i}
            social={s}
            color={BADGE_COLORS[i] ?? BADGE_COLORS[0]}
            size={size}
            mobile={mobile}
            spaceW={board.w}
            spaceH={board.h}
          />
        ))}
      </div>
    </main>
  );
}
