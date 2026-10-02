import { MockupShell, Portrait, ActionLinks, WorkSection, AboutSection, ContactSection } from "../shared";
import { concepts } from "../concepts";
import styles from "./after-hours.module.css";

export default function AfterHours() {
  return (
    <MockupShell concept={concepts[3]}>
      <section className={styles.hero} aria-labelledby="after-hours-name">
        <div className={styles.art}>
          <Portrait portrait="hoodie" className={styles.portrait} />
        </div>
        <div className={styles.intro}>
          <p className={styles.role}>Software developer. Solo founder.</p>
          <h1 id="after-hours-name" className={styles.name}>
            <span>Pablo</span><span>Manjarres.</span>
          </h1>
          <p className={styles.description}>I build web apps, AI tools, and the systems that bring them to life.</p>
          <ActionLinks className={styles.actions} />
        </div>
        <div className={styles.heroFooter}>
          <p>Currently building <a href="https://trynoelle.com" target="_blank" rel="noreferrer">Noelle</a></p>
          <a href="#work">The work below <span aria-hidden>↓</span></a>
        </div>
      </section>
      <WorkSection layout="film" title="Made to be used." />
      <AboutSection />
      <ContactSection />
    </MockupShell>
  );
}
