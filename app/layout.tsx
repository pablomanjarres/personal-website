import type { Metadata } from "next";
import type { CSSProperties } from "react";
import {
  Archivo_Black,
  IBM_Plex_Sans,
  IBM_Plex_Mono,
  Pixelify_Sans,
  Instrument_Serif,
  // ---- OSS per-project display / body / mono families (one instance per
  //      UNIQUE family; families shared by several slugs reuse one instance) ----
  Martian_Mono,
  Hanken_Grotesk,
  JetBrains_Mono,
  Fraunces,
  Spectral,
  Anton,
  Saira,
  Big_Shoulders,
  Chakra_Petch,
  Libre_Caslon_Display,
  Public_Sans,
  Sora,
  Space_Mono,
} from "next/font/google";
import "./globals.css";

// ---- site fonts (unchanged) -----------------------------------------------
const instrument = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const pixelify = Pixelify_Sans({
  variable: "--font-pixel",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const archivo = Archivo_Black({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  display: "swap",
});

// ============================================================================
// OSS per-project fonts.
//
// One next/font/google instance PER UNIQUE FAMILY, each exposing a canonical
// `--font-<family>` CSS var through its `.variable` class on <html>. The exact
// per-slug contract vars (`--font-<slug>-display|body|mono`) are aliased to
// these canonicals in `ossFontVars` below — that alias table is the single
// source of truth the per-project agents consume, so they never touch this
// next/font wiring.
//
// `preload: false` keeps the global homepage/portfolio lean: these 13 families
// self-host and load lazily only when an /oss/<slug> hero actually paints them
// (display:swap covers the swap-in). The 5 site fonts above keep their existing
// preload behavior untouched.
//
// Variable vs static verified against this installed Next 16.2.6's
// next/font/google type declarations:
//   - variable (weight omitted → full axis; extra axes listed explicitly):
//       Martian_Mono (wdth), Hanken_Grotesk, JetBrains_Mono,
//       Fraunces (opsz/SOFT/WONK), Saira, Big_Shoulders (opsz), Public_Sans, Sora
//   - static (explicit weight required):
//       Spectral, Anton, Chakra_Petch, Libre_Caslon_Display, Space_Mono
//
// FONT-EXPORT SWAP: the brief's "Big Shoulders" maps to the export
// `Big_Shoulders` — this Next version does NOT expose `Big_Shoulders_Display`.
// Same distinctive Chicago-Design-System industrial gothic, correct export name.
// ============================================================================

const martianMono = Martian_Mono({
  variable: "--font-martian",
  subsets: ["latin"],
  axes: ["wdth"], // powers the cortex variable-font width hover-morph
  display: "swap",
  preload: false,
});

const hankenGrotesk = Hanken_Grotesk({
  variable: "--font-hanken",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"], // court-gazette opsz + uncanny SOFT/WONK
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});

const spectral = Spectral({
  variable: "--font-spectral",
  subsets: ["latin"],
  weight: ["200", "400", "600"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});

const anton = Anton({
  variable: "--font-anton",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

const saira = Saira({
  variable: "--font-saira",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const bigShoulders = Big_Shoulders({
  variable: "--font-bigshoulders",
  subsets: ["latin"],
  axes: ["opsz"],
  display: "swap",
  preload: false,
});

const chakraPetch = Chakra_Petch({
  variable: "--font-chakra",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  preload: false,
});

const libreCaslonDisplay = Libre_Caslon_Display({
  variable: "--font-librecaslon",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
  preload: false,
});

const publicSans = Public_Sans({
  variable: "--font-publicsans",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const spaceMono = Space_Mono({
  variable: "--font-spacemono",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});

// ---- exact per-slug contract vars (aliased to the canonical family vars) ----
// Consumed by app/oss/[slug]/designs/<slug>.tsx. Documented in
// app/oss/[slug]/designs/CONTRACT.md. Computed-key form (matches app/theme.ts)
// so custom-property keys type-check as CSSProperties.
const ossFontVars: CSSProperties = {
  // cortex — Martian Mono / Hanken Grotesk / JetBrains Mono
  ["--font-cortex-display" as string]: "var(--font-martian)",
  ["--font-cortex-body" as string]: "var(--font-hanken)",
  ["--font-cortex-mono" as string]: "var(--font-jetbrains)",
  // band-of-agents — Fraunces / Spectral / Martian Mono
  ["--font-band-of-agents-display" as string]: "var(--font-fraunces)",
  ["--font-band-of-agents-body" as string]: "var(--font-spectral)",
  ["--font-band-of-agents-mono" as string]: "var(--font-martian)",
  // content-pipeline — Anton / Saira / Martian Mono
  ["--font-content-pipeline-display" as string]: "var(--font-anton)",
  ["--font-content-pipeline-body" as string]: "var(--font-saira)",
  ["--font-content-pipeline-mono" as string]: "var(--font-martian)",
  // forge — Big Shoulders / IBM Plex Sans / IBM Plex Mono (Plex reused from site)
  ["--font-forge-display" as string]: "var(--font-bigshoulders)",
  ["--font-forge-body" as string]: "var(--font-sans)",
  ["--font-forge-mono" as string]: "var(--font-mono)",
  // archgraph — Chakra Petch / Hanken Grotesk / Martian Mono
  ["--font-archgraph-display" as string]: "var(--font-chakra)",
  ["--font-archgraph-body" as string]: "var(--font-hanken)",
  ["--font-archgraph-mono" as string]: "var(--font-martian)",
  // omegahack (CAROL) — Libre Caslon Display / Public Sans / IBM Plex Mono
  ["--font-omegahack-display" as string]: "var(--font-librecaslon)",
  ["--font-omegahack-body" as string]: "var(--font-publicsans)",
  ["--font-omegahack-mono" as string]: "var(--font-mono)",
  // localhost-mirror — Sora / Hanken Grotesk / JetBrains Mono
  ["--font-localhost-mirror-display" as string]: "var(--font-sora)",
  ["--font-localhost-mirror-body" as string]: "var(--font-hanken)",
  ["--font-localhost-mirror-mono" as string]: "var(--font-jetbrains)",
  // lumen-frontier — Fraunces / Hanken Grotesk / Space Mono
  ["--font-lumen-frontier-display" as string]: "var(--font-fraunces)",
  ["--font-lumen-frontier-body" as string]: "var(--font-hanken)",
  ["--font-lumen-frontier-mono" as string]: "var(--font-spacemono)",
};

const fontVariables = [
  // site fonts
  archivo.variable,
  plexSans.variable,
  plexMono.variable,
  pixelify.variable,
  instrument.variable,
  // oss per-project families
  martianMono.variable,
  hankenGrotesk.variable,
  jetbrainsMono.variable,
  fraunces.variable,
  spectral.variable,
  anton.variable,
  saira.variable,
  bigShoulders.variable,
  chakraPetch.variable,
  libreCaslonDisplay.variable,
  publicSans.variable,
  sora.variable,
  spaceMono.variable,
].join(" ");

export const metadata: Metadata = {
  metadataBase: new URL("https://pablomanjarres.com"),
  title: "Pablo Manjarres",
  description: "17 y/o solo founder & content creator. Building Noelle.",
  openGraph: {
    title: "Pablo Manjarres",
    description: "17 y/o solo founder & content creator. Building Noelle.",
    url: "https://pablomanjarres.com",
    siteName: "Pablo Manjarres",
    type: "website",
    images: ["/og/home.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pablo Manjarres",
    description: "17 y/o solo founder & content creator. Building Noelle.",
    images: ["/og/home.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontVariables} h-full antialiased`}
      style={ossFontVars}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
