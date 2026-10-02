import { MockupShell, Portrait, ActionLinks, WorkSection, AboutSection, ContactSection } from "../shared";
import { concepts } from "../concepts";
import styles from "./green-room.module.css";

export default function GreenRoom() {
  return (
    <MockupShell concept={concepts[4]}>
      <section className={styles.stage} aria-labelledby="green-room-name">
        <h1 id="green-room-name" className={styles.name}>
          <span className={styles.firstName}>Pablo</span>
          <span className={styles.lastName}>Manjarres</span>
        </h1>
        <div className={styles.art}>
          <Portrait portrait="forest" className={styles.portrait} />
        </div>
        <div className={styles.intro}>
          <p>I build web apps and AI tools. From an idea to something you can use.</p>
          <ActionLinks className={styles.actions} />
          <p className={styles.current}>Currently building Noelle.</p>
        </div>
        <p className={styles.role}>Software<br />developer.<br /><span>Solo founder.</span></p>
      </section>
      <WorkSection layout="grid" title="Independent ideas. Real products." />
      <AboutSection />
      <ContactSection />
    </MockupShell>
  );
}
