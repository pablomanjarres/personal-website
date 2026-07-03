"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { Hero } from "../../heroes";
import s from "./archgraph.module.css";

/* ==========================================================================
   Archgraph — bespoke "self-drawing blueprint" hero.
   The centrepiece is an inline isometric C4 diagram that inks itself
   line-by-line on load (pure CSS keyframes on stroke-dashoffset — no rAF).
   ========================================================================== */

/* ---- Isometric projection (deterministic; safe for SSR) ---------------- */
const TW = 30; // tile half-width  (x/y screen spread)
const TH = 17; // tile half-height (isometric ~30deg)
const ZH = 30; // height unit (screen px per z)
const OX = 250;
const OY = 152;

function iso(x: number, y: number, z: number): [number, number] {
  return [OX + (x - y) * TW, OY + (x + y) * TH - z * ZH];
}
const fmt = (x: number, y: number, z: number) => {
  const [sx, sy] = iso(x, y, z);
  return `${sx.toFixed(1)},${sy.toFixed(1)}`;
};

type NodeDef = {
  id: string;
  tag: string;
  name: string;
  fx: number;
  fy: number;
  fw: number;
  fd: number;
  h: number;
};

// C4 model of Archgraph itself: developer runs the /graph skill, which writes a
// model.json, ELK lays it out, the React canvas renders it (and the dev views it).
const NODES: NodeDef[] = [
  { id: "A1", tag: "ACTOR", name: "Developer", fx: -2.7, fy: 1.35, fw: 1.35, fd: 1.35, h: 1.35 },
  { id: "C1", tag: "SKILL", name: "/graph", fx: 0.0, fy: 0.0, fw: 2.0, fd: 1.7, h: 1.0 },
  { id: "D1", tag: "STORE", name: "model.json", fx: 0.0, fy: 3.0, fw: 2.0, fd: 1.7, h: 0.85 },
  { id: "C2", tag: "LAYOUT", name: "ELK", fx: 3.25, fy: 0.0, fw: 2.0, fd: 1.7, h: 1.0 },
  { id: "C3", tag: "VIEWER", name: "React canvas", fx: 3.25, fy: 3.0, fw: 2.25, fd: 1.85, h: 1.15 },
];

type EdgeDef = { from: string; to: string; bend: "x" | "y"; d: number };
const EDGES: EdgeDef[] = [
  { from: "A1", to: "C1", bend: "x", d: 1080 },
  { from: "C1", to: "D1", bend: "y", d: 1320 },
  { from: "D1", to: "C2", bend: "x", d: 1560 },
  { from: "C2", to: "C3", bend: "y", d: 1800 },
  { from: "A1", to: "C3", bend: "y", d: 1900 },
];

const byId = (id: string) => NODES.find((n) => n.id === id)!;
const center = (n: NodeDef) => [n.fx + n.fw / 2, n.fy + n.fd / 2] as const;

function faces(n: NodeDef) {
  const { fx, fy, fw, fd, h } = n;
  return {
    top: `M${fmt(fx, fy, h)} L${fmt(fx + fw, fy, h)} L${fmt(fx + fw, fy + fd, h)} L${fmt(fx, fy + fd, h)} Z`,
    right: `M${fmt(fx + fw, fy, h)} L${fmt(fx + fw, fy, 0)} L${fmt(fx + fw, fy + fd, 0)} L${fmt(fx + fw, fy + fd, h)} Z`,
    left: `M${fmt(fx, fy + fd, h)} L${fmt(fx, fy + fd, 0)} L${fmt(fx + fw, fy + fd, 0)} L${fmt(fx + fw, fy + fd, h)} Z`,
  };
}

function edgePath(e: EdgeDef) {
  const a = byId(e.from);
  const b = byId(e.to);
  const [acx, acy] = center(a);
  const [bcx, bcy] = center(b);
  const z = 0.06;
  const corner = e.bend === "x" ? [bcx, acy] : [acx, bcy];
  return `M${fmt(acx, acy, z)} L${fmt(corner[0], corner[1], z)} L${fmt(bcx, bcy, z)}`;
}

