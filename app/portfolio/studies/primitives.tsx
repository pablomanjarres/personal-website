import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { LiveEmbed } from "@/app/portfolio/LiveEmbed";
import type { ProjectStudy, StudyAsset } from "./data";
import { StudyVideo } from "./video";
import localStyles from "./primitives.module.css";
import interaction from "@/app/site/interaction.module.css";

const styles = { ...localStyles, ...interaction };

export function StudyMedia({ asset, className = "", priority = false, detail = false, caption = true, boundPortrait = true, sizes = "(max-width: 700px) 94vw, 90vw" }: { asset: StudyAsset; className?: string; priority?: boolean; detail?: boolean; caption?: boolean; boundPortrait?: boolean; sizes?: string }) {
  const portraitStyle: CSSProperties | undefined = asset.width < asset.height && !detail && boundPortrait ? { width: "auto", maxWidth: "100%", height: "auto", maxHeight: "min(80vh, 800px)", marginInline: "auto", objectFit: "contain" } : undefined;
  return <figure className={`${styles.media} ${className}`} data-media-kind={asset.kind} style={asset.kind === "presentation" && !detail ? { aspectRatio: `${asset.width} / ${asset.height}` } : undefined}>
    {asset.kind === "unavailable" ? <div className={styles.unavailable} style={{ aspectRatio: `${asset.width} / ${asset.height}` }}><strong>{asset.label}</strong><span>No screen capture yet</span></div> : asset.kind === "video" ? <StudyVideo asset={asset} /> : <Image src={asset.src} alt={detail ? `Detail of ${asset.alt}` : asset.alt} width={asset.width} height={asset.height} sizes={sizes} preload={priority} style={portraitStyle} />}
    {caption && asset.kind !== "unavailable" && <figcaption>{detail ? `Detail of ${asset.label.toLowerCase()}` : asset.label}</figcaption>}
  </figure>;
}

export function StudyDemo({ study, className = "", fullScreenHref }: { study: ProjectStudy; className?: string; fullScreenHref?: string }) {
  const capture = study.media.find(asset => asset.kind === "screen");
  if (!study.project.embedUrl || !capture?.src) return null;
  return <section className={`${styles.demo} ${className}`} aria-label={`${study.project.title} demo`}><LiveEmbed embedUrl={study.project.embedUrl} cover={capture.src} title={study.project.title} className={interaction.action} /><p>Interactive demo{fullScreenHref && <> · <Link href={fullScreenHref} className={interaction.action}>Open full screen <span aria-hidden>↗</span></Link></>}</p></section>;
}

export function StudyLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return <Link href={href} className={`${styles.action} ${className}`}>{children}</Link>;
}

export function StudyActions({ study, className = "" }: { study: ProjectStudy; className?: string }) {
  return <nav className={`${styles.actions} ${className}`} aria-label={`${study.project.title} links`}>{study.project.links.map(link => <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className={styles.action}>{link.label}<span aria-hidden> ↗</span></a>)}</nav>;
}
