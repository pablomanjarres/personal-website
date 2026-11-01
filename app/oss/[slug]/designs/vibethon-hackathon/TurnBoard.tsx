"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useReducedMotion } from "@/app/site/useReducedMotion";
import styles from "../vibethon-hackathon.module.css";

/**
 * Decorative set-piece: the gate board from Hedge Parking's office view, running
 * the app's real split rule on a toy lot. Each tick the first car to arrive at
 * EITHER gate takes the next free stall; on a tie, the gate that has received
 * fewer stalls goes first. Reserved stalls settle into occupied, and occupied
 * stalls free up on a fixed cadence so the loop never runs dry.
 * aria-hidden (illustrative). Frozen on the seed under prefers-reduced-motion.
 */

type Gate = "LV" | "RG";
type Car = { plate: string; at: number; gate: Gate };
type Stall = { id: string; state: "libre" | "reservada" | "ocupada"; plate?: string };
type Board = {
  stalls: Stall[];
  queues: Record<Gate, Car[]>;
  given: Record<Gate, number>;
  clock: number;
  last: { plate: string; stall: string; gate: Gate; at: number } | null;
  tick: number;
};

const TICK_MS = 1700;
const LETTERS = "BCDFGHJKLMNPRSTVWXYZ";

/** A Colombian-style plate (three letters, three digits) never already in the lot or a line. */
function newPlate(b: Board): string {
  const used = new Set([...b.stalls.map((s) => s.plate), ...b.queues.LV.map((c) => c.plate), ...b.queues.RG.map((c) => c.plate)]);
  for (let n = b.tick; ; n++) {
    const plate =
      LETTERS[(n * 7) % 20] + LETTERS[(n * 11 + 3) % 20] + LETTERS[(n * 13 + 5) % 20] + String(100 + ((n * 37) % 900));
    if (!used.has(plate)) return plate;
  }
}

const clock = (min: number) => {
  const total = 6 * 60 + 28 + min;
  return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
};

function seed(): Board {
  const ids = ["A01", "A02", "A03", "A04", "A05", "A06", "B01", "B02", "B03", "B04", "B05", "B06"];
  const free = new Set(["A04"]);
  const held = new Set(["A03", "B06"]);
  const parked = ["HKM214", "JRT508", "PLX733", "", "DWN161", "GTB902", "KVC377", "MZR645", "TFA219", "QNS880", "BYE524", "RCU416"];
  return {
    stalls: ids.map((id, i) => ({
      id,
      state: free.has(id) ? "libre" : held.has(id) ? "reservada" : "ocupada",
      plate: parked[i] || undefined,
    })),
    queues: {
      LV: [
        { plate: "FRS112", at: 1, gate: "LV" },
        { plate: "HUO845", at: 4, gate: "LV" },
        { plate: "KPA391", at: 7, gate: "LV" },
      ],
      RG: [
        { plate: "CXM540", at: 0, gate: "RG" },
        { plate: "NBD218", at: 2, gate: "RG" },
        { plate: "WQL903", at: 5, gate: "RG" },
      ],
    },
    given: { LV: 0, RG: 0 },
    clock: 12,
    last: null,
    tick: 0,
  };
}

/** The split rule, as asignador.ts states it: earliest arrival, then the gate with fewer stalls. */
function nextGate(b: Board): Gate | null {
  const lv = b.queues.LV[0];
  const rg = b.queues.RG[0];
  if (!lv && !rg) return null;
  if (!lv) return "RG";
  if (!rg) return "LV";
  if (lv.at !== rg.at) return lv.at < rg.at ? "LV" : "RG";
  return b.given.LV <= b.given.RG ? "LV" : "RG";
}

function step(prev: Board): Board {
  const b: Board = {
    ...prev,
    stalls: prev.stalls.map((s) => (s.state === "reservada" ? { ...s, state: "ocupada" } : { ...s })),
    queues: { LV: [...prev.queues.LV], RG: [...prev.queues.RG] },
    given: { ...prev.given },
    clock: prev.clock + 1,
    tick: prev.tick + 1,
  };

  // Every other tick a parked car leaves, walking the lot in a fixed stride.
  if (b.tick % 2 === 0) {
    const occupied = b.stalls.filter((s) => s.state === "ocupada");
    const out = occupied[(b.tick * 5) % occupied.length];
    if (out) Object.assign(out, { state: "libre", plate: undefined });
  }

  const free = b.stalls.find((s) => s.state === "libre");
  const gate = nextGate(b);
  if (free && gate) {
    const car = b.queues[gate].shift()!;
    Object.assign(free, { state: "reservada", plate: car.plate });
    b.given[gate] += 1;
    b.last = { plate: car.plate, stall: free.id, gate, at: car.at };
  }

  // A new car pulls up at whichever gate is shorter, so neither line empties.
  const target: Gate = b.queues.LV.length <= b.queues.RG.length ? "LV" : "RG";
  if (b.queues[target].length < 3) {
    b.queues[target].push({ plate: newPlate(b), at: b.clock, gate: target });
  }
  return b;
}

const gateName: Record<Gate, string> = { LV: "Las Vegas", RG: "Regional" };

export default function TurnBoard({ style }: { style?: CSSProperties }) {
  const reduced = useReducedMotion();
  const [board, setBoard] = useState<Board>(seed);

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setBoard(step), TICK_MS);
    return () => window.clearInterval(id);
  }, [reduced]);

  const turn = nextGate(board);
  const freeCount = board.stalls.filter((s) => s.state === "libre").length;

  return (
    <aside className={styles.board} style={style} aria-hidden="true">
      <header className={styles.boardHead}>
        <span className={styles.boardTitle}>Lote · hora pico</span>
        <span className={styles.boardClock}>
          <span className={styles.liveDot} />
          {clock(board.clock)}
        </span>
      </header>

      <div className={styles.lot}>
        {board.stalls.map((s) => (
          <span key={s.id} className={`${styles.stall} ${styles[s.state]}`}>
            <span className={styles.stallId}>{s.id}</span>
            <span className={styles.stallPlate}>{s.state === "libre" ? "libre" : s.plate}</span>
          </span>
        ))}
        <span className={styles.aisle} />
      </div>

      <div className={styles.gates}>
        {(["LV", "RG"] as Gate[]).map((g) => (
          <div key={g} className={`${styles.gate} ${turn === g ? styles.gateTurn : ""}`}>
            <div className={styles.gateHead}>
              <span className={styles.gateCode}>{g}</span>
              <span className={styles.gateName}>{gateName[g]}</span>
              <span className={styles.gateGiven}>
                {board.given[g]} {board.given[g] === 1 ? "celda" : "celdas"}
              </span>
            </div>
            <ol className={styles.queue}>
              {board.queues[g].map((c) => (
                <li key={`${c.plate}-${c.at}`} className={styles.car}>
                  <span>{c.plate}</span>
                  <span className={styles.carAt}>{clock(c.at)}</span>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>

      <footer className={styles.boardFoot} key={board.tick}>
        {board.last ? (
          <>
            <span className={styles.calloutTag}>Asignada</span>
            <span>
              {board.last.stall} → {board.last.plate} · llegó {clock(board.last.at)} por {gateName[board.last.gate]}
            </span>
          </>
        ) : (
          <>
            <span className={styles.calloutTag}>Turno</span>
            <span>
              {freeCount} libre · el primero en llegar, por cualquier entrada
            </span>
          </>
        )}
      </footer>
    </aside>
  );
}
