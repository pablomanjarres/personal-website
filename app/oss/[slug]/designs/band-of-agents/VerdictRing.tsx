import type { CSSProperties } from "react";
import styles from "../band-of-agents.module.css";

/* ---------------------------------------------------------------------------
   THE VERDICT RING — one inline-SVG war-room console, zero dependencies.

   17 agent pucks sit evenly on a ring, each labelled with its mandate in Martian
   Mono and glowing its vote colour (concur green / dissent red). Argument edges
   are chords whose lit "signal packet" (a short stroke-dasharray on pathLength=1)
   travels node-to-node — two agents arguing — staggered per edge. The whole
   constellation drifts slowly; labels counter-rotate to stay upright. The centre
   holds the live verdict matrix: a stamped seal reading VERDICT / 11–6 /
   PUBLISHED that lands green on resolve. All motion is CSS (see the module) and
   fully gated behind prefers-reduced-motion. Positions are deterministic so the
   server and client render identically (no hydration drift).
   --------------------------------------------------------------------------- */

const CX = 250;
const CY = 250;
const R_NODE = 190; // radius of the agent pucks
const R_LABEL = 218; // radius of the mandate labels

type Agent = { id: string; dissent?: boolean };

// The seventeen competing mandates of the review board (11 concur, 6 dissent).
const AGENTS: Agent[] = [
  { id: "FTC" },
  { id: "ASA" },
  { id: "GDPR" },
  { id: "UWG" },
  { id: "CONAR", dissent: true },
  { id: "JARO" },
  { id: "ASCI", dissent: true },
  { id: "ACCC" },
  { id: "CLAIMS" },
  { id: "PRICE" },
  { id: "HEALTH" },
  { id: "FIN" },
  { id: "MINORS", dissent: true },
  { id: "PRIVACY", dissent: true },
  { id: "IP/TM", dissent: true },
  { id: "A11Y" },
  { id: "ETHICS", dissent: true },
];

type Verdict = "concur" | "dissent" | "argue";

// Argument edges between agents (index pairs) + the state of each exchange.
const CHORDS: { a: number; b: number; v: Verdict }[] = [
  { a: 8, b: 0, v: "concur" },
  { a: 0, b: 3, v: "argue" },
  { a: 3, b: 9, v: "argue" },
  { a: 9, b: 10, v: "concur" },
  { a: 10, b: 12, v: "dissent" },
  { a: 12, b: 4, v: "dissent" },
  { a: 4, b: 6, v: "dissent" },
  { a: 6, b: 13, v: "argue" },
  { a: 13, b: 16, v: "argue" },
  { a: 16, b: 7, v: "argue" },
  { a: 7, b: 1, v: "concur" },
  { a: 1, b: 5, v: "concur" },
  { a: 5, b: 11, v: "concur" },
  { a: 11, b: 14, v: "argue" },
  { a: 14, b: 2, v: "argue" },
  { a: 2, b: 15, v: "concur" },
];

const angleAt = (i: number) => (-90 + (360 / AGENTS.length) * i) * (Math.PI / 180);
const px = (r: number, a: number) => CX + r * Math.cos(a);
const py = (r: number, a: number) => CY + r * Math.sin(a);

const nodes = AGENTS.map((agent, i) => {
  const a = angleAt(i);
  return { ...agent, i, a, x: px(R_NODE, a), y: py(R_NODE, a) };
});

// 60 engraved tick marks around the outer bezel.
const ticks = Array.from({ length: 60 }, (_, i) => {
  const a = (i * 6 - 90) * (Math.PI / 180);
  const major = i % 5 === 0;
  const r1 = 232;
  const r2 = major ? 224 : 228;
  return (
    <line
      key={i}
      x1={px(r1, a)}
      y1={py(r1, a)}
      x2={px(r2, a)}
      y2={py(r2, a)}
      className={major ? styles.tickMajor : styles.tick}
    />
  );
});

export default function VerdictRing() {
  return (
    <svg
      className={styles.ring}
      viewBox="0 0 500 500"
      role="img"
      aria-label="Tribunal ring: seventeen compliance agents argue to a verdict of eleven to six — published."
    >
      {/* ---- drifting constellation (rotates as one) ---- */}
      <g className={styles.ringField}>
        <circle className={styles.bezel} cx={CX} cy={CY} r={228} />
        <circle className={styles.bezelInner} cx={CX} cy={CY} r={R_NODE} />
        <g className={styles.ticks}>{ticks}</g>

        {/* argument edges */}
        <g className={styles.chords}>
          {CHORDS.map((c, k) => {
            const A = nodes[c.a];
            const B = nodes[c.b];
            // control point pulled toward centre so chords bow inward.
            const cx = CX + (((A.x + B.x) / 2 - CX) * 42) / 100;
            const cy = CY + (((A.y + B.y) / 2 - CY) * 42) / 100;
            const d = `M ${A.x} ${A.y} Q ${cx} ${cy} ${B.x} ${B.y}`;
            const cls =
              c.v === "dissent"
                ? styles.pDissent
                : c.v === "concur"
                ? styles.pConcur
                : styles.pArgue;
            return (
              <g key={k} style={{ ["--i"]: k } as CSSProperties}>
                <path className={styles.chordBase} d={d} pathLength={1} />
                <path className={`${styles.packet} ${cls}`} d={d} pathLength={1} />
              </g>
            );
          })}
        </g>

        {/* agent pucks + counter-rotated mandate labels */}
        <g className={styles.nodes}>
          {nodes.map((n) => {
            const lx = px(R_LABEL, n.a);
            const ly = py(R_LABEL, n.a);
            const nodeCls = `${styles.node} ${
              n.dissent ? styles.nodeDissent : styles.nodeConcur
            }`;
            return (
              <g
                key={n.id}
                className={nodeCls}
                style={{ ["--i"]: n.i } as CSSProperties}
              >
                <circle className={styles.puckHalo} cx={n.x} cy={n.y} r={11} />
                <circle className={styles.puck} cx={n.x} cy={n.y} r={6.4} />
                <g
                  className={styles.labelSpin}
                  style={{ ["--lx"]: `${lx}px`, ["--ly"]: `${ly}px` } as CSSProperties}
                >
                  <text
                    className={styles.nodeLabel}
                    x={lx}
                    y={ly}
                    textAnchor="middle"
                    dominantBaseline="central"
                  >
                    {n.id}
                  </text>
                </g>
              </g>
            );
          })}
        </g>
      </g>

      {/* ---- centre verdict matrix (stamped, does not rotate) ---- */}
      <g className={styles.core}>
        <circle className={styles.coreDisc} cx={CX} cy={CY} r={58} />
        <circle className={styles.coreRing} cx={CX} cy={CY} r={64} />
        <text
          className={styles.coreKicker}
          x={CX}
          y={CY - 24}
          textAnchor="middle"
        >
          VERDICT
        </text>
        <text
          className={styles.coreTally}
          x={CX}
          y={CY + 2}
          textAnchor="middle"
          dominantBaseline="central"
        >
          11
          <tspan className={styles.coreDash}>–</tspan>
          <tspan className={styles.coreSix}>6</tspan>
        </text>
        <text
          className={styles.coreVerdict}
          x={CX}
          y={CY + 28}
          textAnchor="middle"
        >
          PUBLISHED
        </text>
      </g>
    </svg>
  );
}
