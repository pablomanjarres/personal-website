import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { profile } from "../socials";
import { MotionRoot } from "@/app/site/motion";
import styles from "./shell.module.css";

export type SiteTheme = { id: string; paper: string; ink: string; accent: string; panel?: string };

export function SiteMark({ href = "#main", className = "" }: { href?: string; className?: string }) {
  return <Link href={href} className={`${styles.brand} ${className}`} aria-label="Pablo Manjarres, home">pm<span aria-hidden>.</span></Link>;
}

export function SiteShell({ theme, children }: { theme: SiteTheme; children: ReactNode }) {
  const tokens = {
    "--paper": theme.paper, "--ink": theme.ink, "--accent": theme.accent,
    "--panel": theme.panel, "--display": "var(--font-display)",
  } as CSSProperties;
  return (
    <MotionRoot className={styles.shell} style={tokens} concept={theme.id}>
      <a href="#main" className={styles.skip}>Skip to content</a>
      <header className={styles.nav}>
        <SiteMark />
        <nav aria-label="Main navigation"><a href="#work">Work</a><a href="#about">About</a><a href="#contact">Contact</a></nav>
        <a className={styles.navContact} href={profile.booking} target="_blank" rel="noreferrer">Let’s talk <span aria-hidden>↗</span></a>
      </header>
      <main id="main">{children}</main>
    </MotionRoot>
  );
}

export function Portrait({ portrait, className, preload = true, alt = "Pablo Manjarres" }: {
  portrait: "forest" | "teal" | "denim" | "hoodie"; className?: string; preload?: boolean; alt?: string;
}) {
  return <Image src={`/images/portraits/${portrait}.webp`} alt={alt} width={1122} height={1402} sizes="(max-width: 700px) 90vw, 50vw" preload={preload} className={`${styles.portrait} ${className ?? ""}`} />;
}

export function ActionLinks({ className = "" }: { className?: string }) {
  return <div className={`${styles.actions} ${className}`}><a className={styles.primary} href="#work">Explore my work <span aria-hidden>↘</span></a><a className={styles.secondary} href={`mailto:${profile.email}`}>Get in touch</a></div>;
}

export function RoleSummary({ className = "" }: { className?: string }) {
  return <p className={`${styles.roles} ${className}`}>{profile.roles.map(role => <span key={role}>{role}</span>)}</p>;
}
