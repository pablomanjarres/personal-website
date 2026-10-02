import { getFeaturedProjects, capabilities, type FeaturedProject } from "./content";
import { ProjectVisual, ProjectLink, ProjectArchive, EmailLink, BookingLink, FooterLinks } from "./primitives";
import styles from "./garden-body.module.css";

const concept = "green-room";
const featuredProjects = getFeaturedProjects(concept);

function ProjectPlot({ item }: { item: FeaturedProject }) {
  return (
    <article className={styles.plot} data-project={item.project.slug}>
      <div className={styles.projectText}>
        <h3><ProjectLink item={item}>{item.project.title}</ProjectLink></h3>
        <p>{item.product}</p>
        <ProjectLink item={item} className={styles.projectAction}>Read about {item.project.title}</ProjectLink>
      </div>
      <ProjectVisual item={item} className={styles.preview} sizes="(max-width: 700px) 90vw, 65vw" />
    </article>
  );
}

function SkillsLandscape() {
  return (
    <section id="about" className={styles.about} aria-labelledby="garden-about-heading">
      <div className={styles.aboutHeading}>
        <h2 id="garden-about-heading">The screen.<br />The systems.<br />The product.</h2>
        <p>Software engineering, product design, and building a company all meet in the work I do.</p>
      </div>
      <div className={styles.skills}>
        {capabilities.map(capability => (
          <div className={styles.skill} key={capability.title}>
            <h3>{capability.title}</h3>
            <p>{capability.text}</p>
            <small>{capability.examples}</small>
          </div>
        ))}
      </div>
    </section>
  );
}

function GardenContact() {
  return (
    <footer id="contact" className={styles.contact} aria-labelledby="garden-contact-heading">
      <div className={styles.contactHeading}>
        <h2 id="garden-contact-heading">Need someone<br />to build it?</h2>
        <div className={styles.contactNote}>
          <p>Tell me about the role, the team, or the product you have in mind.</p>
          <BookingLink className={styles.booking}>Find a time to talk</BookingLink>
        </div>
      </div>
      <EmailLink className={styles.email} subject="A role or project to talk about" />
      <FooterLinks className={styles.footerLinks} />
    </footer>
  );
}

export default function GardenBody() {
  return (
    <div className={styles.body}>
      <section id="work" className={styles.work} aria-labelledby="garden-work-heading">
        <div className={styles.workHeading}>
          <h2 id="garden-work-heading">A few things<br />I&apos;ve built.</h2>
          <p>Studying. Lending.<br />Keeping track of daily work.</p>
        </div>
        <div className={styles.terrain}>{featuredProjects.map(item => <ProjectPlot key={item.project.slug} item={item} />)}</div>
        <ProjectArchive concept={concept} className={styles.archive} />
      </section>
      <SkillsLandscape />
      <GardenContact />
    </div>
  );
}
