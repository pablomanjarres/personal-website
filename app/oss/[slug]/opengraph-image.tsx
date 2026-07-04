// Build-time Open Graph image generator for every OSS project page.
//
// One 1200x630 PNG is baked per slug at `next build` (generateStaticParams below
// mirrors page.tsx so the two never drift). Each card composites, in Satori DOM
// order (there is no z-index): the project's background art -> a palette scrim ->
// the project's identity type (title + kicker + tagline in that brief's font and
// accent) -> a "pablomanjarres.com" wordmark, plus one signature flourish per
// project so the cards read as distinct. Node runtime (the default) so we can
// readFile the bundled fonts and art. Verified against Next 16's
// node_modules/next/dist/docs/.../opengraph-image.md and image-response.md.

import { ImageResponse } from "next/og";
import { heroes, getHero } from "../heroes";
import { F, type FontKey, loadFonts, loadBackground, rgba } from "./og-assets";

export const alt = "OSS project by Pablo Manjarres";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamicParams = false;

// Own copy of the slug list — opengraph-image does NOT inherit page.tsx's
// generateStaticParams. Sharing the `heroes` source keeps them in lockstep.
export function generateStaticParams() {
  return heroes.map((h) => ({ slug: h.slug }));
}

type Flavor =
  | "cortex"
  | "band"
  | "content"
  | "forge"
  | "archgraph"
  | "omegahack"
  | "localhost"
  | "lumen"
  | "default";

type Theme = {
  bg: string;
  fg: string;
  accent: string;
  accent2: string;
  scrim: "dark" | "light";
  title: FontKey;
  kicker: FontKey;
  tagline: FontKey;
  titleUpper?: boolean;
  titleTracking?: number;
  fallback: string; // CSS gradient painted when a slug has no art
  flavor: Flavor;
};

// Palette + type per project, taken from the design briefs. Fonts referenced
// here are the only ones loaded for that card (title/kicker/tagline dedup), and
// every flavor flourish reuses one of those three families.
const THEMES: Record<string, Theme> = {
  cortex: {
    bg: "#000000", fg: "#E6FFF4", accent: "#22E6A4", accent2: "#E7B24C", scrim: "dark",
    title: "martian700", kicker: "martian500", tagline: "martian500",
    fallback: "radial-gradient(120% 120% at 18% 90%, rgba(34,230,164,0.28), #000000 62%)",
    flavor: "cortex",
  },
  "band-of-agents": {
    bg: "#0B0C10", fg: "#EAE4D5", accent: "#3FB950", accent2: "#F0503C", scrim: "dark",
    title: "fraunces600", kicker: "martian500", tagline: "fraunces600",
    fallback: "linear-gradient(135deg, #0B0C10, #14161d)",
    flavor: "band",
  },
  "content-pipeline": {
    bg: "#0E1116", fg: "#E6EAF0", accent: "#FFB224", accent2: "#3DDC84", scrim: "dark",
    title: "anton400", kicker: "martian500", tagline: "martian500", titleUpper: true, titleTracking: 1,
    fallback: "linear-gradient(135deg, #0E1116, #1a1206)",
    flavor: "content",
  },
  forge: {
    bg: "#0B0907", fg: "#EDE4D8", accent: "#FF4C00", accent2: "#FFC24A", scrim: "dark",
    title: "bigShoulders800", kicker: "plexMono600", tagline: "plexMono600", titleUpper: true, titleTracking: 1,
    fallback: "linear-gradient(160deg, #0B0907, #1A0F08)",
    flavor: "forge",
  },
  archgraph: {
    bg: "#0A1626", fg: "#E6EEF6", accent: "#38BDF8", accent2: "#F5A524", scrim: "dark",
    title: "chakra700", kicker: "martian500", tagline: "martian500", titleUpper: true, titleTracking: 3,
    fallback: "linear-gradient(120deg, #0A1626, #103a52)",
    flavor: "archgraph",
  },
  omegahack: {
    bg: "#F4EDDD", fg: "#211C15", accent: "#B0342A", accent2: "#C8891E", scrim: "light",
    title: "caslon400", kicker: "plexMono600", tagline: "publicSans600",
    fallback: "linear-gradient(180deg, #F7F1E4, #ECE2CC)",
    flavor: "omegahack",
  },
  "localhost-mirror": {
    bg: "#0B0D10", fg: "#E7ECF2", accent: "#4ADE80", accent2: "#B8C2CE", scrim: "dark",
    title: "sora800", kicker: "jetbrains500", tagline: "jetbrains500",
    fallback: "radial-gradient(60% 90% at 50% 50%, rgba(74,222,128,0.30), #0B0D10 70%)",
    flavor: "localhost",
  },
  "lumen-frontier": {
    bg: "#0B1020", fg: "#F2E8D5", accent: "#C9A25A", accent2: "#7A2E3B", scrim: "dark",
    title: "fraunces600", kicker: "spaceMono700", tagline: "hanken500",
    fallback: "radial-gradient(90% 120% at 78% 88%, rgba(201,162,90,0.35), #0B1020 60%)",
    flavor: "lumen",
  },
  // No design brief exists for these two (they render via DefaultHero) — give
  // them clean, distinct default identities rather than a shared look.
  nella: {
    bg: "#08110F", fg: "#E8F5F0", accent: "#37E0B0", accent2: "#5EEAD4", scrim: "dark",
    title: "sora800", kicker: "jetbrains500", tagline: "jetbrains500",
    fallback: "radial-gradient(110% 120% at 82% 12%, rgba(55,224,176,0.26), #08110F 60%)",
    flavor: "default",
  },
  noelle: {
    bg: "#0E0A16", fg: "#F1ECFA", accent: "#A78BFA", accent2: "#F472B6", scrim: "dark",
    title: "hanken800", kicker: "jetbrains500", tagline: "jetbrains500",
    fallback: "radial-gradient(110% 120% at 18% 14%, rgba(167,139,250,0.28), #0E0A16 60%)",
    flavor: "default",
  },
};

