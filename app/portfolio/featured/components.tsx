import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { projects } from "@/app/projects";
import { profile } from "@/app/socials";
import type { FeaturedProject } from "./content";
import { StudyMedia } from "../studies/primitives";
import { portfolioHref } from "../routes";
import localStyles from "./components.module.css";
import interaction from "@/app/site/interaction.module.css";

const styles = { ...localStyles, ...interaction };

export function ProjectLink({ item, className = "", children }: { item: FeaturedProject; className?: string; children: ReactNode }) {
  return <Link href={item.href} className={`${styles.action} ${interaction.textLink} ${className}`}>{children}</Link>;
}

export function ProjectVisual({ item, className = "", sizes = "(max-width: 700px) 90vw, 65vw" }: {
  item: FeaturedProject; className?: string; sizes?: string;
}) {
  const aspectRatio = `${item.preview.width} / ${item.preview.height}`;
  const visualStyle: CSSProperties | undefined = item.preview.kind === "presentation"
    ? { aspectRatio, padding: 0, height: "auto", maxHeight: "none" }
    : undefined;
  return <Link href={item.href} className={`${styles.action} ${styles.visual} ${className}`} aria-label={`View ${item.project.title} project`} data-media-kind={item.preview.kind} style={visualStyle}>
    <StudyMedia asset={item.preview} caption={false} sizes={sizes} />
  </Link>;
}

export function BuildingLink({ href, className = "", children = profile.building }: { href: string; className?: string; children?: ReactNode }) {
  return <Link href={href} className={`${styles.action} ${interaction.textLink} ${className}`}>{children}</Link>;
}

export function ProjectArchive({ href = portfolioHref, className = "" }: { href?: string; className?: string }) {
  return <Link href={href} className={`${styles.action} ${styles.archive} ${className}`}>
    Browse all {projects.length} projects <span aria-hidden>↗</span>
  </Link>;
}

export function EmailLink({ subject = "Hello Pablo", className = "", children = profile.email }: { subject?: string; className?: string; children?: ReactNode }) {
  return <a href={`mailto:${profile.email}?subject=${encodeURIComponent(subject)}`} className={`${styles.action} ${interaction.textLink} ${className}`}>{children}</a>;
}

export function BookingLink({ className = "", children = "Book a conversation" }: { className?: string; children?: ReactNode }) {
  return <a href={profile.booking} target="_blank" rel="noreferrer" className={`${styles.action} ${interaction.button} ${className}`}>{children}</a>;
}

export function FooterLinks({ className = "", destination = { href: "/portfolio", label: "All projects" } }: { className?: string; destination?: { href: string; label: string } }) {
  return <div className={`${styles.footerLinks} ${className}`}><span>{profile.name}</span>
    <nav aria-label="Social profiles">{profile.socials.filter(social => ["gh", "in", "x"].includes(social.id)).map(social => <a key={social.id} href={social.url} target="_blank" rel="noreferrer" className={`${styles.action} ${interaction.textLink}`}>{social.label}</a>)}</nav>
    <Link href={destination.href} className={`${styles.action} ${interaction.textLink}`}>{destination.label}</Link>
  </div>;
}
