"use client";

import { useEffect, useState, type CSSProperties } from "react";
import s from "../lumen.module.css";

/**
 * LumenBoard — the signature set-piece. A faux teaching whiteboard that draws an
 * "area under a curve" calculus lesson onto itself: the axes ink on, a blue
 * curve strokes itself in, the a/b boundary lines drop, a teal area hatches in
 * under the curve, a red horizontal tangent lands on the maximum, and Caveat
 * hand-lettering (max, the integral, f(x), tangent) fades in on cue. A marker
 * nib re-inks the curve on a loop and a "step" header advances like a live
 * lesson. Entirely decorative (aria-hidden). The draw-on choreography lives in
 * the CSS module behind prefers-reduced-motion:no-preference, so a reduced-motion
 * viewer sees the finished, fully-drawn board; the only JS is the step ticker,
 * which never starts under reduced motion.
 */

const CURVE =
  "M 118 250 C 196 250, 232 100, 300 96 C 368 100, 404 250, 486 248";
const AREA =
  "M 170 300 L 170 180 C 224 150, 250 104, 300 100 C 350 104, 376 150, 430 180 L 430 300 Z";

const STEPS = ["axes", "curve", "area"] as const;

export default function LumenBoard({
  style,
  className,
}: {
  style?: CSSProperties;
  className?: string;
}) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(
      () => setStep((v) => (v + 1) % STEPS.length),
      2600
    );
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      className={`${s.board}${className ? " " + className : ""}`}
      style={style}
      aria-hidden="true"
    >
      <div className={s.boardHead}>
        <span className={s.boardName}>
          <b>lumen</b> · whiteboard
        </span>
        <span className={s.boardStatus}>
          <i className={s.liveDot} /> drawing
        </span>
      </div>

      <div className={s.boardSteps}>
        {STEPS.map((label, i) => (
          <span
            key={label}
            className={`${s.stepChip}${i === step ? " " + s.stepOn : ""}`}
          >
            <b>{i + 1}</b> {label}
          </span>
        ))}
        <span className={s.tray}>
          <i className={`${s.nib} ${s.nibNavy}`} />
          <i className={`${s.nib} ${s.nibBlue}`} />
          <i className={`${s.nib} ${s.nibTeal}`} />
          <i className={`${s.nib} ${s.nibRed}`} />
        </span>
      </div>

      <div className={s.boardBody}>
        <svg className={s.scene} viewBox="0 0 560 380" aria-hidden="true">
          <defs>
            <pattern
              id="lumenHatch"
              width="9"
              height="9"
              patternTransform="rotate(45)"
              patternUnits="userSpaceOnUse"
            >
              <line className={s.hatchLine} x1="0" y1="0" x2="0" y2="9" />
            </pattern>
          </defs>

          {/* axes + arrowheads + labels */}
          <path className={`${s.axis} ${s.axisX}`} d="M 60 300 L 512 300" pathLength={1} />
          <path className={`${s.axis} ${s.axisY}`} d="M 84 324 L 84 56" pathLength={1} />
          <path className={s.axisArrow} d="M 504 294 L 515 300 L 504 306" />
          <path className={s.axisArrow} d="M 78 66 L 84 54 L 90 66" />
          <text className={s.axisLabel} x="66" y="319">O</text>
          <text className={s.axisLabel} x="505" y="321">x</text>
          <text className={s.axisLabel} x="68" y="62">y</text>

          {/* area under the curve (hatched + soft wash), wiped in left-to-right */}
          <g className={s.areaGroup}>
            <path className={s.areaWash} d={AREA} />
            <path className={s.areaHatch} d={AREA} />
          </g>

          {/* a / b boundary lines + labels */}
          <path className={`${s.bound} ${s.boundA}`} d="M 170 300 L 170 180" pathLength={1} />
          <path className={`${s.bound} ${s.boundB}`} d="M 430 300 L 430 180" pathLength={1} />
          <text className={s.aLabel} x="165" y="319">a</text>
          <text className={s.aLabel} x="425" y="319">b</text>

          {/* the curve strokes itself on */}
          <path className={s.curve} d={CURVE} pathLength={1} />

          {/* horizontal tangent at the maximum + the critical point */}
          <path className={s.tangent} d="M 232 96 L 368 96" pathLength={1} />
          <circle className={s.dotRing} cx="300" cy="96" r="9.5" />
          <circle className={s.dot} cx="300" cy="96" r="4.6" />

          {/* marker nib that rides the curve as it inks */}
          <circle className={s.nibDot} cx="0" cy="0" r="5" />

          {/* hand-lettered annotations (Caveat) */}
          <text className={`${s.anno} ${s.a1}`} x="300" y="66" textAnchor="middle">
            max · f&apos;(x) = 0
          </text>
          <text className={`${s.anno} ${s.a2}`} x="300" y="252" textAnchor="middle">
            ∫ₐᵇ f(x) dx ≈ 4.2
          </text>
          <text className={`${s.anno} ${s.a3}`} x="470" y="214">
            f(x)
          </text>
          <text className={`${s.anno} ${s.a4}`} x="196" y="82">
            tangent
          </text>
        </svg>
      </div>

      <div className={s.boardFoot}>
        <span className={s.footTag}>lesson · area under a curve</span>
        <span className={s.footOps}>d/dx · ∫ · lim</span>
      </div>
    </div>
  );
}
