import Link from "next/link";
import { projects, type Project } from "../../projects";
import { profile } from "../../socials";
import { MockupShell, Portrait, ActionLinks, RoleSummary } from "../shared";
import SignalBody from "../bodies/SignalBody";
import { concepts } from "../concepts";
import { conceptStudyHref } from "../project-studies/directions";
import styles from "./signal.module.css";

const proofProjects = ["noelle", "cortex"].map(slug => projects.find(project => project.slug === slug)).filter(project => project !== undefined);

function ProofTag({ project, index }: { project: Project; index: number }) {
  return <Link href={conceptStudyHref("signal", project.slug)} className={styles.proof} data-proof={index} data-enter="fade"><span aria-hidden>↗</span><span><strong>{project.title}</strong><small>{project.role}</small></span></Link>;
}

export default function Signal() {
  return (
    <MockupShell concept={concepts[0]}>
      <section className={styles.hero} aria-labelledby="signal-role">
        <div className={styles.intro} data-enter="fade">
          <RoleSummary className={styles.roles} />
          <span className={styles.signature}>{profile.name}</span>
        </div>
        <div className={styles.stage}>
          <div className={styles.copy}>
            <h1 id="signal-role" className={styles.headline}>
              <span className={styles.mask}><span>From idea</span></span>
              <span className={styles.mask}><span>to product.</span></span>
            </h1>
            <p className={styles.lede} data-enter="fade">I design and build web apps, AI tools, and the systems behind them.</p>
            <div data-enter="fade"><ActionLinks className={styles.actions} /></div>
          </div>
          <div className={styles.portraitStage}>
            <div className={styles.halo} aria-hidden />
            <figure className={styles.window} data-enter="clip"><Portrait portrait="forest" /></figure>
            {proofProjects.map((project, index) => <ProofTag key={project.slug} project={project} index={index} />)}
          </div>
          <svg className={styles.connector} viewBox="0 0 370 170" aria-hidden>
            <path pathLength="1" d="M4 30C60 55 92 152 165 137C240 121 138 52 183 30C227 9 250 63 363 12M350 8L363 12L359 25" />
          </svg>
        </div>
        <div className={styles.trail} data-enter="fade">
          <p>Product decisions.<br />Interface details. Working code.</p>
          <a href="#work">A few things I’ve built <span aria-hidden>↓</span></a>
        </div>
      </section>
      <div className={styles.body}><SignalBody /></div>
    </MockupShell>
  );
}
