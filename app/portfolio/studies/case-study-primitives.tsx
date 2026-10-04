import Link from "next/link";
import { STATUS_LABEL } from "@/app/portfolio/status";
import interaction from "@/app/site/interaction.module.css";
import { getCaseStudy } from "./case-study";
import { getStudyPreview, type ProjectStudy } from "./data";
import { StudyMedia } from "./primitives";
import styles from "./case-study-primitives.module.css";

type StudyProps = { study: ProjectStudy; className?: string };

export function StudyBrief({ study, className = "" }: StudyProps) {
  const story = getCaseStudy(study);
  const facts = [
    ["Role", study.project.role.replace("Solo · design + engineering", "Product design and engineering").replace("Sole developer · client work", "Sole developer, client work")],
    ["Year", study.project.year], ["Platform", story.platform], ["Status", STATUS_LABEL[study.project.status]],
  ];
  return <dl className={`${styles.brief} ${className}`}>{facts.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
}

export function StudyMeasures({ study, className = "" }: StudyProps) {
  const { measures } = getCaseStudy(study);
  if (!measures.length) return null;
  return <dl className={`${styles.measures} ${className}`}>{measures.map(measure => <div key={`${measure.value}-${measure.label}`}><dt>{measure.value ? measure.label : "Build detail"}</dt><dd data-prose={!measure.value || undefined}>{measure.value || measure.label}</dd></div>)}</dl>;
}

export function StudyDecisions({ study, className = "" }: StudyProps) {
  return <div className={`${styles.decisions} ${className}`}>{getCaseStudy(study).decisions.map(decision => <article key={decision.title + decision.body}><h3>{decision.title}</h3><p>{decision.body}</p></article>)}</div>;
}

export function StudyFlow({ study, className = "" }: StudyProps) {
  const { flow } = getCaseStudy(study);
  if (!flow.length) return null;
  return <ol className={`${styles.flow} ${className}`}>{flow.map(step => <li key={step.title}><strong>{step.title}</strong><p>{step.body}</p></li>)}</ol>;
}

export function StudyComponents({ study, className = "" }: StudyProps) {
  return <div className={`${styles.components} ${className}`}>{getCaseStudy(study).components.map(component => <article key={component.name}><h3>{component.name}</h3>{component.kind && <small>{component.kind}</small>}<p>{component.body}</p></article>)}</div>;
}

export function StudyProductVisual({ study, className = "", priority = false, caption = true, sizes = "(max-width: 700px) 90vw, 46vw" }: StudyProps & { priority?: boolean; caption?: boolean; sizes?: string }) {
  return <StudyMedia asset={getStudyPreview(study)} className={className} priority={priority} caption={caption} sizes={sizes} />;
}

export function StudyBack({ indexHref = "/portfolio", className = "" }: { indexHref?: string; className?: string }) {
  return <Link href={indexHref} className={`${interaction.action} ${styles.back} ${className}`}><span aria-hidden>←</span> All projects</Link>;
}
