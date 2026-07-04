// Local helper for the opengraph-image route (NOT a route file itself).
//
// Provides the three things Satori / next-og need that must come from the
// filesystem at build time:
//   1. custom fonts as raw TTF bytes (next/font/google can't feed ImageResponse)
//   2. the per-slug background art as a base64 data URI (Satori can't resolve a
//      bare /public path — it has no origin at build time)
//   3. a tiny hex->rgba helper for the scrims/glows
//
// Fonts live in /assets/og-fonts (subset-free Google TTFs, one per weight) and
// the art is a pre-compressed 1200x630 JPEG in /assets/og-bg so every card stays
// under the 500KB ImageResponse budget. Nothing here touches the per-project
// design files or the layout.tsx next/font setup.

import { readFile } from "node:fs/promises";
import { join } from "node:path";

const ROOT = process.cwd();
const FONT_DIR = join(ROOT, "assets", "og-fonts");
const BG_DIR = join(ROOT, "assets", "og-bg");

// ---------------------------------------------------------------------------
// Font registry. `as const` keeps the weights as literal members of Satori's
// `Weight` union so they typecheck against ImageResponse's fonts[] option.
// The `family` string MUST equal the fontFamily used in styles or Satori
// silently falls back to Noto.
// ---------------------------------------------------------------------------
export const F = {
  martian700: { file: "martian-mono-700.ttf", family: "Martian Mono", weight: 700 },
  martian500: { file: "martian-mono-500.ttf", family: "Martian Mono", weight: 500 },
  fraunces600: { file: "fraunces-600.ttf", family: "Fraunces", weight: 600 },
  anton400: { file: "anton-400.ttf", family: "Anton", weight: 400 },
  bigShoulders800: { file: "big-shoulders-800.ttf", family: "Big Shoulders Display", weight: 800 },
  plexMono600: { file: "ibm-plex-mono-600.ttf", family: "IBM Plex Mono", weight: 600 },
  chakra700: { file: "chakra-petch-700.ttf", family: "Chakra Petch", weight: 700 },
  caslon400: { file: "libre-caslon-display-400.ttf", family: "Libre Caslon Display", weight: 400 },
  publicSans600: { file: "public-sans-600.ttf", family: "Public Sans", weight: 600 },
  sora800: { file: "sora-800.ttf", family: "Sora", weight: 800 },
  jetbrains500: { file: "jetbrains-mono-500.ttf", family: "JetBrains Mono", weight: 500 },
  hanken500: { file: "hanken-grotesk-500.ttf", family: "Hanken Grotesk", weight: 500 },
  hanken800: { file: "hanken-grotesk-800.ttf", family: "Hanken Grotesk", weight: 800 },
  spaceMono700: { file: "space-mono-700.ttf", family: "Space Mono", weight: 700 },
} as const;

export type FontKey = keyof typeof F;

// A ready-to-use ImageResponse fonts[] entry.
export type LoadedFont = {
  name: string;
  data: Buffer;
  weight: (typeof F)[FontKey]["weight"];
  style: "normal";
};

// Read each TTF at most once per build process, even across slugs that share a
// family (e.g. the four projects that reuse Martian Mono).
const fileCache = new Map<string, Promise<Buffer>>();
function readFontFile(file: string): Promise<Buffer> {
  let p = fileCache.get(file);
  if (!p) {
    p = readFile(join(FONT_DIR, file));
    fileCache.set(file, p);
  }
  return p;
}

/** Load the (de-duplicated) set of fonts a single card needs. */
export async function loadFonts(keys: readonly FontKey[]): Promise<LoadedFont[]> {
  const unique = Array.from(new Set(keys));
  return Promise.all(
    unique.map(async (k): Promise<LoadedFont> => {
      const ref = F[k];
      return { name: ref.family, data: await readFontFile(ref.file), weight: ref.weight, style: "normal" };
    }),
  );
}

// ---------------------------------------------------------------------------
// Background art -> data URI. Prefer the pre-compressed JPEG; fall back to the
// original /public/oss PNG so the route still works for a brand-new slug that
// hasn't been through the resize step; return null if there is genuinely no art
// (the route then paints a pure-CSS gradient so it never fails).
// ---------------------------------------------------------------------------
const bgCache = new Map<string, Promise<string | null>>();
export function loadBackground(slug: string): Promise<string | null> {
  let p = bgCache.get(slug);
  if (!p) {
    p = (async () => {
      try {
        const jpg = await readFile(join(BG_DIR, `${slug}.jpg`));
        return `data:image/jpeg;base64,${jpg.toString("base64")}`;
      } catch {
        try {
          const png = await readFile(join(ROOT, "public", "oss", `${slug}.png`));
          return `data:image/png;base64,${png.toString("base64")}`;
        } catch {
          return null;
        }
      }
    })();
    bgCache.set(slug, p);
  }
  return p;
}

/** #RGB / #RRGGBB -> rgba() string for scrims and glows. */
export function rgba(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${alpha})`;
}
