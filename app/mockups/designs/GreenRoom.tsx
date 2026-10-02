import { MockupShell, Portrait, RoleSummary, ActionLinks, WorkSection, AboutSection, ContactSection } from "../shared";
import { concepts } from "../concepts";
import styles from "./green-room.module.css";

export default function GreenRoom() {
  return (
    <MockupShell concept={concepts[4]}>
      <section className={styles.stage} aria-labelledby="green-room-heading">
        <h1 id="green-room-heading" className={styles.heading}>
          <span className={styles.topWord}>Build.</span>
          <span className={styles.bottomWord}>Design.</span>
        </h1>
        <div className={styles.art}>
          <Portrait portrait="forest" className={styles.portrait} />
        </div>
        <div className={styles.intro}>
          <p className={styles.signature}>Pablo Manjarres</p>
          <p className={styles.description}>I build web apps and AI tools. From an idea to something you can use.</p>
          <ActionLinks className={styles.actions} />
          <p className={styles.current}>Currently building Noelle.</p>
        </div>
        <RoleSummary className={styles.role} />
      </section>
      <WorkSection layout="grid" title="Independent ideas. Real products." />
      <AboutSection />
      <ContactSection />
    </MockupShell>
  );
}
