import { MockupShell, Portrait, ActionLinks, WorkSection, AboutSection, ContactSection } from "../shared";
import { concepts } from "../concepts";
import styles from "./signal.module.css";

export default function Signal() {
  return (
    <MockupShell concept={concepts[0]}>
      <section className={styles.hero} aria-labelledby="signal-name">
        <div className={styles.intro}>
          <p>Software developer<br /><span>Solo founder</span></p>
          <p className={styles.current}>An idea in progress.<br /><strong>Currently building Noelle.</strong></p>
        </div>
        <div className={styles.stage}>
          <h1 id="signal-name" className={styles.name}>
            <span>Pablo</span><span className={styles.surname}>Manjarres.</span>
          </h1>
          <figure className={styles.frame}>
            <Portrait portrait="forest" />
          </figure>
          <div className={styles.statement}>
            <p>I build web apps and AI tools, from the first idea to software people can use.</p>
            <ActionLinks className={styles.actions} />
          </div>
        </div>
        <div className={styles.endnote}>
          <span>From idea to working product.</span>
          <span>Design with intent.<br />Build with care.</span>
        </div>
      </section>
      <WorkSection layout="editorial" title="Built to be used." />
      <AboutSection />
      <ContactSection />
    </MockupShell>
  );
}
