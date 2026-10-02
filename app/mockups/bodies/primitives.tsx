import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { projects } from "../../projects";
import { profile } from "../../socials";
import type { FeaturedProject } from "./content";
import type { ConceptId } from "../concepts";
import { conceptStudyHref } from "../project-studies/directions";
import localStyles from "./primitives.module.css";
import interaction from "../interaction.module.css";

const styles = { ...localStyles, ...interaction };

export function ProjectLink({ item, className = "", children }: { item: FeaturedProject; className?: string; children: ReactNode }) {
  return <Link href={item.href} className={`${styles.action} ${className}`}>{children}</Link>;
}

export function ProjectVisual({ item, className = "", sizes = "(max-width: 700px) 90vw, 65vw" }: {
  item: FeaturedProject; className?: string; sizes?: string;
}) {
  return <Link href={item.href} className={`${styles.action} ${styles.visual} ${className}`} aria-label={`View ${item.project.title} project`}>
    <Image src={item.preview} alt={`${item.project.title} ${item.previewLabel.toLowerCase()}`} fill sizes={sizes} />
  </Link>;
}

export function BuildingLink({ concept, className = "", children = profile.building }: { concept: ConceptId; className?: string; children?: ReactNode }) {
  const project = projects.find(item => item.title === profile.building);
  if (!project) throw new Error(`Missing current project: ${profile.building}`);
  return <Link href={conceptStudyHref(concept, project.slug)} className={`${styles.action} ${className}`}>{children}</Link>;
}

export function ProjectArchive({ concept, className = "" }: { concept: ConceptId; className?: string }) {
  return <details className={`${styles.archive} ${className}`}>
    <summary className={styles.action}>See all {projects.length} projects <span aria-hidden>+</span></summary>
    <div className={styles.archiveGrid}>{projects.map(project => <Link key={project.slug} href={conceptStudyHref(concept, project.slug)} className={styles.action}><span>{project.title}</span><small>{project.tags[0]}</small></Link>)}</div>
  </details>;
}

export function EmailLink({ subject = "Hello Pablo", className = "", children = profile.email }: { subject?: string; className?: string; children?: ReactNode }) {
  return <a href={`mailto:${profile.email}?subject=${encodeURIComponent(subject)}`} className={`${styles.action} ${className}`}>{children}</a>;
}

export function BookingLink({ className = "", children = "Book a conversation" }: { className?: string; children?: ReactNode }) {
  return <a href={profile.booking} target="_blank" rel="noreferrer" className={`${styles.action} ${className}`}>{children}</a>;
}

export function FooterLinks({ className = "" }: { className?: string }) {
  return <div className={`${styles.footerLinks} ${className}`}><span>{profile.name}</span>
    <nav aria-label="Social profiles">{profile.socials.filter(social => ["gh", "in", "x"].includes(social.id)).map(social => <a key={social.id} href={social.url} target="_blank" rel="noreferrer" className={styles.action}>{social.label}</a>)}</nav>
    <Link href="/mockups" className={styles.action}>Compare the designs</Link>
  </div>;
}
