import Image from "next/image";
import Link from "next/link";
import { projects, getProject, type Project } from "../projects";
import { Status } from "../portfolio/components";
import type { WorkLayout } from "./concepts";
import styles from "./work.module.css";

const selected = ["noelle", "construcredit", "nella", "cortex"].map(slug => getProject(slug)!);

function WorkCard({ project, index, layout }: { project: Project; index: number; layout: WorkLayout }) {
  return (
    <Link className={styles.card} href={`/portfolio/projects/${project.slug}`} data-reveal>
      <div className={styles.image}>
        {layout === "browser" && <div className={styles.browserBar}><span aria-hidden>● ● ●</span><span>{project.title}</span><span aria-hidden>↗</span></div>}
        {project.cover && <Image src={project.cover} alt={`${project.title} product preview`} fill sizes="(max-width: 700px) 90vw, 70vw" />}
        <span className={styles.number} aria-hidden>{String(index + 1).padStart(2, "0")}</span>
        <span className={styles.open} aria-hidden>↗</span>
      </div>
      <div className={styles.body}>
        <span className={styles.category}>{project.tags[0]}</span>
        <div className={styles.title}><h3>{project.title}</h3><Status status={project.status} /></div>
        <p>{project.oneLiner}</p><span className={styles.role}>{project.role}</span>
        <span className={styles.read}>View project <span aria-hidden>↗</span></span>
      </div>
    </Link>
  );
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
    <section id="work" className={styles.work} data-layout={layout}>
      <div className={styles.heading} data-reveal><span className={styles.label}>Selected work / 01 to 04</span><h2>{title}</h2><p>AI agents, lending software,<br />developer tools, and a personal dashboard.</p></div>
      <div className={styles.grid}>{selected.map((project, index) => <WorkCard key={project.slug} project={project} index={index} layout={layout} />)}</div>
      <ProjectArchive />
    </section>
  );
}
