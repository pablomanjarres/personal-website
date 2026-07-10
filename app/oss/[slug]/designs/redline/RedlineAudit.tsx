"use client";

import { useEffect, useState, type CSSProperties } from "react";
import styles from "../redline.module.css";

/**
 * Decorative product chrome — the Redline audit panel reviewing a scientist's
 * own figure. A volcano plot whose "significant" points are marked as false
 * discoveries by a red pen sweep, a p-value struck through with its corrected q
 * dropped in beside it (cycling through three real crimes), and the 8-check
 * ledger over a 46/46 · 0% FP benchmark. aria-hidden (illustrative, not
 * content); fully static under prefers-reduced-motion.
 */

type Pt = { x: number; y: number };

// hand-placed so the cloud reads as a volcano: a dense n.s. base, false
// discoveries scattered up the wings (marked), a few genuine hits at the tails.
const NS: Pt[] = [
  { x: 70, y: 96 }, { x: 88, y: 102 }, { x: 104, y: 88 }, { x: 118, y: 104 },
  { x: 128, y: 92 }, { x: 140, y: 100 }, { x: 152, y: 86 }, { x: 166, y: 98 },
  { x: 96, y: 78 }, { x: 112, y: 96 }, { x: 134, y: 84 }, { x: 148, y: 94 },
  { x: 122, y: 108 }, { x: 158, y: 104 }, { x: 80, y: 90 }, { x: 174, y: 92 },
  { x: 190, y: 100 }, { x: 200, y: 86 },
];
const FP: Pt[] = [
  { x: 52, y: 44 }, { x: 64, y: 34 }, { x: 76, y: 48 }, { x: 88, y: 40 },
  { x: 96, y: 52 }, { x: 172, y: 46 }, { x: 186, y: 36 }, { x: 198, y: 50 },
  { x: 208, y: 40 }, { x: 216, y: 52 },
];
const TP: Pt[] = [
  { x: 36, y: 22 }, { x: 48, y: 30 }, { x: 212, y: 28 }, { x: 224, y: 20 },
];

const READOUTS = [
  { crime: "Pseudoreplication", detail: "3 mice, not 12k cells", p: "p = 4e-4", q: "q = 0.41", fix: "pseudobulk · PyDESeq2" },
  { crime: "Double-dipping", detail: "clustered then tested the same cells", p: "p = 1e-6", q: "q = 0.28", fix: "Poisson count-split" },
  { crime: "Multiple testing", detail: "18,241 genes, no correction", p: "p = 0.012", q: "q = 0.19", fix: "Benjamini-Hochberg" },
];

const CHECKS = [
  { name: "Pseudoreplication", fix: "pseudobulk", flag: true },
  { name: "Double-dipping", fix: "count-split", flag: true },
  { name: "Clustering fragility", fix: "Rand sweep", flag: false },
  { name: "Confounding", fix: "rank check", flag: false },
  { name: "Multiple testing", fix: "BH-FDR", flag: false },
  { name: "Unmodeled covariate", fix: "in model", flag: false },
  { name: "Resolution choice", fix: "stability", flag: false },
  { name: "Test assumptions", fix: "checked", flag: false },
];

const cssv = (d: number): CSSProperties => ({ ["--d" as string]: `${d}ms` });

