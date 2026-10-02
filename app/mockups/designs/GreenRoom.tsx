import { MockupShell, Portrait, RoleSummary, ActionLinks, WorkSection, AboutSection, ContactSection } from "../shared";
import { concepts } from "../concepts";
import { profile } from "../../socials";
import styles from "./green-room.module.css";

export default function GreenRoom() {
  return (
    <MockupShell concept={concepts[4]}>
      <section className={styles.stage} aria-labelledby="green-room-heading">
        <svg className={styles.path} viewBox="0 0 1400 850" preserveAspectRatio="none" aria-hidden="true">
          <path d="M-40 710C250 950 420 608 620 715S1330 720 1320 260C1315 50 1050 5 1025 110S1170 230 1510 105" />
          <circle cx="621" cy="715" r="4" />
        </svg>
        <div className={styles.contour} aria-hidden="true" />
        <div className={styles.window} data-enter="fade">
          <Portrait portrait="forest" className={styles.portrait} />
        </div>
        <h1 id="green-room-heading" className={styles.heading}>
          <span className={styles.first} data-enter="word">Good ideas.</span>
          <span className={styles.last} data-enter="word">Made real.</span>
        </h1>
        <div className={styles.intro} data-enter="fade">
          <p>I design and build software, from the first sketch to the systems behind it.</p>
          <ActionLinks className={styles.actions} />
        </div>
        <div className={styles.current} data-enter="fade">
          <div><span>Currently building</span><strong>{profile.building}</strong></div>
        </div>
        <RoleSummary className={styles.roles} />
        <a className={styles.workLink} href="#work" aria-label="View my projects">
          View work<span aria-hidden="true">↓</span>
        </a>
      </section>
      <WorkSection layout="chapters" title="A closer look at the work." />
      <AboutSection variant="note" />
      <ContactSection variant="orb" />
    </MockupShell>
  );
}
