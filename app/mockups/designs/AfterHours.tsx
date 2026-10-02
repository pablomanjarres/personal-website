import { MockupShell, Portrait, RoleSummary, ActionLinks, WorkSection, AboutSection, ContactSection } from "../shared";
import { concepts } from "../concepts";
import styles from "./after-hours.module.css";

export default function AfterHours() {
  return (
    <MockupShell concept={concepts[3]}>
      <section className={styles.hero} aria-labelledby="after-hours-heading">
        <div className={styles.art}>
          <Portrait portrait="hoodie" className={styles.portrait} />
        </div>
        <div className={styles.intro}>
          <RoleSummary className={styles.role} />
          <h1 id="after-hours-heading" className={styles.heading}>
            <span>Engineer.</span><span>Designer.</span><span>Founder.</span>
          </h1>
          <p className={styles.description}>I build web apps, AI tools, and the systems that bring them to life.</p>
          <ActionLinks className={styles.actions} />
        </div>
        <div className={styles.heroFooter}>
          <p><span className={styles.signature}>Pablo Manjarres</span><span>Currently building <a href="https://trynoelle.com" target="_blank" rel="noreferrer">Noelle</a></span></p>
          <a href="#work">The work below <span aria-hidden>↓</span></a>
        </div>
      </section>
      <WorkSection layout="film" title="Made to be used." />
      <AboutSection />
      <ContactSection />
    </MockupShell>
  );
}
