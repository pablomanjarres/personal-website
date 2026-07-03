"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import styles from "../omegahack.module.css";
import { useScramble } from "./useScramble";

/* ---- the case file, as a live artefact ------------------------------------
   A legal SLA (Ley 1755/2015) countdown for a citizen PQRSD petition. The ring
   is a hollow conic-gradient depleting amber -> seal-red; the center digits
   tick in IBM Plex Mono tabular-nums; the radicado (case id) decrypts into
   place behind a redaction bar that wipes away on load.
   Deterministic initial values keep server and first client render identical
   (no hydration drift); the live clock + decrypt only run post-mount, motion
   permitting. Under reduced motion everything sits at its finished state.     */

const TOTAL_MS = 72 * 3600 * 1000; // full legal window
const START_MS = (27 * 3600 + 18 * 60 + 44) * 1000; // 27:18:44 remaining
const RADICADO = "2026-0042";

const pad = (n: number) => String(n).padStart(2, "0");
function fmt(ms: number) {
  const s = Math.max(0, Math.floor(ms / 1000));
  return `${pad(Math.floor(s / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
}

export default function CaseDossier({ system }: { system: string }) {
  const [remain, setRemain] = useState(START_MS);
  const radRef = useRef<HTMLSpanElement>(null);
  const scramble = useScramble();

  const arc = `${((START_MS / TOTAL_MS) * 360).toFixed(2)}deg`;
  const urgent = remain / TOTAL_MS < 0.12;

  // 60 tick marks; majors every 5, the 12-o'clock marker in seal-red.
  const ticks = useMemo(
    () =>
      Array.from({ length: 60 }, (_, i) => {
        const major = i % 5 === 0;
        const a = ((i * 6 - 90) * Math.PI) / 180;
        const r2 = major ? 41.5 : 45;
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        return (
          <line
            key={i}
            x1={50 + 48 * cos}
            y1={50 + 48 * sin}
            x2={50 + r2 * cos}
            y2={50 + r2 * sin}
            stroke={i === 0 ? "var(--seal)" : "var(--ink)"}
            strokeOpacity={i === 0 ? 0.95 : major ? 0.34 : 0.15}
            strokeWidth={major ? 0.9 : 0.5}
            strokeLinecap="round"
          />
        );
      }),
    []
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = Date.now() + START_MS;
    const id = window.setInterval(
      () => setRemain(Math.max(0, target - Date.now())),
      1000
    );
    // decrypt the radicado as the redaction bar retracts
    const t = window.setTimeout(() => {
      if (radRef.current) scramble(radRef.current, RADICADO, 950);
    }, 1350);
    return () => {
      window.clearInterval(id);
      window.clearTimeout(t);
    };
  }, [scramble]);

  const ringVars = { ["--arc"]: arc, ["--omegahack-arc"]: arc } as CSSProperties;

  return (
    <div className={styles.dossier}>
      <div className={styles.deskShadow} aria-hidden="true" />

      {/* documents underneath, dealt onto the desk */}
      <div
        className={styles.cardBack2}
        style={{ ["--d"]: "0.5s" } as CSSProperties}
        aria-hidden="true"
      >
        <span className={styles.backMeta}>RADICADO 2026-0039 · DENUNCIA</span>
      </div>
      <div
        className={styles.cardBack}
        style={{ ["--d"]: "0.6s" } as CSSProperties}
        aria-hidden="true"
      >
        <span className={styles.backMeta}>RADICADO 2026-0041 · PETICIÓN</span>
      </div>

      {/* the active case cover */}
      <article
        className={styles.caseCard}
        style={{ ["--d"]: "0.72s" } as CSSProperties}
      >
        <div className={styles.waxSeal} aria-hidden="true">
          <span className={styles.waxText}>
            MPIO
            <br />
            2026
          </span>
        </div>

        <header className={styles.caseHead}>
          <span className={styles.caseWord}>{system}</span>
          <span className={styles.caseExp}>Expediente</span>
          <span className={styles.caseTag}>Activo</span>
        </header>

        <div className={styles.radRow}>
          <span className={styles.radLabel}>Radicado No.</span>
          <span
            className={styles.radValueWrap}
            aria-label={`Radicado número ${RADICADO}`}
          >
            <span className={styles.radValue} ref={radRef} aria-hidden="true">
              {RADICADO}
            </span>
            <span className={styles.redactBar} aria-hidden="true" />
          </span>
        </div>

        <div className={styles.subjectRow}>
          <span className={styles.typeChip}>Queja</span>
          <span className={styles.subjectLine}>Alumbrado público intermitente</span>
        </div>

        <div className={styles.ringWrap} data-urgent={urgent}>
          <div className={styles.ring} style={ringVars} />
          <div className={styles.ringGlow} aria-hidden="true" />
          <svg
            className={styles.ringTicks}
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            {ticks}
          </svg>
          <div className={styles.ringCenter}>
            <span className={styles.ringLabel}>Tiempo restante</span>
            <span className={styles.ringTime} aria-hidden="true">
              {fmt(remain)}
            </span>
            <span className={styles.ringSub}>SLA · Ley 1755/2015</span>
          </div>
          <span className={styles.srOnly}>
            Plazo legal restante para responder la petición: aproximadamente 27
            horas.
          </span>
        </div>

        <footer className={styles.caseFoot}>
          <span>Sec. Infraestructura</span>
          <span className={styles.caseFootDot} aria-hidden="true">
            ●
          </span>
          <span>Medellín · CO</span>
        </footer>
      </article>
    </div>
  );
}
