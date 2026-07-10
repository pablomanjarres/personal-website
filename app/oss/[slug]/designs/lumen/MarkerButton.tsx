"use client";

import type { CSSProperties, ReactNode } from "react";
import s from "../lumen.module.css";

/**
 * The signature Lumen CTA — a felt-marker button. On hover/focus a hand-drawn
 * rounded-rect border inks itself on (SVG stroke-dashoffset), a highlighter
 * swipe wipes in behind the label, two marker-cap nibs light at the corners,
 * and the whole slab lifts + tilts a hair like a pen lifted off the page; on
 * press it dips back down. The base state is a finished, fully-legible button
 * (solid slab or paper keepline), and all motion lives inside
 * prefers-reduced-motion:no-preference, so the reduced state is static + inked.
 */
export default function MarkerButton({
  href,
  external,
  ghost,
  color = "navy",
  style,
  children,
}: {
  href: string;
  external?: boolean;
  ghost?: boolean;
  color?: "navy" | "blue" | "teal" | "red";
  style?: CSSProperties;
  children: ReactNode;
}) {
  const rel = external ? "noreferrer" : undefined;
  const target = external ? "_blank" : undefined;

  return (
    <a
      className={`${s.mbtn} ${ghost ? s.mbtnGhost : s.mbtnSolid}`}
      data-color={color}
      href={href}
      target={target}
      rel={rel}
      style={style}
    >
      <span className={s.mbtnSwipe} aria-hidden="true" />
      <span className={s.mbtnLabel}>{children}</span>
      <svg
        className={s.mbtnInk}
        viewBox="0 0 200 64"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        {/* a deliberately-wobbly rounded rect so the outline reads as marker ink */}
        <path
          className={s.mbtnStroke}
          d="M13 7 C 62 3.5, 150 3.5, 189 8 C 196.5 22, 196.5 43, 188 57 C 139 61, 54 61, 12 56.5 C 4 42, 4.5 20, 13 7 Z"
          pathLength={1}
        />
      </svg>
      <i className={`${s.mbtnCap} ${s.capA}`} aria-hidden="true" />
      <i className={`${s.mbtnCap} ${s.capB}`} aria-hidden="true" />
    </a>
  );
}
