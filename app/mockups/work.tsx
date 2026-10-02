import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { projects, getProject, type Project } from "../projects";
import { Status } from "../portfolio/components";
import type { WorkLayout } from "./concepts";
import styles from "./work.module.css";

type ProjectNote = { slug: string; problem: string; product: string; note: string; scope: string[]; artwork?: string; color: string };
const selected: ProjectNote[] = [
  { slug: "noelle", problem: "Audience research and drafting take time.", product: "AI agents research people and queue drafts for human approval.", note: "Approval stays with the person.", scope: ["Agent dashboard", "Draft review", "Worker system"], artwork: "/oss/noelle.png", color: "#e6decb" },
  { slug: "construcredit", problem: "A lender needs dependable balances and a clear approval trail.", product: "Applications, client records, payments, and staff tools for a Colombian lender.", note: "Business rules belong in the software.", scope: ["Public website", "Staff panel", "Lending engine"], color: "#c5ddda" },
  { slug: "nella", problem: "Coding agents need the actual code and earlier decisions.", product: "Code search, persistent memory, and coordination through MCP and a CLI.", note: "Context should come from the code.", scope: ["Code search", "Agent memory", "MCP + CLI"], artwork: "/oss/nella.png", color: "#ccd7d0" },
  { slug: "cortex", problem: "Daily work lives across too many tools.", product: "An encrypted desktop dashboard for focus, habits, coursework, and finances.", note: "Private records, kept together.", scope: ["Desktop app", "Local encryption", "Agent access"], color: "#d7d0eb" },
];

function ProjectMedia({ project, note, layout }: { project: Project; note: ProjectNote; layout: WorkLayout }) {
  const device = layout === "browser";
  const layered = layout === "stack" || layout === "chapters";
  const preview = project.slug === "nella" ? "/portfolio/covers/nella.png" : project.cover;
  const source = !device && note.artwork ? note.artwork : preview;
  const previewLabel = project.slug === "nella" ? "Product illustration" : project.slug === "cortex" ? "Desktop dashboard" : "Public website";
  const caption = note.artwork && !device ? layered ? "Project artwork + product preview" : "Project artwork" : previewLabel;
  return (
    <div className={styles.media} style={{ "--product-color": note.color } as CSSProperties}>
      <Link className={styles.mediaLink} href={`/portfolio/projects/${project.slug}`} aria-label={`View ${project.title} project`}>
        <div className={styles.screen}>
          {device && <span className={styles.camera} aria-hidden />}
          {source && <Image src={source} alt={note.artwork && !device ? `${project.title} project artwork` : `${project.title} ${previewLabel.toLowerCase()}`} fill sizes="(max-width: 700px) 90vw, 70vw" />}
        </div>
        {device && <span className={styles.keyboard} aria-hidden><i /></span>}
        {layered && preview && <span className={styles.detail} aria-hidden><Image src={preview} alt="" fill sizes="(max-width: 700px) 45vw, 24vw" /></span>}
        <span className={styles.open} aria-hidden>View project ↗</span>
      </Link>
      <span className={styles.mediaCaption}>{caption}</span>
    </div>
  );
}

function ProjectMeta({ project, note, layout }: { project: Project; note: ProjectNote; layout: WorkLayout }) {
  const dossier = layout === "chapters";
  return (
    <div className={styles.body}>
      <div className={styles.meta}><span>{project.tags[0]}</span><Status status={project.status} /><span>{project.year}</span></div>
      <h3><Link href={`/portfolio/projects/${project.slug}`}>{project.title}</Link></h3>
      <p className={styles.role}>{project.role}</p>
      {dossier ? <dl className={styles.story}><div><dt>The need</dt><dd>{note.problem}</dd></div><div><dt>What I built</dt><dd>{note.product}</dd></div></dl> : <p className={styles.description}>{note.product}</p>}
      <ul className={styles.scope} aria-label="Project scope">{note.scope.map(item => <li key={item}>{item}</li>)}</ul>
      <p className={styles.annotation}>{note.note}</p>
      <Link className={styles.read} href={`/portfolio/projects/${project.slug}`}>Read the project <span aria-hidden>↗</span></Link>
    </div>
  );
}

function WorkCard({ note, layout }: { note: ProjectNote; layout: WorkLayout }) {
  const project = getProject(note.slug)!;
  return <article className={styles.card} data-project={project.slug} data-reveal><ProjectMedia project={project} note={note} layout={layout} /><ProjectMeta project={project} note={note} layout={layout} /></article>;
}

function ProjectArchive() {
  return (
    <details className={styles.archive}>
      <summary>See all {projects.length} projects <span aria-hidden>+</span></summary>
      <div className={styles.archiveGrid}>{projects.map(project => <Link key={project.slug} href={`/portfolio/projects/${project.slug}`}><span>{project.title}</span><span>{project.tags[0]}</span><span aria-hidden>↗</span></Link>)}</div>
    </details>
  );
}

export function WorkSection({ layout, title = "A few things I’ve built." }: { layout: WorkLayout; title?: string }) {
  return (
    <section id="work" className={styles.work} data-layout={layout} aria-labelledby={`work-${layout}`}>
      <div className={styles.heading} data-reveal><h2 id={`work-${layout}`}>{title}</h2><p>Four products. Different needs.<br />Design and engineering, together.</p></div>
      <div className={styles.grid}>{selected.map(note => <WorkCard key={note.slug} note={note} layout={layout} />)}</div>
      <ProjectArchive />
    </section>
  );
}
