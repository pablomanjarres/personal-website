import Link from "next/link";
import { profile } from "../../socials";
import { concepts } from "../concepts";
import { MockupShell, Portrait, ActionLinks, RoleSummary } from "../shared";
import LetterBody from "../bodies/LetterBody";
import styles from "./soft-focus.module.css";

function JournalPath() {
  return (
    <svg className={styles.path} viewBox="0 0 1200 750" fill="none" aria-hidden>
      <path d="M80 555C240 445 448 706 608 565C700 484 595 354 523 438C431 545 829 649 920 467C979 349 1096 308 1132 335" pathLength="1" />
      <path d="m1120 316 14 20-24 4" />
    </svg>
  );
}

export default function SoftFocus() {
  return (
    <MockupShell concept={concepts[5]}>
      <section className={styles.hero} aria-labelledby="soft-focus-title">
        <JournalPath />
        <div className={styles.introduction}>
          <RoleSummary className={styles.profession} />
          <h1 id="soft-focus-title" className={styles.headline} data-enter="word">Making things<br />people can use.</h1>
          <p className={styles.description} data-enter="fade">I design the screens and build what makes them work.</p>
          <ActionLinks className={styles.actions} />
        </div>
        <div className={styles.collage}>
          <div className={styles.paperShadow} aria-hidden />
          <figure className={styles.mainPaper}>
            <span className={styles.tape} aria-hidden />
            <div className={styles.mainPhoto}><Portrait portrait="teal" /></div>
            <figcaption>{profile.name}<span aria-hidden>✳</span></figcaption>
          </figure>
          <figure className={styles.smallPaper}>
            <div className={styles.smallPhoto}><Portrait portrait="denim" preload={false} /></div>
            <figcaption>Design + engineering</figcaption>
          </figure>
          <svg className={styles.sketch} viewBox="0 0 90 90" fill="none" aria-hidden>
            <path d="M44 9C47 24 48 34 46 42M13 21C28 29 36 35 41 42M7 49C25 46 35 45 42 47M21 77C32 62 38 56 43 51M52 83C48 68 47 58 47 51M80 66C64 58 56 52 50 48M84 34C67 40 57 44 50 45M67 8C59 24 53 35 49 42" />
          </svg>
        </div>
        <Link href={`/portfolio/projects/${profile.building.toLowerCase()}`} className={styles.building} data-enter="fade">
          <span className={styles.notePin} aria-hidden />
          <span>On my desk</span>
          <strong>{profile.building}</strong>
          <span className={styles.noteArrow} aria-hidden>↗</span>
        </Link>
        <a href="#work" className={styles.marginNote}>A few things I’ve built <span aria-hidden>↓</span></a>
      </section>
      <LetterBody />
    </MockupShell>
  );
}
