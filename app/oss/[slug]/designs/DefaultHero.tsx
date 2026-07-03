import Link from "next/link";
import type { Hero } from "../../heroes";

// The original shared /oss/<slug> template, extracted verbatim so every slug
// without a bespoke design (and every bespoke stub, for now) renders exactly as
// before. Styling lives in the global app/oss/oss.css (.osh-*). Shared file —
// do NOT edit as part of a per-project redesign.
export default function DefaultHero({
  hero,
  slug,
}: {
  hero: Hero;
  slug: string;
}) {
  const h = hero;

  return (
    <main className="osh" style={{ ["--bg" as string]: `url('/oss/${slug}.png')` }}>
      <div className="osh-bg" />
      <div className="osh-scrim" />

      <nav className="osh-bar">
        <Link className="osh-brand" href="/">
          <b>✦</b> Pablo
        </Link>
        <div className="osh-nav">
          <Link href="/oss">Open source</Link>
          <Link href="/portfolio">Portfolio</Link>
          <a href={h.repo} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </div>
      </nav>

      <section className="osh-inner">
        <div className="osh-kicker">{h.kicker}</div>
        <h1 className="osh-title">
          <span className="lead">{h.titleLead}</span>
          <br />
          <span className="main">{h.titleMain}</span>
        </h1>
        <p className="osh-sub">{h.subtitle}</p>
        <p className="osh-note">{h.note}</p>
        <div className="osh-cta">
          <a className="osh-btn primary" href={h.repo} target="_blank" rel="noreferrer">
            ★ Star on GitHub
          </a>
          {h.live && (
            <a className="osh-btn ghost" href={h.live} target="_blank" rel="noreferrer">
              Live demo ↗
            </a>
          )}
          <a
            className="osh-btn ghost"
            href={`https://pablomanjarres.com/portfolio/projects/${slug}`}
          >
            Write-up
          </a>
        </div>
      </section>

      <footer className="osh-foot">
        <span>{h.oss ? "MIT LICENSED" : "SOURCE AVAILABLE"}</span>
        <span>© 2026 Pablo Manjarres</span>
      </footer>
    </main>
  );
}
