import type { FeaturedProject } from "./content";
import type { CSSProperties } from "react";
import { ankiMobileScreens } from "../anki-media";
import { featuredProjects } from "./content";
import { BookingLink, EmailLink, FooterLinks, ProjectArchive, ProjectLink, ProjectVisual } from "./primitives";
import styles from "./blueprint-body.module.css";

const responsibilities = [
  { title: "Product decisions", detail: "The problem, the people, and the flows they need.", layer: "Product" },
  { title: "Interface", detail: "The screens people use and the front end behind them.", layer: "Experience" },
  { title: "Systems", detail: "APIs, worker jobs, and the rules that keep the product working.", layer: "Foundation" },
] as const;

function PocketStudy({ item }: { item: FeaturedProject }) {
  const screen = ankiMobileScreens[0];
  return <div className={styles.pocket} style={{ "--pocket-ratio": `${screen.width} / ${screen.height}` } as CSSProperties}>
    <ProjectVisual item={item} className={styles.mobilePreview} sizes="(max-width: 430px) 65vw, 330px" />
  </div>;
}

function LaptopStudy({ item, index }: { item: FeaturedProject; index: number }) {
  return (
    <article className={`${styles.study} ${index % 2 ? styles.cobalt : styles.ice}`}>
      <div className={styles.deviceStage}>
        {item.project.slug === "anki" ? <PocketStudy item={item} /> : <div className={styles.laptop}>
          <div className={styles.display}>
            <span className={styles.camera} aria-hidden="true" />
            <ProjectVisual item={item} className={styles.preview} sizes="(max-width: 800px) 88vw, 58vw" />
          </div>
          <div className={styles.keyboard} aria-hidden="true"><span /></div>
        </div>}
        <p className={styles.previewNote}>{item.previewLabel}</p>
      </div>
      <div className={styles.specification}>
        <h3><ProjectLink item={item}>{item.project.title}</ProjectLink></h3>
        <p className={styles.role}>{item.project.role}</p>
        <dl>
          <div><dt>The problem</dt><dd>{item.problem}</dd></div>
          <div><dt>The product</dt><dd>{item.product}</dd></div>
        </dl>
        <ProjectLink item={item} className={styles.projectLink}>Read the project</ProjectLink>
      </div>
    </article>
  );
}

function ProductAssembly() {
  return (
    <section id="about" className={styles.assembly} aria-labelledby="blueprint-about">
      <div className={styles.assemblyIntro}>
        <h2 id="blueprint-about">The pieces<br />have to fit.</h2>
        <p>I’m a software engineer, product designer, and founder. I work across the interface and the systems behind it.</p>
      </div>
      <ol className={styles.layers}>
        {responsibilities.map((part, index) => (
          <li key={part.title} className={styles.layer}>
            <div className={styles.layerFace}><span>{part.layer}</span><strong>{part.title}</strong><p>{part.detail}</p></div>
            {index < responsibilities.length - 1 && <span className={styles.connector} aria-hidden="true" />}
          </li>
        ))}
      </ol>
    </section>
  );
}

function AppointmentDesk() {
  return (
    <footer id="contact" className={styles.contact}>
      <div className={styles.desk}>
        <div className={styles.invitation}>
          <h2>Talk to the person<br />who builds it.</h2>
          <p>Hiring for a team or planning a product? Tell me what you need.</p>
          <div className={styles.email}><span>Prefer email?</span><EmailLink subject="A role or project to discuss" /></div>
        </div>
        <div className={styles.appointment}>
          <div className={styles.binding} aria-hidden="true"><i /><i /><i /></div>
          <p className={styles.appointmentTitle}>A first conversation</p>
          <p className={styles.appointmentNote}>Bring the context.<br />We can talk through the work.</p>
          <BookingLink className={styles.booking}>Choose a time</BookingLink>
          <p className={styles.calendarNote}>Opens my calendar on Calendly.</p>
        </div>
      </div>
      <FooterLinks className={styles.footerLinks} />
    </footer>
  );
}

export default function BlueprintBody() {
  return (
    <div className={styles.body}>
      <section id="work" className={styles.work} aria-labelledby="blueprint-work">
        <header className={styles.workHeader}>
          <h2 id="blueprint-work">From the screen<br />to the system.</h2>
          <p>Each project starts with a different problem.</p>
        </header>
        <div className={styles.studies}>{featuredProjects.map((item, index) => <LaptopStudy key={item.project.slug} item={item} index={index} />)}</div>
        <ProjectArchive className={styles.archive} />
      </section>
      <ProductAssembly />
      <AppointmentDesk />
    </div>
  );
}
