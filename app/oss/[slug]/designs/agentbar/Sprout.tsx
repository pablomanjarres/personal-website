"use client";

import type { CSSProperties } from "react";
import styles from "../agentbar.module.css";

/**
 * The little sprout that lives in the menu bar item.
 *
 * Drawn here as a CSS grid of <i> cells rather than a bitmap, for three
 * reasons: it stays crisp at any DPR, every pixel is themeable from the
 * palette, and its mood is a data change rather than a different asset. The
 * art is original to this page; agentbar itself reads the real Codex pet out
 * of the user's own install and never redistributes it.
 *
 * Legend: l leaf · s stem · o outline · h face · e eye · w mouth · b body
 *         c chest dot · . transparent
 */
/* Named rather than indexed: an earlier version pulled these out of one array
   by position, which left a row unreachable and would have made a later edit
   to the face silently do nothing. */
const HEAD_TOP = ".oooooooooo.";
const HEAD_BLANK = "ohhhhhhhhhho";
const HEAD_BOTTOM = ".oooooooooo.";
const TORSO = ["...bbbbbb...", "..bbbbbbbb..", "..bb.cc.bb..", "..bb....bb.."];

type Mood = "calm" | "working" | "strained" | "spent";

/** The eye and mouth rows of the face, swapped per mood. Every row is 12 wide. */
const FACES: Record<Mood, { eyes: string; mouth: string }> = {
  calm: { eyes: "oheehhhheeho", mouth: "ohhhhwwhhhho" },
  working: { eyes: "oheehhhheeho", mouth: "ohhhhhhhhhho" },
  strained: { eyes: "ohewhhhhweho", mouth: "ohhhwwwwhhho" },
  spent: { eyes: "ohwehhhhewho", mouth: "ohhhwwwwhhho" },
};

/** Leaves lift when there is room and droop as the window burns down. */
const CANOPY: Record<Mood, string[]> = {
  calm: ["..ll....ll..", "..ll.ss.ll..", ".....ss....."],
  working: ["..ll....ll..", "..ll.ss.ll..", ".....ss....."],
  strained: ["............", ".lll.ss.lll.", ".....ss....."],
  spent: ["............", "............", ".lll.ss.lll."],
};

const CLASS: Record<string, string> = {
  l: styles.pxLeaf,
  s: styles.pxStem,
  o: styles.pxOutline,
  h: styles.pxFace,
  e: styles.pxEye,
  w: styles.pxMouth,
  b: styles.pxBody,
  c: styles.pxChest,
};

export default function Sprout({
  mood = "calm",
  scale = 3,
  className,
}: {
  mood?: Mood;
  scale?: number;
  className?: string;
}) {
  const face = FACES[mood];
  // 3 canopy + 7 head + 4 torso = the 14 rows the CSS grid is sized for
  const rows = [
    ...CANOPY[mood],
    HEAD_TOP,
    HEAD_BLANK,
    face.eyes,
    HEAD_BLANK,
    face.mouth,
    HEAD_BLANK,
    HEAD_BOTTOM,
    ...TORSO,
  ];

  return (
    <span
      className={`${styles.sprout}${className ? ` ${className}` : ""}`}
      style={{ ["--px" as string]: `${scale}px` } as CSSProperties}
      data-mood={mood}
      aria-hidden="true"
    >
      {rows.map((row, y) =>
        row.split("").map((ch, x) => {
          const cls = CLASS[ch];
          return cls ? (
            <i key={`${y}-${x}`} className={cls} style={{ gridArea: `${y + 1} / ${x + 1}` }} />
          ) : null;
        }),
      )}
    </span>
  );
}

export type { Mood };
