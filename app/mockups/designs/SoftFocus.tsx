import { concepts } from "../concepts";
import { MockupShell, Portrait, ActionLinks, RoleSummary, WorkSection, AboutSection, ContactSection } from "../shared";
import styles from "./soft-focus.module.css";

export default function SoftFocus() {
  return (
    <MockupShell concept={concepts[5]}>
      <div className={styles.softFocus}>
        <section className={styles.hero} aria-labelledby="soft-focus-title">
          <div className={styles.introduction}>
            <p className={styles.greeting}>Pablo Manjarres</p>
            <RoleSummary className={styles.profession} />
          </div>
          <h1 id="soft-focus-title" className={styles.headline}>
            <span>From idea</span>
            <span>to software.</span>
          </h1>
          <div className={styles.studio}>
            <aside className={styles.note}>
              <p>I like the moment an idea becomes something you can actually use.</p>
              <span>Web apps. AI tools.<br />Currently, Noelle.</span>
            </aside>
            <figure className={styles.mainPortrait}>
              <Portrait portrait="teal" />
            </figure>
            <figure className={styles.secondPortrait}>
              <Portrait portrait="denim" preload={false} />
              <figcaption>A different light. The same person.</figcaption>
            </figure>
          </div>
          <div className={styles.heroFoot}>
            <p>Thoughtful interfaces.<br />Software that works behind them.</p>
            <ActionLinks className={styles.actions} />
          </div>
        </section>
        <WorkSection layout="index" title="A collection of things I’ve built." />
        <AboutSection />
        <ContactSection />
      </div>
    </MockupShell>
  );
}
