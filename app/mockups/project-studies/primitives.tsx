import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { STATUS_LABEL } from "../../portfolio/status";
import { LiveEmbed } from "../../portfolio/LiveEmbed";
import { studyHref, type ProjectStudy, type StudyAsset, type StudyDirectionId } from "./data";
import { StudyVideo } from "./video";
import localStyles from "./primitives.module.css";
import interaction from "../interaction.module.css";

const styles = { ...localStyles, ...interaction };

export function StudyMedia({ asset, className = "", priority = false, detail = false, caption = true, sizes = "(max-width: 700px) 94vw, 90vw" }: { asset: StudyAsset; className?: string; priority?: boolean; detail?: boolean; caption?: boolean; sizes?: string }) {
  return <figure className={`${styles.media} ${className}`} data-media-kind={asset.kind}>
    {asset.kind === "video" ? <StudyVideo asset={asset} /> : <Image src={asset.src} alt={detail ? `Detail of ${asset.alt}` : asset.alt} width={asset.width} height={asset.height} sizes={sizes} preload={priority} />}
    {caption && <figcaption>{detail ? `Detail of ${asset.label.toLowerCase()}` : asset.label}</figcaption>}
  </figure>;
}

export function StudyDemo({ study, className = "" }: { study: ProjectStudy; className?: string }) {
  if (!study.project.embedUrl) return null;
  return <section className={`${styles.demo} ${className}`} aria-label={`${study.project.title} demo`}><LiveEmbed embedUrl={study.project.embedUrl} cover={study.media[0].src} title={study.project.title} className={interaction.action} /><p>Interactive demo</p></section>;
}

export function StudyLink({ study, direction, children, className = "" }: { study: ProjectStudy; direction: StudyDirectionId; children: ReactNode; className?: string }) {
  return <Link href={studyHref(direction, study.project.slug)} className={`${styles.action} ${className}`}>{children}</Link>;
}

export function StudyFacts({ study, className = "" }: { study: ProjectStudy; className?: string }) {
  const project = study.project;
  return <details className={`${styles.facts} ${className}`}><summary className={styles.action}>Project facts <span aria-hidden>+</span></summary><dl><div><dt>Role</dt><dd>{project.role}</dd></div><div><dt>Year</dt><dd>{project.year}</dd></div><div><dt>Status</dt><dd>{STATUS_LABEL[project.status]}</dd></div><div><dt>Built with</dt><dd>{project.stack.slice(0, 5).join(" / ")}</dd></div></dl></details>;
}

export function StudyActions({ study, className = "" }: { study: ProjectStudy; className?: string }) {
  return <nav className={`${styles.actions} ${className}`} aria-label={`${study.project.title} links`}>{study.project.links.slice(0, 4).map(link => <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className={styles.action}>{link.label}<span aria-hidden> ↗</span></a>)}</nav>;
}

export function StudyNext({ study, direction, className = "" }: { study: ProjectStudy; direction: StudyDirectionId; className?: string }) {
  return <StudyLink study={study} direction={direction} className={`${styles.next} ${className}`}><span>Next project</span><strong>{study.project.title}</strong><span aria-hidden>↗</span></StudyLink>;
}