export default function RedlineAudit({ style }: { style?: CSSProperties }) {
  const [ro, setRo] = useState(0); // active readout crime
  const [scan, setScan] = useState(0); // ledger row the reviewer is scanning

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let tick = 0;
    const id = window.setInterval(() => {
      tick++;
      setScan((s) => (s + 1) % CHECKS.length);
      if (tick % 6 === 0) setRo((r) => (r + 1) % READOUTS.length);
    }, 460);
    return () => window.clearInterval(id);
  }, []);

  const r = READOUTS[ro];

  return (
    <div className={styles.audit} style={style} aria-hidden="true">
      <div className={styles.auditInner}>
        <div className={styles.auditBar}>
          <span className={styles.dots}>
            <span className={`${styles.dot} ${styles.dotHot}`} />
            <span className={styles.dot} />
            <span className={styles.dot} />
          </span>
          <span className={styles.auditName}>
            <b>redline</b>&nbsp;· fig_3b.h5ad
          </span>
          <span className={styles.auditStatus}>
            <span className={styles.auditStatusDot} /> reviewing
          </span>
        </div>

        <div className={styles.auditBody}>
          {/* ---- volcano plot ---- */}
          <div className={styles.plotWrap}>
            <div className={styles.plotTop}>
              <span>
                <b>Volcano</b> · DE by cluster
              </span>
              <span className={styles.sigCount}>
                <span className={styles.sigStruck}>214</span>
                <span>→</span>
                <span className={styles.sigNow}>9 real</span>
              </span>
            </div>
            <svg className={styles.plotSvg} viewBox="0 0 240 128" preserveAspectRatio="xMidYMid meet">
              {/* axes + significance threshold */}
              <line className={styles.axis} x1="22" y1="112" x2="234" y2="112" />
              <line className={styles.axis} x1="22" y1="10" x2="22" y2="112" />
              <line className={styles.thresh} x1="22" y1="58" x2="234" y2="58" />
              <text className={styles.axisLabel} x="26" y="20">
                -log10 p
              </text>
              <text className={styles.axisLabel} x="150" y="124">
                log2 fold-change
              </text>

              {/* not-significant cloud */}
              {NS.map((p, i) => (
                <circle key={`ns${i}`} className={`${styles.pt} ${styles.ptNs}`} cx={p.x} cy={p.y} r="2.6" />
              ))}
              {/* genuine hits (survive) */}
              {TP.map((p, i) => (
                <circle key={`tp${i}`} className={`${styles.pt} ${styles.ptTp}`} cx={p.x} cy={p.y} r="3" />
              ))}
              {/* false discoveries — marked with a red ring, drained of colour */}
              {FP.map((p, i) => (
                <g key={`fp${i}`}>
                  <circle className={`${styles.pt} ${styles.ptFp}`} cx={p.x} cy={p.y} r="2.8" />
                  <circle
                    className={styles.ring}
                    cx={p.x}
                    cy={p.y}
                    r="6"
                    pathLength={1}
                    style={cssv(1150 + i * 55)}
                  />
                </g>
              ))}

              {/* the red pen sweep across the false-positive band */}
              <path
                className={styles.sweep}
                d="M30 20 C 92 42, 150 30, 214 52"
                pathLength={1}
              />
            </svg>
          </div>

          {/* ---- p-value strike readout ---- */}
          <div className={styles.readout}>
            <span className={styles.roCrime} />
            <span className={styles.roMeta}>
              <span className={styles.roLabel}>
                <b>{r.crime}</b> · {r.detail}
              </span>
              <span className={styles.roMath}>
                <span className={styles.roP}>
                  {r.p}
                  <span className={styles.roStrike} key={ro} />
                </span>
                <span className={styles.roArrow}>→</span>
                <span className={styles.roQ}>
                  {r.q} <span className={styles.roNs}>n.s.</span>
                </span>
              </span>
            </span>
            <span className={styles.roFix}>{r.fix}</span>
          </div>

          {/* ---- 8-check ledger ---- */}
          <div className={styles.ledger}>
            {CHECKS.map((c, i) => (
              <div
                key={c.name}
                className={`${styles.ledgerRow}${i === scan ? " " + styles.scan : ""}`}
              >
                <span className={`${styles.ledgerTick} ${c.flag ? styles.tickFlag : styles.tickOk}`}>
                  {c.flag ? "!" : "✓"}
                </span>
                <span className={styles.ledgerName}>{c.name}</span>
                <span className={styles.ledgerFix}>{c.fix}</span>
                <span className={`${styles.ledgerState} ${c.flag ? styles.stateFlag : styles.stateOk}`}>
                  {c.flag ? "flagged" : "verified"}
                </span>
              </div>
            ))}
          </div>

          {/* ---- benchmark ---- */}
          <div className={styles.bench}>
            <span className={styles.benchDot} />
            <span className={styles.benchNum}>46 / 46</span>
            <span className={styles.benchLabel}>planted errors caught</span>
            <span className={styles.benchFp}>
              <b>0%</b> FP
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
