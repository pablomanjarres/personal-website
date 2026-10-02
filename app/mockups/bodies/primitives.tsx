import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { projects } from "../../projects";
import { profile } from "../../socials";
import type { FeaturedProject } from "./content";
import styles from "./primitives.module.css";

export function ProjectLink({ item, className, children }: { item: FeaturedProject; className?: string; children: ReactNode }) {
  return <Link href={`/portfolio/projects/${item.project.slug}`} className={className}>{children}</Link>;
}

export function ProjectVisual({ item, source = "preview", className = "", sizes = "(max-width: 700px) 90vw, 65vw" }: {
  item: FeaturedProject; source?: "preview" | "artwork"; className?: string; sizes?: string;
}) {
  const artwork = source === "artwork" && item.artwork;
  return <Link href={`/portfolio/projects/${item.project.slug}`} className={`${styles.visual} ${className}`} aria-label={`View ${item.project.title} project`}>
    <Image src={artwork || item.preview} alt={`${item.project.title} ${artwork ? "project artwork" : item.previewLabel.toLowerCase()}`} fill sizes={sizes} />
  </Link>;
}

export function ProjectArchive({ className = "" }: { className?: string }) {
  return <details className={`${styles.archive} ${className}`}>
    <summary>See all {projects.length} projects <span aria-hidden>+</span></summary>
    <div className={styles.archiveGrid}>{projects.map(project => <Link key={project.slug} href={`/portfolio/projects/${project.slug}`}><span>{project.title}</span><small>{project.tags[0]}</small></Link>)}</div>
  </details>;
}

export function EmailLink({ subject = "Hello Pablo", className, children = profile.email }: { subject?: string; className?: string; children?: ReactNode }) {
  return <a href={`mailto:${profile.email}?subject=${encodeURIComponent(subject)}`} className={className}>{children}</a>;
}

export function BookingLink({ className, children = "Book a conversation" }: { className?: string; children?: ReactNode }) {
  return <a href={profile.booking} target="_blank" rel="noreferrer" className={className}>{children}</a>;
}

export function FooterLinks({ className = "" }: { className?: string }) {
  return <div className={`${styles.footerLinks} ${className}`}><span>{profile.name}</span>
    <nav aria-label="Social profiles">{profile.socials.filter(social => ["gh", "in", "x"].includes(social.id)).map(social => <a key={social.id} href={social.url} target="_blank" rel="noreferrer">{social.label}</a>)}</nav>
    <Link href="/mockups">Compare the designs</Link>
  </div>;
}
