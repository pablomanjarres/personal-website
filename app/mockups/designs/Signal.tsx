import { MockupShell, Portrait, ActionLinks, RoleSummary, WorkSection, AboutSection, ContactSection } from "../shared";
import { concepts } from "../concepts";
import styles from "./signal.module.css";

export default function Signal() {
  return (
    <MockupShell concept={concepts[0]}>
      <section className={styles.hero} aria-labelledby="signal-role">
        <div className={styles.intro}>
          <RoleSummary />
          <p className={styles.current}>An idea in progress.<br /><strong>Currently building Noelle.</strong></p>
        </div>
        <div className={styles.stage}>
          <h1 id="signal-role" className={styles.headline}>
            <span>Build.</span><span>Design.</span><span>Launch.</span>
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
          <span>Pablo Manjarres</span>
          <span>Design with intent.<br />Build with care.</span>
        </div>
      </section>
      <WorkSection layout="editorial" title="Built to be used." />
      <AboutSection />
      <ContactSection />
    </MockupShell>
  );
}
