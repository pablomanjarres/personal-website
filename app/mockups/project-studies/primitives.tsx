import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { LiveEmbed } from "../../portfolio/LiveEmbed";
import { studyHref, type ProjectStudy, type StudyAsset, type StudyDirectionId } from "./data";
import { StudyVideo } from "./video";
import localStyles from "./primitives.module.css";
import interaction from "../interaction.module.css";

const styles = { ...localStyles, ...interaction };

export function StudyMedia({ asset, className = "", priority = false, detail = false, caption = true, boundPortrait = true, sizes = "(max-width: 700px) 94vw, 90vw" }: { asset: StudyAsset; className?: string; priority?: boolean; detail?: boolean; caption?: boolean; boundPortrait?: boolean; sizes?: string }) {
  const portraitStyle: CSSProperties | undefined = asset.width < asset.height && !detail && boundPortrait ? { width: "auto", maxWidth: "100%", height: "auto", maxHeight: "min(80vh, 800px)", marginInline: "auto", objectFit: "contain" } : undefined;
  return <figure className={`${styles.media} ${className}`} data-media-kind={asset.kind}>
    {asset.kind === "unavailable" ? <div className={styles.unavailable} style={{ aspectRatio: `${asset.width} / ${asset.height}` }}><strong>{asset.label}</strong><span>No screen capture yet</span></div> : asset.kind === "video" ? <StudyVideo asset={asset} /> : <Image src={asset.src} alt={detail ? `Detail of ${asset.alt}` : asset.alt} width={asset.width} height={asset.height} sizes={sizes} preload={priority} style={portraitStyle} />}
    {caption && asset.kind !== "unavailable" && <figcaption>{detail ? `Detail of ${asset.label.toLowerCase()}` : asset.label}</figcaption>}
  </figure>;
}

export function StudyDemo({ study, className = "" }: { study: ProjectStudy; className?: string }) {
  const capture = study.media.find(asset => asset.kind === "screen");
  if (!study.project.embedUrl || !capture?.src) return null;
  return <section className={`${styles.demo} ${className}`} aria-label={`${study.project.title} demo`}><LiveEmbed embedUrl={study.project.embedUrl} cover={capture.src} title={study.project.title} className={interaction.action} /><p>Interactive demo</p></section>;
}

export function StudyLink({ study, direction, children, className = "" }: { study: ProjectStudy; direction: StudyDirectionId; children: ReactNode; className?: string }) {
  return <Link href={studyHref(direction, study.project.slug)} className={`${styles.action} ${className}`}>{children}</Link>;
}

export function StudyActions({ study, className = "" }: { study: ProjectStudy; className?: string }) {
  return <nav className={`${styles.actions} ${className}`} aria-label={`${study.project.title} links`}>{study.project.links.slice(0, 4).map(link => <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className={styles.action}>{link.label}<span aria-hidden> ↗</span></a>)}</nav>;
}

export function StudyNext({ study, direction, className = "" }: { study: ProjectStudy; direction: StudyDirectionId; className?: string }) {
  return <StudyLink study={study} direction={direction} className={`${styles.next} ${className}`}><span>Next project</span><strong>{study.project.title}</strong><span aria-hidden>↗</span></StudyLink>;
}
