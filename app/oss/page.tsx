import type { Metadata } from "next";
import Link from "next/link";
import { heroes } from "./heroes";
import { SiteNav } from "../SiteNav";

export const metadata: Metadata = {
  title: "Open source — Pablo Manjarres",
  description: "Projects I build in the open. Each one has a page.",
};

export default function OssIndex() {
  return (
    <main className="osh-index">
      <SiteNav active="oss" tone="dark" />
      <h1 className="osh-ix-title">
        <span className="lead">Open</span> source.
      </h1>
      <p className="osh-ix-sub">Projects I build in the open. Each one has a page.</p>
      <div className="osh-grid">
        {heroes.map((h) => (
          <Link
            key={h.slug}
            href={`/oss/${h.slug}`}
            className="osh-card"
            style={{ ["--bg" as string]: `url('/oss/${h.slug}.png')` }}
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
        ))}
      </div>
      <footer className="osh-foot" style={{ paddingLeft: 0, paddingRight: 0 }}>
        <span>MIT LICENSED</span>
        <span>© 2026 Pablo Manjarres</span>
      </footer>
    </main>
  );
}
