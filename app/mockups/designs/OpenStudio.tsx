import { MockupShell, Portrait, ActionLinks, WorkSection, AboutSection, ContactSection } from "../shared";
import { concepts } from "../concepts";
import { profile } from "../../socials";
import styles from "./open-studio.module.css";

export default function OpenStudio() {
  return (
    <MockupShell concept={concepts[1]}>
      <section className={styles.hero} aria-labelledby="studio-role">
        <p className={styles.signature}>Pablo Manjarres</p>
        <h1 id="studio-role" className={styles.headline}>
          {profile.roles.map(role => <span key={role}>{role}.</span>)}
        </h1>
        <p className={styles.note}>I design products and build the software behind them.</p>
        <div className={styles.composition}>
          <div className={styles.introduction}>
            <span className={styles.spark} aria-hidden>✳</span>
            <h2>Web apps.<br />AI tools.</h2>
            <p>Web apps and AI tools,<br />made with a human touch.</p>
          </div>
          <figure className={styles.arch}>
            <Portrait portrait="teal" />
          </figure>
          <div className={styles.aside}>
            <p>Thoughtful interfaces.<br />Systems that work.</p>
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
