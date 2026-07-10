"use client";

import {
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";
import s from "../portpeek.module.css";

/**
 * The signature PortPeek CTA — a native-macOS push control (glossy system-blue
 * primary, vibrancy ghost) that emits a dependency-free sonar PING ring from its
 * center on strike (pointer or keyboard). The ping is gated on
 * prefers-reduced-motion; the fully-styled control is the static fallback.
 */
export default function ScanButton({
  href,
  variant = "primary",
  external = false,
  ariaLabel,
  style,
  children,
}: {
  href: string;
  variant?: "primary" | "ghost";
  external?: boolean;
  ariaLabel?: string;
  style?: CSSProperties;
  children: ReactNode;
}) {
  const hostRef = useRef<HTMLAnchorElement | null>(null);
  const reduced = useRef(false);
  const alive = useRef(true);

  useEffect(() => {
    reduced.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    return () => {
      alive.current = false;
    };
  }, []);

  const ping = () => {
    const host = hostRef.current;
    if (!host || reduced.current || !alive.current) return;
    const ring = document.createElement("span");
    ring.className = s.ping;
    ring.addEventListener("animationend", () => ring.remove(), { once: true });
    host.appendChild(ring);
  };

  const cls = `${s.btn} ${variant === "ghost" ? s.btnGhost : s.btnPrimary}`;
  const ext = external ? { target: "_blank", rel: "noreferrer" } : {};

  return (
    <a
      ref={hostRef}
      className={cls}
      href={href}
      aria-label={ariaLabel}
      style={style}
      onPointerDown={ping}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") ping();
      }}
      {...ext}
    >
      <span className={s.btnLabel}>{children}</span>
    </a>
  );
}