const FALLBACK_THEME: Theme = {
  bg: "#0A0B10", fg: "#F5F7FB", accent: "#8B5CF6", accent2: "#22D3EE", scrim: "dark",
  title: "sora800", kicker: "jetbrains500", tagline: "jetbrains500",
  fallback: "linear-gradient(135deg, #0A0B10, #191233)",
  flavor: "default",
};

function titleSize(text: string): number {
  const n = text.length;
  if (n <= 6) return 112;
  if (n <= 9) return 96;
  if (n <= 13) return 84;
  return 76;
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const hero = getHero(slug);
  const theme = THEMES[slug] ?? FALLBACK_THEME;

  const titleText = hero
    ? theme.titleUpper
      ? hero.title.toUpperCase()
      : hero.title
    : slug;
  const kickerText = (hero?.kicker ?? "OPEN SOURCE").toUpperCase();
  const tagline = hero ? `${hero.titleLead} ${hero.titleMain}`.trim() : "";

  const [bg, fonts] = await Promise.all([
    loadBackground(slug),
    loadFonts([theme.title, theme.kicker, theme.tagline]),
  ]);

  const titleFamily = F[theme.title].family;
  const titleWeight = F[theme.title].weight;
  const kickerFamily = F[theme.kicker].family;
  const kickerWeight = F[theme.kicker].weight;
  const taglineFamily = F[theme.tagline].family;
  const taglineWeight = F[theme.tagline].weight;

  const isLight = theme.scrim === "light";
  const muted = rgba(theme.fg, isLight ? 0.6 : 0.55);
  const tSize = titleSize(titleText);
  const taglineColor = theme.flavor === "archgraph" ? theme.accent : rgba(theme.fg, isLight ? 0.72 : 0.82);

  // --- scrim: keep the bottom-left type legible over any artwork -------------
  const bottomScrim = isLight
    ? `linear-gradient(180deg, ${rgba(theme.bg, 0.28)} 0%, ${rgba(theme.bg, 0.55)} 55%, ${rgba(theme.bg, 0.85)} 100%)`
    : `linear-gradient(180deg, ${rgba(theme.bg, 0)} 0%, ${rgba(theme.bg, 0.12)} 42%, ${rgba(theme.bg, 0.86)} 82%, ${rgba(theme.bg, 0.96)} 100%)`;
  const sideScrim = isLight
    ? `linear-gradient(90deg, ${rgba(theme.bg, 0.86)} 0%, ${rgba(theme.bg, 0.4)} 46%, ${rgba(theme.bg, 0)} 74%)`
    : `linear-gradient(90deg, ${rgba(theme.bg, 0.8)} 0%, ${rgba(theme.bg, 0.34)} 44%, ${rgba(theme.bg, 0)} 72%)`;

  return new ImageResponse(
    (
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          display: "flex",
          backgroundColor: theme.bg,
          fontFamily: titleFamily,
          overflow: "hidden",
        }}
      >
        {/* 1. background layer, painted first (Satori has no z-index).
             Dark cards: full-bleed artwork. Light cards (omegahack's official
             "paper dossier"): a document-cream base with the warm archive art
             dropped to a faint grain on top, so it textures the case cover
             instead of drowning the dark ink — the brief calls for a cream base
             with the art as a "subtle paper-grain", not a full-bleed dark photo. */}
        {isLight && (
          <div style={{ position: "absolute", inset: 0, display: "flex", backgroundImage: theme.fallback, backgroundSize: "100% 100%" }} />
        )}
        {bg ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={bg}
            alt=""
            width={1200}
            height={630}
            style={{ position: "absolute", top: 0, left: 0, width: 1200, height: 630, objectFit: "cover", opacity: isLight ? 0.2 : 1 }}
          />
        ) : (
          !isLight && <div style={{ position: "absolute", inset: 0, display: "flex", backgroundImage: theme.fallback, backgroundSize: "100% 100%" }} />
        )}

        {/* 2. palette scrims for legibility */}
        <div style={{ position: "absolute", inset: 0, display: "flex", backgroundImage: bottomScrim, backgroundSize: "100% 100%" }} />
        <div style={{ position: "absolute", inset: 0, display: "flex", backgroundImage: sideScrim, backgroundSize: "100% 100%" }} />

        {/* flavor glow behind the type (cortex phosphor / forge ember / localhost tunnel) */}
        {theme.flavor === "cortex" && (
          <div style={{ position: "absolute", inset: 0, display: "flex", backgroundImage: `radial-gradient(42% 55% at 22% 76%, ${rgba(theme.accent, 0.22)}, transparent 70%)`, backgroundSize: "100% 100%" }} />
        )}
        {theme.flavor === "forge" && (
          <div style={{ position: "absolute", inset: 0, display: "flex", backgroundImage: `radial-gradient(52% 120% at 26% 100%, ${rgba(theme.accent, 0.5)}, ${rgba(theme.accent2, 0.1)} 42%, transparent 72%)`, backgroundSize: "100% 100%" }} />
        )}
        {theme.flavor === "localhost" && (
          <div style={{ position: "absolute", inset: 0, display: "flex", backgroundImage: `radial-gradient(34% 46% at 50% 52%, ${rgba(theme.accent, 0.34)}, transparent 68%)`, backgroundSize: "100% 100%" }} />
        )}

        {/* edge frames */}
        {theme.flavor === "lumen" && (
          <div style={{ position: "absolute", top: 22, left: 22, right: 22, bottom: 22, borderWidth: 2, borderStyle: "solid", borderColor: rgba(theme.accent, 0.7) }} />
        )}
        {theme.flavor === "omegahack" && (
          <div style={{ position: "absolute", top: 22, left: 22, right: 22, bottom: 22, borderWidth: 1, borderStyle: "solid", borderColor: rgba(theme.fg, 0.35) }} />
        )}
        {theme.flavor === "omegahack" && (
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, display: "flex", backgroundColor: theme.accent }} />
        )}

        {/* 3. the type block — bottom-left, painted last so it sits on top */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "0 76px 72px 76px",
          }}
        >
          <div style={{ display: "flex", fontFamily: kickerFamily, fontWeight: kickerWeight, fontSize: 22, letterSpacing: 4, color: theme.accent, marginBottom: 20 }}>
            {kickerText}
          </div>

          {/* title (cortex renders it as a decrypted terminal line) */}
          {theme.flavor === "cortex" ? (
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ display: "flex", fontFamily: titleFamily, fontWeight: titleWeight, fontSize: tSize, lineHeight: 1, color: theme.accent, marginRight: 22 }}>{">"}</div>
              <div style={{ display: "flex", fontFamily: titleFamily, fontWeight: titleWeight, fontSize: tSize, lineHeight: 1, color: theme.fg, letterSpacing: theme.titleTracking ?? 0 }}>{titleText}</div>
              <div style={{ width: 26, height: Math.round(tSize * 0.78), backgroundColor: theme.accent, marginLeft: 18 }} />
            </div>
          ) : (
            <div style={{ display: "flex", fontFamily: titleFamily, fontWeight: titleWeight, fontSize: tSize, lineHeight: 1.02, color: theme.fg, letterSpacing: theme.titleTracking ?? 0 }}>
              {titleText}
            </div>
          )}

          {/* forge molten seam / lumen brass rule under the title */}
          {theme.flavor === "forge" && (
            <div style={{ width: 240, height: 5, marginTop: 16, borderRadius: 3, display: "flex", backgroundImage: `linear-gradient(90deg, ${rgba(theme.accent, 0)}, ${theme.accent}, ${theme.accent2}, ${rgba(theme.accent2, 0)})`, backgroundSize: "100% 100%" }} />
          )}
          {theme.flavor === "lumen" && (
            <div style={{ width: 170, height: 3, marginTop: 16, display: "flex", backgroundColor: theme.accent, opacity: 0.85 }} />
          )}

          {/* localhost: a mirror line + a dim reflected copy of the title */}
          {theme.flavor === "localhost" && (
            <div style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ width: 560, height: 1, marginTop: 8, display: "flex", backgroundColor: rgba(theme.accent2, 0.55) }} />
              <div style={{ display: "flex", height: Math.round(tSize * 0.5), overflow: "hidden", fontFamily: titleFamily, fontWeight: titleWeight, fontSize: tSize, lineHeight: 1, color: theme.fg, opacity: 0.16, transform: "scaleY(-1)", marginTop: 4 }}>
                {titleText}
              </div>
            </div>
          )}

          <div style={{ display: "flex", maxWidth: 900, marginTop: 22, fontFamily: taglineFamily, fontWeight: taglineWeight, fontSize: 30, lineHeight: 1.2, color: taglineColor }}>
            {tagline}
          </div>
        </div>

        {/* corner identity marks (top-right / top-left zones — clear of the type) */}
        {theme.flavor === "band" && (
          <div style={{ position: "absolute", top: 56, right: 60, display: "flex", transform: "rotate(-6deg)", borderWidth: 3, borderStyle: "solid", borderColor: theme.accent, borderRadius: 10, padding: "10px 22px" }}>
            <div style={{ display: "flex", fontFamily: "Martian Mono", fontWeight: 500, fontSize: 26, letterSpacing: 4, color: theme.accent }}>PUBLISHED</div>
          </div>
        )}

        {theme.flavor === "content" && (
          <div style={{ position: "absolute", top: 60, right: 60, display: "flex", alignItems: "center" }}>
            {[0, 1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} style={{ width: 13, height: 13, borderRadius: 999, marginLeft: 9, backgroundColor: i % 3 === 2 ? theme.accent2 : theme.accent }} />
            ))}
            <div style={{ display: "flex", marginLeft: 16, fontFamily: "Martian Mono", fontWeight: 500, fontSize: 24, letterSpacing: 2, color: theme.accent2 }}>07/07</div>
          </div>
        )}

        {theme.flavor === "archgraph" && (
          <div style={{ position: "absolute", top: 56, right: 60, display: "flex", flexDirection: "column", borderWidth: 1, borderStyle: "solid", borderColor: rgba(theme.accent, 0.55), padding: "12px 16px" }}>
            <div style={{ display: "flex", fontFamily: "Martian Mono", fontWeight: 500, fontSize: 20, letterSpacing: 2, color: theme.accent }}>C4 · CONTEXT → CODE</div>
            <div style={{ display: "flex", alignItems: "center", marginTop: 6 }}>
              <div style={{ display: "flex", fontFamily: "Martian Mono", fontWeight: 500, fontSize: 18, letterSpacing: 2, color: rgba(theme.fg, 0.7) }}>{slug.toUpperCase()}</div>
              <div style={{ width: 9, height: 9, marginLeft: 12, backgroundColor: theme.accent2 }} />
            </div>
          </div>
        )}

        {theme.flavor === "lumen" && (
          <div style={{ position: "absolute", top: 52, right: 60, display: "flex", fontFamily: "Space Mono", fontWeight: 700, fontSize: 22, letterSpacing: 2, color: theme.accent }}>
            R.A. 17h32m · DEC +34° · MAG 4.2
          </div>
        )}

        {theme.flavor === "omegahack" && (
          <div style={{ position: "absolute", bottom: 104, left: 76, display: "flex", borderWidth: 1, borderStyle: "solid", borderColor: theme.accent2, borderRadius: 4, padding: "4px 12px", fontFamily: "IBM Plex Mono", fontWeight: 600, fontSize: 20, letterSpacing: 2, color: theme.accent2 }}>
            T−72H
          </div>
        )}
        {theme.flavor === "omegahack" && (
          <div style={{ position: "absolute", top: 58, right: 70, width: 140, height: 140, borderRadius: 9999, borderWidth: 3, borderStyle: "solid", borderColor: theme.accent, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", transform: "rotate(-7deg)" }}>
            <div style={{ display: "flex", fontFamily: "IBM Plex Mono", fontWeight: 600, fontSize: 20, letterSpacing: 3, color: theme.accent }}>PQRSD</div>
            <div style={{ display: "flex", marginTop: 6, fontFamily: "IBM Plex Mono", fontWeight: 600, fontSize: 15, letterSpacing: 1, color: theme.accent }}>2026-0042</div>
          </div>
        )}

        {/* wordmark — bottom-right on every card */}
        <div style={{ position: "absolute", bottom: 44, right: 60, display: "flex", alignItems: "center" }}>
          <div style={{ width: 12, height: 12, marginRight: 12, backgroundColor: theme.accent }} />
          <div style={{ display: "flex", fontFamily: kickerFamily, fontWeight: kickerWeight, fontSize: 20, letterSpacing: 1, color: muted }}>pablomanjarres.com</div>
        </div>
      </div>
    ),
    { ...size, fonts },
  );
}
