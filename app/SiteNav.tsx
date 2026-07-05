"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, type CSSProperties } from "react";
import { profile } from "./socials";

type NavSection = "home" | "portfolio" | "oss";

// ---- per-letter split primitive -------------------------------------------
// Renders text as position-indexed inline-block glyphs so CSS calc() can
// stagger them. The wrapper is aria-hidden; the accessible label is supplied
// by the parent (aria-label on the nav link, or a visually-hidden sibling).
// Shared with the atelier hero, which imports SplitChars for its headline.
function charStyle(i: number, scatter: boolean): CSSProperties {
  if (!scatter) return { ["--i" as string]: String(i) };
  // deterministic pseudo-random scatter (same on server + client -> no
  // hydration mismatch) for the hero "explode" reassembly.
  return {
    ["--i" as string]: String(i),
    ["--tx" as string]: `${(Math.sin(i * 12.9898) * 40).toFixed(1)}px`,
    ["--ty" as string]: `${(-16 - Math.abs(Math.cos(i * 3.7)) * 34).toFixed(1)}px`,
    ["--rot" as string]: `${(Math.sin(i * 5.3) * 36).toFixed(1)}deg`,
  };
}

export function SplitChars({ text, scatter = false }: { text: string; scatter?: boolean }) {
  return (
    <span className="at-split" aria-hidden>
      {[...text].map((ch, i) => (
        <span key={i} className="at-char" style={charStyle(i, scatter)}>
          {ch}
        </span>
      ))}
    </span>
  );
}

// ---- brand mark: PABLO decrypts on hover, the ✦ spins (reform / scramble) --
// Hand-rolled requestAnimationFrame char-cycling (soulwire technique) — zero
// deps. Honors prefers-reduced-motion and fires on focus for keyboard users.
const SCRAMBLE = "!<>-_\\/[]{}=+*#?◇✶✦·";
function BrandMark() {
  const word = useRef<HTMLSpanElement>(null);
  const raf = useRef(0);
  const run = useCallback(() => {
    const el = word.current;
    if (!el) return;
    const text = "PABLO";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.textContent = text;
      return;
    }
    const t0 = performance.now();
    const dur = 620;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const lock = Math.floor(p * text.length);
      el.textContent = [...text]
        .map((c, i) => (i < lock ? c : SCRAMBLE[(Math.random() * SCRAMBLE.length) | 0]))
        .join("");
      if (p < 1) raf.current = requestAnimationFrame(step);
      else el.textContent = text;
    };
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(step);
  }, []);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return (
    <Link
      href="/"
      className="topnav-brand"
      aria-label="Pablo, home"
      onMouseEnter={run}
      onFocus={run}
    >
      <span aria-hidden className="brand-star">
        ✦
      </span>{" "}
      <span aria-hidden className="brand-word" ref={word}>
        PABLO
      </span>
    </Link>
  );
}

/**
 * The single, shared top nav used across the site chrome (home, portfolio,
 * oss index, and the oss detail fallback). Renders the same brand + three links
 * everywhere, reusing the `.topnav` styles so every page keeps the same hover
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
      <BrandMark />
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
