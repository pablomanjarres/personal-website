import type { CSSProperties } from "react";

// ---- fixed palette (Terracotta) + font tokens -----------------------------
// Single source of truth for the site's design tokens. Spread `tokens` onto a
// page root to expose the CSS variables (--bg, --fg, --accent, --muted, --ff-*)
// that globals.css and portfolio.css consume.
export const BG = "#f3e8d3"; // warm cream paper
export const FG = "#1c1812"; // near-black ink
export const ACCENT = "#c8542a"; // terracotta / rust
export const MUTED = "#7a5a3a"; // brown

export const tokens: CSSProperties = {
  ["--bg" as string]: BG,
  ["--fg" as string]: FG,
  ["--accent" as string]: ACCENT,
  ["--muted" as string]: MUTED,
  ["--ff-display" as string]: "var(--font-display), 'Archivo Black', system-ui, sans-serif",
  ["--ff-body" as string]: "var(--font-sans), system-ui, sans-serif",
  ["--ff-mono" as string]: "var(--font-mono), ui-monospace, monospace",
  ["--ff-pixel" as string]: "var(--font-pixel), 'Pixelify Sans', ui-monospace, monospace",
};
