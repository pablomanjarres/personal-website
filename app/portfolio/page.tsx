import type { Metadata } from "next";
import Link from "next/link";
import { projects } from "../projects";
import { profile } from "../socials";
import { ProjectCard } from "./components";
import { SiteNav } from "../SiteNav";

export const metadata: Metadata = {
  title: "Work — Pablo Manjarres",
  description:
    "Selected projects by Pablo Manjarres: AI agents, developer tools, and products. Noelle, Nella, Cortex, and more.",
  openGraph: {
    title: "Work — Pablo Manjarres",
    description:
      "Selected projects: AI agents, developer tools, and products built solo.",
    url: "https://pablomanjarres.com/portfolio",
    type: "website",
  },
};

export default function PortfolioIndex() {
  const count = projects.length;
  return (
    <div className="folio-inner">
      <SiteNav active="portfolio" />
      <header className="folio-head">
        <span className="who">Notebook № 8 · Work · pablomanjarres</span>
        <span>
          index · {count} {count === 1 ? "work" : "works"}
        </span>
      </header>

      <section className="folio-hero">
        <div className="folio-kicker">¶ 03 · Work</div>
        <h1 className="folio-title">
          Selected
          <br />
          <span className="accent">work.</span>
        </h1>
        <p className="folio-lede">
          Things I&apos;ve designed and built, mostly solo: AI agents that run like a
          company, developer tools, and a few products that shipped. Each plate opens
          to the full story.
        </p>
        <div className="folio-count">
          ✶ pull a plate — every project has a page, source, and where it lives
        </div>
        <a className="folio-cta" href={profile.booking} target="_blank" rel="noreferrer">
          <span aria-hidden>✦</span> Book a call
          <span className="folio-cta-arr" aria-hidden>
            ↗
          </span>
        </a>
      </section>

      <section className="folio-grid">
        {projects.map((p) => (
          <ProjectCard key={p.slug} project={p} />
        ))}
      </section>

      <footer className="folio-foot">
        <Link href="/">← back to the poster</Link>
        <a href={profile.booking} target="_blank" rel="noreferrer">
          book a call ↗
        </a>
        <span>pg. 016 / D · pablomanjarres.com</span>
      </footer>
    </div>
  );
}
