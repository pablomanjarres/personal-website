import { MockupShell, Portrait, ActionLinks, WorkSection, AboutSection, ContactSection } from "../shared";
import { concepts } from "../concepts";
import styles from "./open-studio.module.css";

export default function OpenStudio() {
  return (
    <MockupShell concept={concepts[1]}>
      <section className={styles.hero} aria-labelledby="studio-name">
        <h1 id="studio-name" className={styles.name}>Pablo <span>Manjarres</span></h1>
        <p className={styles.note}>I like making ideas useful.</p>
        <div className={styles.composition}>
          <div className={styles.introduction}>
            <span className={styles.spark} aria-hidden>✳</span>
            <h2>Software developer.<br />Solo founder.</h2>
            <p>Web apps and AI tools,<br />made with a human touch.</p>
          </div>
          <figure className={styles.arch}>
            <Portrait portrait="teal" />
          </figure>
          <div className={styles.aside}>
            <p>From a first sketch<br />to the last small detail.</p>
            <div className={styles.current}>
              <span className={styles.dot} aria-hidden />
              <span>Currently building<br /><strong>Noelle.</strong></span>
            </div>
          </div>
        </div>
        <ActionLinks className={styles.actions} />
      </section>
      <WorkSection layout="tiles" title="Ideas, out in the world." />
      <AboutSection />
      <ContactSection />
    </MockupShell>
  );
}
