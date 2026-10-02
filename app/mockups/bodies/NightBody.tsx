import { profile } from "../../socials";
import { featuredProjects, type FeaturedProject } from "./content";
import { ProjectVisual, ProjectLink, ProjectArchive, EmailLink, BookingLink, FooterLinks } from "./primitives";
import styles from "./night-body.module.css";

function Screening({ item }: { item: FeaturedProject }) {
  return (
    <article className={styles.screening} data-project={item.project.slug} aria-labelledby={`night-${item.project.slug}`}>
      <header className={styles.projectHeading}>
        <h3 id={`night-${item.project.slug}`}><ProjectLink item={item} className={styles.titleLink}>{item.project.title}</ProjectLink></h3>
        <p className={styles.projectRole}>{item.project.role}</p>
      </header>
      <div className={styles.projection} data-reveal>
        <ProjectVisual item={item} className={styles.screen} sizes="(max-width: 700px) 92vw, 85vw" />
        <p className={styles.frameNote}>{item.note}</p>
      </div>
      <div className={styles.caption}>
        <p className={styles.problem}>{item.problem}</p>
        <p className={styles.product}>{item.product}</p>
        <ProjectLink item={item} className={styles.caseLink}>Read about {item.project.title}</ProjectLink>
      </div>
    </article>
  );
}

function WorkingRoles() {
  return (
    <section id="about" className={styles.about} aria-labelledby="night-about">
      <div className={styles.aboutHeading}><h2 id="night-about">Across the<br />whole product.</h2><p>From the first decisions<br />to the working software.</p></div>
      <div className={styles.roleStage}>
        <div className={styles.beam} aria-hidden="true" />
        <div className={styles.roles}>{profile.roles.map(role => <span key={role}>{role}</span>)}</div>
        <p>I work across AI products, web apps, and developer tools. The interface and the systems behind it are part of the same job.</p>
      </div>
    </section>
  );
}

function ClosingTitles() {
  return (
    <footer id="contact" className={styles.closing} aria-labelledby="night-contact">
      <p className={styles.invitation}>Have a role or a product in mind?</p>
      <h2 id="night-contact">See a fit?<br />Let’s talk.</h2>
      <div className={styles.reply}><EmailLink subject="A role or product for Pablo" className={styles.email} /><BookingLink className={styles.booking}>Book a conversation</BookingLink></div>
      <p className={styles.replyNote}>Tell me what you’re working on.</p>
      <FooterLinks className={styles.footer} />
    </footer>
  );
}

export default function NightBody() {
  return (
    <div className={styles.body}>
      <section id="work" className={styles.work} aria-labelledby="night-work">
        <div className={styles.opening}><h2 id="night-work">The work,<br />in focus.</h2><p>Selected products.<br />Different problems.</p></div>
        {featuredProjects.map(item => <Screening key={item.project.slug} item={item} />)}
        <ProjectArchive className={styles.archive} />
      </section>
      <WorkingRoles />
      <ClosingTitles />
    </div>
  );
}
