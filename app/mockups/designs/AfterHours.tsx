import { MockupShell, Portrait, RoleSummary, ActionLinks, WorkSection, AboutSection, ContactSection } from "../shared";
import { concepts } from "../concepts";
import { profile } from "../../socials";
import styles from "./after-hours.module.css";

export default function AfterHours() {
  return (
    <MockupShell concept={concepts[3]}>
      <section className={styles.hero} aria-labelledby="after-hours-heading">
        <div className={styles.stage}>
          <div className={styles.horizon} aria-hidden="true" />
          <div className={styles.art}>
            <Portrait portrait="hoodie" className={styles.portrait} />
          </div>
          <div className={styles.light} aria-hidden="true" />
          <div className={styles.curtain} aria-hidden="true"><span /><span /></div>
          <div className={styles.intro}>
            <a className={styles.building} href="https://trynoelle.com" target="_blank" rel="noreferrer" data-enter="fade">
              Currently building {profile.building}
            </a>
            <h1 id="after-hours-heading" className={styles.heading} data-enter="word">
              I make software<br />people can use.
            </h1>
            <p className={styles.description} data-enter="fade">From the product decisions<br />to the interface and the code.</p>
            <ActionLinks className={styles.actions} />
          </div>
          <div className={styles.heroFooter} data-enter="fade">
            <div><p className={styles.signature}>{profile.name}</p><RoleSummary className={styles.role} /></div>
            <a href="#work" className={styles.scroll}>See the work <span aria-hidden="true">↓</span></a>
          </div>
        </div>
        <div className={styles.afterword}><p>Engineering, with an eye for the whole product.</p><p>Selected work below</p></div>
      </section>
      <WorkSection layout="reel" title="Built, shipped, still growing." />
      <AboutSection variant="cards" />
      <ContactSection concept="after-hours" />
    </MockupShell>
  );
}
