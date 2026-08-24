import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import { heroes } from "./heroes";
import { SiteNav } from "../SiteNav";

export const metadata: Metadata = {
  title: "Open source — Pablo Manjarres",
  description: "Projects I build in the open. Each one has a page.",
};

// The /oss hero art is large bespoke art and lands per slug. When a slug does not
// have one yet the card used to render with no background at all, so fall back to
// the portfolio preview screenshot, which every slug does have.
function cardArt(slug: string): string | null {
  const pub = path.join(process.cwd(), "public");
  const candidates = [`/oss/${slug}.png`, `/portfolio/previews/${slug}.png`];
  for (const rel of candidates) {
    if (fs.existsSync(path.join(pub, rel))) return rel;
  }
  return null;
}

export default function OssIndex() {
  return (
    <main className="osh-index">
      <SiteNav active="oss" tone="dark" />
      <h1 className="osh-ix-title">
        <span className="lead">Open</span> source.
      </h1>
      <p className="osh-ix-sub">Projects I build in the open. Each one has a page.</p>
      <div className="osh-grid">
        {heroes.map((h) => {
          const art = cardArt(h.slug);
          return (
          <Link
            key={h.slug}
            href={`/oss/${h.slug}`}
            className="osh-card"
            style={art ? { ["--bg" as string]: `url('${art}')` } : undefined}
          >
            <div className="osh-card-bg" />
            <div className="osh-card-scrim" />
            <div className="osh-card-in">
              <span className="osh-card-k">{h.kicker}</span>
              <span className="osh-card-t">{h.title}</span>
              <span className="osh-card-d">
                {h.titleLead} {h.titleMain}
              </span>
            </div>
          </Link>
          );
        })}
      </div>
      <footer className="osh-foot" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span>MIT LICENSED</span>
        <span>© 2026 Pablo Manjarres</span>
      </footer>
    </main>
  );
}
