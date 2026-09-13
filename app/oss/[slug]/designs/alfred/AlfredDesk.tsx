"use client";

import { useEffect, useState, type CSSProperties } from "react";
import styles from "../alfred.module.css";

type Order = {
  phrase: string;
  channel: string;
  state: "queued" | "running" | "spoken";
};

type PetMood = "ready" | "listening" | "serving";

const orders: Order[] = [
  {
    phrase: "Draft the scholarship note",
    channel: "voice",
    state: "running",
  },
  {
    phrase: "Read Downloads and summarize",
    channel: "typed",
    state: "queued",
  },
  {
    phrase: "Say the answer out loud",
    channel: "reply",
    state: "spoken",
  },
];

const history = [
  "09:41  order captured",
  "09:41  Codex route checked",
  "09:42  local run locked",
  "09:43  answer saved",
];

const pixels: Record<PetMood, string[]> = {
  ready: [
    "..hhhhhhhh..",
    ".hssssssssh.",
    "hssbeeeebssh",
    "hsbeffffebsh",
    "hsfeffffefsh",
    "hsffmffmffsh",
    "hsffffffffsh",
    ".hffwwwwffh.",
    "..hhhhhhhh..",
    "...cccccc...",
    "..cddddddc..",
    ".cddrrrrddc.",
    ".cddrrrrddc.",
    "..cccccccc..",
  ],
  listening: [
    "..hhhhhhhh..",
    ".hssssssssh.",
    "hssbeeeebssh",
    "hsbeffffebsh",
    "hsfeffffefsh",
    "hsffoffoffsh",
    "hsffffffffsh",
    ".hffvvvvffh.",
    "..hhhhhhhh..",
    "...cccccc...",
    "..cddddddc..",
    ".cddrrrrddc.",
    ".cddrrrrddc.",
    "..cccccccc..",
  ],
  serving: [
    "..hhhhhhhh..",
    ".hssssssssh.",
    "hssbeeeebssh",
    "hsbeffffebsh",
    "hsfeffffefsh",
    "hsffmffmffsh",
    "hsffffffffsh",
    ".hffuuuuffh.",
    "..hhhhhhhh..",
    "...cccccc...",
    "..cddddddc..",
    ".cddrrrrddc.",
    ".cddrrrrddc.",
    "..cccccccc..",
  ],
};

const classFor: Record<string, string> = {
  h: styles.petHair,
  s: styles.petShadow,
  b: styles.petBrow,
  e: styles.petFace,
  f: styles.petFace,
  m: styles.petEye,
  o: styles.petListen,
  w: styles.petMouth,
  v: styles.petListenMouth,
  u: styles.petSmile,
  c: styles.petCoat,
  d: styles.petShirt,
  r: styles.petBrass,
};

function Pet({ mood }: { mood: PetMood }) {
  return (
    <span className={styles.pet} data-mood={mood} aria-hidden="true">
      {pixels[mood].map((row, y) =>
        row.split("").map((ch, x) => {
          const cls = classFor[ch];
          return cls ? (
            <i
              key={`${y}-${x}`}
              className={cls}
              style={{ gridArea: `${y + 1} / ${x + 1}` }}
            />
          ) : null;
        }),
      )}
    </span>
  );
}

export default function AlfredDesk({ style }: { style?: CSSProperties }) {
  const [active, setActive] = useState(0);
  const mood: PetMood = active === 0 ? "listening" : active === 1 ? "ready" : "serving";

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setActive((n) => (n + 1) % orders.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <aside className={styles.desk} style={style} aria-hidden="true">
      <div className={styles.deskTop}>
        <div className={styles.petFrame}>
          <div className={styles.petHalo} />
          <Pet mood={mood} />
          <span className={styles.petTag}>Alfred.pet</span>
        </div>
        <div className={styles.voiceCard}>
          <span className={styles.voiceLabel}>Voice order</span>
          <span className={styles.voiceText}>“Alfred, take this to Codex.”</span>
          <span className={styles.wave}>
            {Array.from({ length: 18 }).map((_, i) => (
              <i key={i} style={{ ["--i" as string]: String(i) } as CSSProperties} />
            ))}
          </span>
        </div>
      </div>

      <div className={styles.orderList}>
        {orders.map((order, i) => (
          <div
            key={order.phrase}
            className={`${styles.order} ${i === active ? styles.orderActive : ""}`}
          >
            <span className={styles.orderLamp} />
            <span className={styles.orderMain}>
              <span className={styles.orderPhrase}>{order.phrase}</span>
              <span className={styles.orderChannel}>{order.channel}</span>
            </span>
            <span className={styles.orderState}>{order.state}</span>
          </div>
        ))}
      </div>

      <div className={styles.ledger}>
        <div className={styles.ledgerHead}>
          <span>Service ledger</span>
          <span>local</span>
        </div>
        {history.map((line, i) => (
          <span
            key={line}
            className={styles.ledgerLine}
            style={{ ["--r" as string]: String(i) } as CSSProperties}
          >
            {line}
          </span>
        ))}
      </div>
    </aside>
  );
}
