import Image from "next/image";
import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import interaction from "./interaction.module.css";
import styles from "./review.module.css";

export function ReviewGallery({ header, footer, children }: { header: ReactNode; footer: ReactNode; children: ReactNode }) {
  return <main className={styles.gallery}>
    <header className={styles.galleryHeader}>{header}</header>
    <div className={styles.conceptGrid}>{children}</div>
    <footer className={styles.galleryFooter}>{footer}</footer>
  </main>;
}

export function ReviewCard({ href, number, name, description, children }: { href: string; number: string; name: string; description: string; children: ReactNode }) {
  return <Link href={href} className={`${styles.conceptCard} ${interaction.action}`}>
    {children}
    <div className={styles.conceptLabel}><span>{number}</span><h2>{name}</h2><span aria-hidden>↗</span></div>
    <p>{description}</p>
  </Link>;
}

export function ReviewPreview({ src, alt, background, variant = "contained" }: { src: string; alt: string; background?: string; variant?: "contained" | "body" }) {
  return <div className={variant === "body" ? styles.bodyImage : styles.conceptImage} style={background ? { background } : undefined}>
    <Image src={src} alt={alt} fill sizes="(max-width: 700px) 90vw, 45vw" />
  </div>;
}

export function ReviewBar({ number, name, nextHref }: { number: string; name: string; nextHref: string }) {
  return <div className={styles.reviewBar}>
    <Link href="/mockups" className={interaction.action}>All six designs</Link>
    <span>{number} / {name}</span>
    <Link href={nextHref} className={interaction.action}>Next design <span aria-hidden>↗</span></Link>
  </div>;
}

export function ReviewSavedLink(props: ComponentProps<typeof Link>) {
  return <Link {...props} className={`${styles.savedLink} ${interaction.action}`} />;
}
