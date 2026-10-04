import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { LiveEmbed } from "@/app/portfolio/LiveEmbed";
import { getStudyPreview, type ProjectStudy, type StudyAsset } from "./data";
import { StudyVideo } from "./video";
import { StudyImagePreview } from "./image-preview";
import localStyles from "./primitives.module.css";
import interaction from "@/app/site/interaction.module.css";

const styles = { ...localStyles, ...interaction };

export function StudyMedia({ asset, className = "", priority = false, detail = false, caption = true, boundPortrait = true, sizes = "(max-width: 700px) 94vw, 90vw" }: { asset: StudyAsset; className?: string; priority?: boolean; detail?: boolean; caption?: boolean; boundPortrait?: boolean; sizes?: string }) {
  const portraitStyle: CSSProperties | undefined = asset.width < asset.height && !detail && boundPortrait ? { width: "auto", maxWidth: "100%", height: "auto", maxHeight: "min(80vh, 800px)", marginInline: "auto", objectFit: "contain" } : undefined;
  const imageStyle: CSSProperties | undefined = asset.kind === "presentation" && !detail ? { width: "100%", height: "auto", maxHeight: "none", padding: 0, objectFit: "contain" } : portraitStyle;
  const mediaProps = { className: `${styles.media} ${className}`, style: asset.kind === "presentation" && !detail ? { aspectRatio: `${asset.width} / ${asset.height}` } : undefined };
  const media = asset.kind === "unavailable" ? <div className={styles.unavailable} style={{ aspectRatio: `${asset.width} / ${asset.height}` }}><strong>{asset.label}</strong><span>No screen capture yet</span></div> : asset.kind === "video" ? <StudyVideo asset={asset} /> : <Image src={asset.src} alt={detail ? `Detail of ${asset.alt}` : asset.alt} width={asset.width} height={asset.height} sizes={sizes} preload={priority} style={imageStyle} />;
  const captionNode = caption && asset.kind !== "unavailable" && <figcaption>{detail ? `Detail of ${asset.label.toLowerCase()}` : asset.label}</figcaption>;
  return !detail && (asset.kind === "presentation" || asset.kind === "screen")
    ? <StudyImagePreview asset={asset} caption={captionNode} {...mediaProps}>{media}</StudyImagePreview>
    : <figure {...mediaProps} data-media-kind={asset.kind}>{media}{captionNode}</figure>;
}

export function StudyDemo({ study, className = "", fullScreenHref }: { study: ProjectStudy; className?: string; fullScreenHref?: string }) {
  const capture = getStudyPreview(study);
  if (!study.project.embedUrl || !capture?.src) return null;
  return <section className={`${styles.demo} ${className}`} aria-label={`${study.project.title} demo`}><LiveEmbed embedUrl={study.project.embedUrl} cover={{ src: capture.src, width: capture.width, height: capture.height }} title={study.project.title} className={interaction.action} /><p>Interactive demo{fullScreenHref && <> · <Link href={fullScreenHref} className={`${interaction.action} ${interaction.textLink}`}>Open full screen <span aria-hidden>↗</span></Link></>}</p></section>;
}

export function StudyLink({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return <Link href={href} className={`${styles.action} ${className}`}>{children}</Link>;
}

export function StudyActions({ study, className = "" }: { study: ProjectStudy; className?: string }) {
  return <nav className={`${styles.actions} ${className}`} aria-label={`${study.project.title} links`}>{study.project.links.map(link => <a key={link.url} href={link.url} target="_blank" rel="noreferrer" className={`${styles.action} ${interaction.button}`}>{link.label}<span className={interaction.arrow} aria-hidden>↗</span></a>)}</nav>;
}
