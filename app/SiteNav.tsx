"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { SiteMark } from "./site/components";
import { profile } from "./socials";

type NavSection = "home" | "portfolio" | "oss";

// ---- per-letter split primitive -------------------------------------------
// Renders text as position-indexed inline-block glyphs so CSS calc() can
// stagger them. The wrapper is aria-hidden; the accessible label is supplied
// by the parent (aria-label on the nav link, or a visually-hidden sibling).
function SplitChars({ text }: { text: string }) {
  return (
    <span className="at-split" aria-hidden>
      {[...text].map((ch, i) => (
        <span key={i} className="at-char" style={{ ["--i" as string]: String(i) } as CSSProperties}>
          {ch}
        </span>
      ))}
    </span>
  );
}

/**
 * Shared navigation for the OSS index and detail fallback. Renders the
 * same brand and three links, reusing `.topnav` styles for the same hover
 * signatures. `tone="dark"` remaps the palette for the cinematic /oss pages;
 * `bleed` adds horizontal padding for full-bleed layouts with no padded
 * container of their own; `active` marks the current section.
 */
export function SiteNav({
  active,
  tone = "light",
  bleed = false,
}: {
  active?: NavSection;
  tone?: "light" | "dark";
  bleed?: boolean;
}) {
  return (
    <nav
      className="topnav"
      data-tone={tone}
      data-bleed={bleed ? "true" : undefined}
      aria-label="Primary"
    >
      <SiteMark href="/" className="topnav-brand" />
      <div className="topnav-links">
        <Link
          href="/portfolio"
          className="topnav-link topnav-link--portfolio"
          aria-label="portfolio"
          aria-current={active === "portfolio" ? "page" : undefined}
        >
          <SplitChars text="portfolio" />
        </Link>
        <Link
          href="/oss"
          className="topnav-link topnav-link--oss"
          aria-current={active === "oss" ? "page" : undefined}
        >
          open source
        </Link>
        <a
          className="topnav-link topnav-link--call"
          href={profile.booking}
          target="_blank"
          rel="noreferrer"
        >
          book a call
        </a>
      </div>
    </nav>
  );
}