// faint isometric ground grid (a few rules each way) for depth
const FLOOR = { x0: -3.4, x1: 6.0, y0: -1.0, y1: 5.0, step: 1.9 };
function floorLines() {
  const lines: string[] = [];
  for (let x = FLOOR.x0; x <= FLOOR.x1 + 0.001; x += FLOOR.step) {
    lines.push(`M${fmt(x, FLOOR.y0, 0)} L${fmt(x, FLOOR.y1, 0)}`);
  }
  for (let y = FLOOR.y0; y <= FLOOR.y1 + 0.001; y += FLOOR.step) {
    lines.push(`M${fmt(FLOOR.x0, y, 0)} L${fmt(FLOOR.x1, y, 0)}`);
  }
  return lines;
}

const boundaryPath = `M${fmt(-1.1, -1.0, 0)} L${fmt(6.0, -1.0, 0)} L${fmt(6.0, 5.0, 0)} L${fmt(-1.1, 5.0, 0)} Z`;

const cssv = (d: number): CSSProperties => ({ ["--d" as string]: `${d}ms` });

function C4Diagram() {
  const grid = floorLines();
  return (
    <svg
      className={s.diagram}
      viewBox="34 34 442 372"
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label="An isometric C4 architecture diagram drawing itself: a developer runs the /graph skill, which writes model.json, ELK lays it out, and a React canvas renders it."
    >
      {/* ground grid */}
      {grid.map((dpath, i) => (
        <path key={`g${i}`} className={s.floorLine} d={dpath} pathLength={1} style={cssv(240 + i * 46)} />
      ))}

      {/* system boundary */}
      <path className={s.boundary} d={boundaryPath} pathLength={1} style={cssv(520)} />

      {/* edges (drawn under the boxes so wiring tucks beneath the cards) */}
      {EDGES.map((e, i) => (
        <path key={`e${i}`} className={s.edge} d={edgePath(e)} pathLength={1} style={cssv(e.d)} />
      ))}

      {/* boxes — back-to-front paint order matches NODES order */}
      {NODES.map((n, i) => {
        const f = faces(n);
        const base = 700 + i * 235;
        const [cx, cy] = center(n);
        const [lx, ly] = iso(cx, cy, n.h);
        return (
          <g key={n.id}>
            <path className={`${s.face} ${s.fTop}`} d={f.top} pathLength={1} style={cssv(base)} />
            <path className={`${s.face} ${s.fRight}`} d={f.right} pathLength={1} style={cssv(base + 80)} />
            <path className={`${s.face} ${s.fLeft}`} d={f.left} pathLength={1} style={cssv(base + 150)} />
            <text className={s.nodeLabel} x={lx} y={ly - 25} textAnchor="middle" style={cssv(base + 250)}>
              <tspan className={s.nodeId}>{`${n.id} · ${n.tag}`}</tspan>
              <tspan className={s.nodeName} x={lx} dy={13}>
                {n.name}
              </tspan>
            </text>
            <circle className={s.dotRing} cx={lx} cy={ly} r={7} pathLength={1} style={cssv(base + 350)} />
            <circle className={s.dot} cx={lx} cy={ly} r={3.4} style={cssv(base + 360)} />
          </g>
        );
      })}

      {/* dimension line: CONTEXT -> CONTAINER -> CODE */}
      <g>
        <path className={s.dimLine} d="M120 386 L380 386" pathLength={1} style={cssv(2060)} />
        <path className={s.dimTick} d="M120 381 L120 391" style={cssv(2160)} />
        <path className={s.dimTick} d="M250 383 L250 389" style={cssv(2160)} />
        <path className={s.dimTick} d="M380 381 L380 391" style={cssv(2160)} />
        <text className={s.dimLabel} x={250} y={402} textAnchor="middle" style={cssv(2260)}>
          CONTEXT → CONTAINER → CODE
        </text>
      </g>
    </svg>
  );
}

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

          <h1 className={s.title}>
            <span className={s.lineLead}>
              {leadWords.map((w, i) => (
                <span className={s.mask} key={`l${i}`}>
                  <span className={s.word} style={cssv(360 + wi++ * 88)}>
                    {w}
                  </span>
                </span>
              ))}
            </span>
            <span className={s.lineMain}>
              {mainWords.map((w, i) => (
                <span className={s.mask} key={`m${i}`}>
                  <span className={s.word} style={cssv(360 + wi++ * 88)}>
                    {w}
                  </span>
                </span>
              ))}
            </span>
          </h1>

          <div className={s.titleFoot} style={cssv(760)}>
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

        <div className={s.diagramWrap}>
          <C4Diagram />
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
