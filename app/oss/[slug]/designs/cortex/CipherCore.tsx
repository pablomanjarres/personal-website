"use client";

// The "cipher core" — concentric rings of hex glyphs on textPaths, counter-
// rotating (pure CSS @keyframes on each <g>), with a phosphor glow and a single
// keychain-gold keyhole at the centre: the one gold "decryption key" moment in
// the whole palette. Zero deps, no WebGL — the brief's rotating core faked in
// SVG/CSS. Decorative only (aria-hidden); rotation is gated in the CSS module.
// Long-ish hex strings so the glyphs wrap the full circumference.
const OUTER =
  "A3 F7 2C 9E 04 D1 6B 8A E5 1F 7C 30 B9 4D A2 5E 0C F8 91 6D 3B E7 2A 5F C4 08 D9 1B 7E A0 4C ";
const INNER = "0xE7·9A·2C·F1·4B·8D·6E·A3·05·C9·1F·7B·D2·48·E0·3C·";

export default function CipherCore({
  className,
  styles,
}: {
  className?: string;
  styles: Record<string, string>;
}) {
  return (
    <svg
      className={className}
      viewBox="0 0 600 600"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <path
          id="cx-ring-outer"
          d="M300,58 a242,242 0 1,1 -0.01,0"
          fill="none"
        />
        <path
          id="cx-ring-inner"
          d="M300,168 a132,132 0 1,1 -0.01,0"
          fill="none"
        />
      </defs>

      {/* faint structural rings */}
      <g className={styles.coreStatic}>
        <circle cx="300" cy="300" r="288" className={styles.ringHair} />
        <circle cx="300" cy="300" r="196" className={styles.ringHair} />
        <circle cx="300" cy="300" r="132" className={styles.ringHair} />
      </g>

      {/* rotating tick ring */}
      <g className={styles.ringB}>
        <circle
          cx="300"
          cy="300"
          r="242"
          className={styles.ringTicks}
          pathLength={72}
        />
      </g>

      {/* rotating hex text rings */}
      <g className={styles.ringA}>
        <text className={styles.ringGlyphs}>
          <textPath href="#cx-ring-outer" startOffset="0">
            {OUTER + OUTER}
          </textPath>
        </text>
      </g>
      <g className={styles.ringC}>
        <text className={styles.ringGlyphsSm}>
          <textPath href="#cx-ring-inner" startOffset="0">
            {INNER + INNER}
          </textPath>
        </text>
      </g>

      {/* centre keyhole — the single keychain-gold accent */}
      <g className={styles.keyhole}>
        <circle cx="300" cy="292" r="15" />
        <path d="M292,300 L308,300 L304,326 L296,326 Z" />
      </g>
      <circle cx="300" cy="300" r="60" className={styles.coreDot} />
    </svg>
  );
}
