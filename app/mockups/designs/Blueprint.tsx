import Image from "next/image";
import Link from "next/link";
import { getProject } from "../../projects";
import { concepts } from "../concepts";
import { MockupShell, Portrait, ActionLinks, RoleSummary } from "../shared";
import BlueprintBody from "../bodies/BlueprintBody";
import styles from "./blueprint.module.css";

const cortex = getProject("cortex")!;
const connections = [
  { label: "Design", position: "design" },
  { label: "Interface", position: "interface" },
  { label: "System", position: "system" },
] as const;

function ProductAssembly() {
  return (
    <div className={styles.stage}>
      <div className={styles.stageSurface} aria-hidden="true" />
      <svg className={styles.wiring} viewBox="0 0 1200 600" fill="none" aria-hidden="true">
        <path className={styles.wire} pathLength="1" d="M240 118H350C380 118 396 102 396 72V58C396 33 413 20 440 20H876C903 20 916 38 916 66V80" />
        <path className={styles.wire} pathLength="1" d="M1050 146H1112C1140 146 1156 165 1156 194V366C1156 395 1138 412 1110 412H1040" />
        <path className={styles.wire} pathLength="1" d="M222 410H300C330 410 346 428 346 458V520C346 550 364 566 394 566H630" />
        <circle cx="916" cy="80" r="5" /><circle cx="1040" cy="412" r="5" /><circle cx="222" cy="410" r="5" />
      </svg>
      {connections.map(connection => (
        <span key={connection.label} className={`${styles.connection} ${styles[connection.position]}`}>
          <span className={styles.node} aria-hidden="true" />{connection.label}
        </span>
      ))}
      <Link href={`/portfolio/projects/${cortex.slug}`} className={styles.appWindow} aria-label="Read the Cortex case study">
        <div className={styles.windowBar}>
          <span className={styles.windowDots} aria-hidden="true"><i /><i /><i /></span>
          <span>{cortex.title}</span><span className={styles.windowType}>Desktop app</span>
        </div>
        <div className={styles.appScreen}>
          <Image src={cortex.cover!} alt="Cortex dashboard with focus, habits, calendar, and finances" width={1440} height={1000} sizes="(max-width: 800px) 95vw, 64vw" preload />
        </div>
        <span className={styles.caseLink}>View case study <span aria-hidden="true">↗</span></span>
      </Link>
      <figure className={styles.maker}>
        <div className={styles.makerPortrait}><Portrait portrait="denim" preload={false} /></div>
        <figcaption>Pablo<br />Manjarres</figcaption>
      </figure>
      <div className={styles.productCaption}>
        <span>{cortex.title}</span><p>{cortex.oneLiner}</p>
      </div>
    </div>
  );
}

export default function Blueprint() {
  return (
    <MockupShell concept={concepts[2]}>
      <div className={styles.blueprint}>
        <section className={styles.hero} aria-labelledby="blueprint-title">
          <div className={styles.introduction}>
            <div data-enter>
              <RoleSummary className={styles.discipline} />
              <h1 id="blueprint-title" className={styles.headline}>I build products<br />from the inside out.</h1>
            </div>
            <div className={styles.heroNote} data-enter>
              <p>The interface, the code, and the decisions that connect them.</p>
              <ActionLinks className={styles.actions} />
            </div>
          </div>
          <ProductAssembly />
        </section>
        <BlueprintBody />
      </div>
    </MockupShell>
  );
}
