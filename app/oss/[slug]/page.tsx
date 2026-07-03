import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getHero, heroes } from "../heroes";

export const dynamicParams = false;

export function generateStaticParams() {
  return heroes.map((h) => ({ slug: h.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const h = getHero(slug);
  if (!h) return { title: "Not found" };
  const title = `${h.title} — ${h.titleLead} ${h.titleMain}`;
  return {
    title,
    description: h.subtitle,
    openGraph: {
      title,
      description: h.subtitle,
      url: `https://pablomanjarres.com/oss/${h.slug}`,
      images: [`/oss/${h.slug}.png`],
      type: "website",
    },
  };
}

export default async function OssHero({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const h = getHero(slug);
  if (!h) notFound();

  return (
    <main className="osh" style={{ ["--bg" as string]: `url('/oss/${slug}.png')` }}>
      <div className="osh-bg" />
      <div className="osh-scrim" />

      <nav className="osh-bar">
        <Link className="osh-brand" href="/oss">
          <b>◈</b> {h.title}
        </Link>
        <div className="osh-nav">
          <a href={h.repo} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
          <Link href="/portfolio">Portfolio</Link>
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
