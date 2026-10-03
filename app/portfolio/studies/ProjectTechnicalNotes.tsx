import type { ProjectStudy } from "./data";
import { studyText } from "./case-study";
import { getTechnicalNotes } from "./technical-notes";
import interaction from "@/app/site/interaction.module.css";
import styles from "./project-technical-notes.module.css";

export function ProjectTechnicalNotes({ study }: { study: ProjectStudy }) {
  const notes = getTechnicalNotes(study);
  return <details className={styles.notes}>
    <summary className={interaction.action}>Build details <span>Stack, scope, and implementation</span></summary>
    <div className={styles.content}>
      <div className={styles.specifications}>
        <section aria-label="Technology"><h3>Built with</h3><ul className={styles.labels}>{notes.stack.map(tool => <li key={tool}>{tool}</li>)}</ul></section>
        <section aria-label="Project categories"><h3>Areas</h3><ul className={styles.labels}>{notes.tags.map(tag => <li key={tag}>{tag}</li>)}</ul></section>
      </div>
      {notes.problem && <section className={styles.prose} aria-label="Further problem context"><h3>Problem context</h3><p>{notes.problem}</p></section>}
      {notes.overview.length > 0 && <section className={styles.prose} aria-label="Further project context"><h3>More about the project</h3>{notes.overview.map(paragraph => <p key={paragraph}>{paragraph}</p>)}</section>}
      {notes.highlights.length > 0 && <section aria-label="Additional implementation details"><h3>Implementation notes</h3><ul className={styles.list}>{notes.highlights.map(highlight => <li key={highlight}>{highlight}</li>)}</ul></section>}
      {notes.metrics.length > 0 && <section aria-label="Additional project figures"><h3>Build figures</h3><ul className={styles.list}>{notes.metrics.map(metric => <li key={metric}>{metric}</li>)}</ul></section>}
      {notes.parts.length > 0 && <section aria-label="Additional project components"><h3>Parts of the project</h3><dl className={styles.parts}>{notes.parts.map(part => <div key={part.name}><dt>{studyText(part.name)} <small>{part.kind}</small></dt><dd>{studyText(part.oneLiner)}</dd></div>)}</dl></section>}
    </div>
  </details>;
}
