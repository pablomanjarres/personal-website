import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { projects, type Project } from "../projects";
import { profile } from "../socials";
import { Status } from "../portfolio/components";
import type { Concept, WorkLayout } from "./concepts";
import styles from "./mockups.module.css";

export function MockupShell({ concept, children }: { concept: Concept; children: ReactNode }) {
  const tokens = {
    "--paper": concept.paper, "--ink": concept.ink, "--accent": concept.accent,
    "--panel": concept.panel, "--display": "var(--font-display)",
  } as CSSProperties;
  return (
    <div className={styles.shell} style={tokens} data-concept={concept.id}>
      <a href="#main" className={styles.skip}>Skip to content</a>
      <header className={styles.nav}>
        <a href="#main" className={styles.brand} aria-label="Pablo Manjarres, home">pm<span aria-hidden>.</span></a>
        <nav aria-label="Main navigation"><a href="#work">Work</a><a href="#about">About</a><a href="#contact">Contact</a></nav>
        <a className={styles.navContact} href={profile.booking} target="_blank" rel="noreferrer">Let’s talk <span aria-hidden>↗</span></a>
      </header>
      <main id="main">{children}</main>
    </div>
  );
}

export function Portrait({ portrait, className, preload = true, alt = "Pablo Manjarres" }: {
  portrait: "forest" | "teal" | "denim" | "hoodie"; className?: string; preload?: boolean; alt?: string;
}) {
  return <Image src={`/mockups/portraits/${portrait}.webp`} alt={alt} width={1122} height={1402} sizes="(max-width: 700px) 90vw, 50vw" preload={preload} className={`${styles.portrait} ${className ?? ""}`} />;
}

export function ActionLinks({ className = "" }: { className?: string }) {
  return <div className={`${styles.actions} ${className}`}><a className={styles.primary} href="#work">Explore my work <span aria-hidden>↘</span></a><a className={styles.secondary} href={`mailto:${profile.email}`}>Get in touch</a></div>;
}

export function RoleSummary({ className = "" }: { className?: string }) {
  return <p className={`${styles.roles} ${className}`}>{profile.roles.map(role => <span key={role}>{role}</span>)}</p>;
}

const selectedSlugs = ["noelle", "construcredit", "nella", "cortex"];
const selected = selectedSlugs.map(slug => projects.find(project => project.slug === slug)!);

function WorkCard({ project }: { project: Project }) {
  return (
    <Link className={styles.workCard} href={`/portfolio/projects/${project.slug}`}>
      <div className={styles.workImage}>
        {project.cover && <Image src={project.cover} alt={`${project.title} product preview`} fill sizes="(max-width: 700px) 90vw, 50vw" />}
        <span className={styles.openIcon} aria-hidden>↗</span>
      </div>
      <div className={styles.workBody}>
        <div className={styles.workTitle}><h3>{project.title}</h3><Status status={project.status} /></div>
        <p>{project.oneLiner}</p><span className={styles.workRole}>{project.role}</span>
      </div>
    </Link>
  );
}

export function WorkSection({ layout, title = "A few things I’ve built." }: { layout: WorkLayout; title?: string }) {
  return (
    <section id="work" className={styles.work} data-layout={layout}>
      <div className={styles.sectionHeading}><h2>{title}</h2><p>Real products. From the first idea<br />to the details that make them work.</p></div>
      <div className={styles.workGrid}>{selected.map(project => <WorkCard key={project.slug} project={project} />)}</div>
      <details className={styles.archive}>
        <summary>Explore all {projects.length} projects <span aria-hidden>+</span></summary>
        <div className={styles.archiveGrid}>{projects.map(project => <Link key={project.slug} href={`/portfolio/projects/${project.slug}`}><span>{project.title}</span><span>{project.tags[0]}</span><span aria-hidden>↗</span></Link>)}</div>
      </details>
    </section>
  );
}

const capabilities = [
  { title: "AI products", text: "Agent workflows, retrieval, and tools that keep people in control.", examples: "Noelle / Nella" },
  { title: "Full-stack systems", text: "Web products, APIs, and the infrastructure that keeps them running.", examples: "ConstruCredit / Cortex" },
  { title: "Developer tools", text: "Practical software for the people building the next thing.", examples: "Nella / Forge" },
];

export function AboutSection() {
  return (
    <section id="about" className={styles.about}>
      <div className={styles.aboutIntro}><span className={styles.smallLabel}>Engineering. Design. Entrepreneurship.</span><h2>I turn ambitious ideas into products people can use.</h2><p>I’m Pablo, a {profile.roles.slice(0, -1).join(", ")}, and {profile.roles.at(-1)}. I work across AI agents, web products, and developer tools, connecting the product decisions, the interface, and the systems behind them.</p><a href="https://trynoelle.com" target="_blank" rel="noreferrer">Currently building Noelle <span aria-hidden>↗</span></a></div>
      <div className={styles.capabilities}>{capabilities.map(item => <div key={item.title}><h3>{item.title}</h3><p>{item.text}</p><span>{item.examples}</span></div>)}</div>
    </section>
  );
}

export function ContactSection() {
  return (
    <footer id="contact" className={styles.contact}>
      <div className={styles.contactTop}><span>Have something in mind?</span><span>Let’s build it together.</span></div>
      <h2>Good work starts<br />with a conversation.</h2>
      <div className={styles.contactActions}><a href={`mailto:${profile.email}`}>{profile.email} <span aria-hidden>↗</span></a><a href={profile.booking} target="_blank" rel="noreferrer">Book a call <span aria-hidden>↗</span></a></div>
      <div className={styles.footer}><span>{profile.name}</span><div>{profile.socials.filter(social => ["gh", "in", "x"].includes(social.id)).map(social => <a key={social.id} href={social.url} target="_blank" rel="noreferrer">{social.label}</a>)}</div><Link href="/mockups">Compare the designs</Link></div>
    </footer>
  );
}
