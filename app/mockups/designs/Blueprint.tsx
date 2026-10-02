import { concepts } from "../concepts";
import { MockupShell, Portrait, ActionLinks, WorkSection, AboutSection, ContactSection } from "../shared";
import styles from "./blueprint.module.css";

export default function Blueprint() {
  return (
    <MockupShell concept={concepts[2]}>
      <div className={styles.blueprint}>
        <section className={styles.hero} aria-labelledby="blueprint-title">
          <div className={styles.introduction}>
            <p className={styles.name}>Pablo Manjarres</p>
            <p className={styles.discipline}>Software developer<br />Solo founder</p>
          </div>
          <div className={styles.composition}>
            <h1 id="blueprint-title" className={styles.headline}>
              <span>Ideas.</span>
              <span>Systems.</span>
              <span className={styles.software}>Software.</span>
            </h1>
            <figure className={styles.portraitBlock}>
              <Portrait portrait="denim" />
              <figcaption>Thoughtfully designed. Built to work.</figcaption>
            </figure>
          </div>
          <div className={styles.heroFoot}>
            <p>I design and build web apps, AI tools, and the systems behind them. Currently building Noelle.</p>
            <ActionLinks className={styles.actions} />
          </div>
        </section>
        <WorkSection layout="feature" title="The work behind the words." />
        <AboutSection />
        <ContactSection />
      </div>
    </MockupShell>
  );
}
