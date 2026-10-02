import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { profile } from "../../socials";
import { MotionRoot } from "../motion";
import { studyHref } from "./data";
import type { StudyDirection } from "./directions";
import interaction from "../interaction.module.css";
import styles from "./shell.module.css";

export function StudyShell({ direction, children }: { direction: StudyDirection; children: ReactNode }) {
  return <MotionRoot concept={direction.motionConcept} className={styles.shell} style={{ "--paper": direction.paper, "--ink": direction.ink, "--accent": direction.accent } as CSSProperties}>
    <a href="#project-main" className={`${styles.skip} ${interaction.action}`}>Skip to projects</a>
    <header className={styles.header}><Link href="/mockups/projects" className={interaction.action}>All project designs</Link><Link href={studyHref(direction.id)} className={interaction.action}>{direction.name}</Link><a href={`mailto:${profile.email}`} className={interaction.action}>Contact Pablo ↗</a></header>
    <main id="project-main">{children}</main>
    <footer className={styles.footer}><Link href="/mockups" className={interaction.action}>Homepage designs</Link><Link href="/mockups/projects" className={interaction.action}>Compare project designs</Link></footer>
  </MotionRoot>;
}
