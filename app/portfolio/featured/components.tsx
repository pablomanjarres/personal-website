import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { projects } from "@/app/projects";
import { profile } from "@/app/socials";
import type { FeaturedProject } from "./content";
import { StudyMedia } from "../studies/primitives";
import localStyles from "./components.module.css";
import interaction from "@/app/site/interaction.module.css";

const styles = { ...localStyles, ...interaction };

export function ProjectLink({ item, className = "", children }: { item: FeaturedProject; className?: string; children: ReactNode }) {
  return <Link href={item.href} className={`${styles.action} ${className}`}>{children}</Link>;
}

export function ProjectVisual({ item, className = "", sizes = "(max-width: 700px) 90vw, 65vw" }: {
  item: FeaturedProject; className?: string; sizes?: string;
}) {
  return <Link href={item.href} className={`${styles.action} ${styles.visual} ${className}`} aria-label={`View ${item.project.title} project`} data-media-kind={item.preview.kind} style={{ "--media-aspect-ratio": `${item.preview.width} / ${item.preview.height}` } as CSSProperties}>
    <StudyMedia asset={item.preview} caption={false} sizes={sizes} />
  </Link>;
}

export function BuildingLink({ href, className = "", children = profile.building }: { href: string; className?: string; children?: ReactNode }) {
  return <Link href={href} className={`${styles.action} ${className}`}>{children}</Link>;
}

export function ProjectArchive({ projectHref, className = "" }: { projectHref: (slug: string) => string; className?: string }) {
  return <details className={`${styles.archive} ${className}`}>
    <summary className={styles.action}>See all {projects.length} projects <span aria-hidden>+</span></summary>
    <div className={styles.archiveGrid}>{projects.map(project => <Link key={project.slug} href={projectHref(project.slug)} className={styles.action}><span>{project.title}</span><small>{project.tags[0]}</small></Link>)}</div>
  </details>;
}

export function EmailLink({ subject = "Hello Pablo", className = "", children = profile.email }: { subject?: string; className?: string; children?: ReactNode }) {
  return <a href={`mailto:${profile.email}?subject=${encodeURIComponent(subject)}`} className={`${styles.action} ${className}`}>{children}</a>;
}

export function BookingLink({ className = "", children = "Book a conversation" }: { className?: string; children?: ReactNode }) {
  return <a href={profile.booking} target="_blank" rel="noreferrer" className={`${styles.action} ${className}`}>{children}</a>;
}

export function FooterLinks({ className = "", destination = { href: "/portfolio", label: "All projects" } }: { className?: string; destination?: { href: string; label: string } }) {
  return <div className={`${styles.footerLinks} ${className}`}><span>{profile.name}</span>
    <nav aria-label="Social profiles">{profile.socials.filter(social => ["gh", "in", "x"].includes(social.id)).map(social => <a key={social.id} href={social.url} target="_blank" rel="noreferrer" className={styles.action}>{social.label}</a>)}</nav>
    <Link href={destination.href} className={styles.action}>{destination.label}</Link>
  </div>;
}
