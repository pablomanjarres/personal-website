import Link from "next/link";
import { profile } from "./socials";

type NavSection = "home" | "portfolio" | "oss";

/**
 * The single, shared top nav used on every page (home, portfolio, oss, and
 * their detail pages). One brand + three links so the header reads the same
 * everywhere. `tone="dark"` remaps the colors for the cinematic /oss pages;
 * `bleed` adds its own horizontal padding for full-bleed layouts that have no
 * padded container of their own.
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
      className="site-nav"
      data-tone={tone}
      data-bleed={bleed ? "true" : undefined}
      aria-label="Primary"
    >
      <Link
        href="/"
        className="site-nav-brand"
        aria-current={active === "home" ? "page" : undefined}
      >
        <span aria-hidden>✦</span> PABLO
      </Link>
      <div className="site-nav-links">
        <Link
          href="/portfolio"
          className="site-nav-link"
          aria-current={active === "portfolio" ? "page" : undefined}
        >
          portfolio
        </Link>
        <Link
          href="/oss"
          className="site-nav-link"
          aria-current={active === "oss" ? "page" : undefined}
        >
          open source
        </Link>
        <a className="site-nav-link" href={profile.booking} target="_blank" rel="noreferrer">
          book a call
        </a>
      </div>
    </nav>
  );
}
