import { profile } from "@/app/socials";
import { capabilities, getFeaturedProjects, type FeaturedProject } from "@/app/portfolio/featured/content";
import { BookingLink, EmailLink, FooterLinks, ProjectArchive, ProjectLink, ProjectVisual } from "@/app/portfolio/featured/components";
import styles from "./studio-body.module.css";

function ProductStudy({ item }: { item: FeaturedProject }) {
  return (
    <article className={styles.study} data-product={item.project.slug}>
      <div className={styles.visuals} data-reveal="media">
        <ProjectVisual item={item} className={styles.mainVisual} sizes="(max-width: 700px) 86vw, 54vw" />
        <span className={styles.mediaNote}>{item.preview.label}</span>
      </div>
      <div className={styles.projectCopy} data-reveal="panel">
        <h3><ProjectLink item={item}>{item.project.title}</ProjectLink></h3>
        <p>{item.product}</p>
        <ProjectLink item={item} className={styles.readLink}>Read the project</ProjectLink>
      </div>
    </article>
  );
}

function StudioPractice() {
  return (
    <section id="about" className={styles.practice} aria-labelledby="studio-practice-heading">
      <div className={styles.practiceInner}>
        <h2 id="studio-practice-heading" data-reveal>I design it.<br />I build it.</h2>
        <div className={styles.practiceIntro} data-reveal="panel">
          <p>I work across the product decisions, the interface, and the code behind it.</p>
          <div className={styles.roles}>{profile.roles.map(role => <span key={role}>{role}</span>)}</div>
        </div>
        <div className={styles.capabilities}>
          {capabilities.map(capability => <div key={capability.title} data-reveal="panel">
            <h3>{capability.title}</h3>
            <p>{capability.text}</p>
            <small>{capability.examples}</small>
          </div>)}
        </div>
      </div>
    </section>
  );
}

function StudioInvitation({ footerDestination }: { footerDestination?: { href: string; label: string } }) {
  return (
    <footer id="contact" className={styles.contact}>
      <div className={styles.ticket}>
        <div className={styles.invitation} data-reveal="panel">
          <h2>Something<br />in mind?</h2>
          <p>Tell me what you’re hiring for, or what you’d like to build.</p>
        </div>
        <div className={styles.ticketActions} data-reveal="panel">
          <EmailLink subject="A role or project for Pablo" className={styles.email} />
          <BookingLink className={styles.book}>Book a conversation</BookingLink>
          <p>A few lines are enough to start.</p>
        </div>
        <span className={styles.fold} aria-hidden />
      </div>
      <FooterLinks className={styles.footerLinks} destination={footerDestination} />
    </footer>
  );
}

export default function StudioBody({ projectHref, footerDestination }: {
  projectHref: (slug: string) => string;
  footerDestination?: { href: string; label: string };
}) {
  const featuredProjects = getFeaturedProjects(projectHref);
  return (
    <div className={styles.studio}>
      <section id="work" className={styles.work} aria-labelledby="studio-work-heading">
        <div className={styles.workInner}>
          <header className={styles.workHeading}>
            <h2 id="studio-work-heading" data-reveal>Built from<br />the idea up.</h2>
            <p data-reveal>Products I’ve designed and built.<br />A look at what each one needed.</p>
          </header>
          <div className={styles.studies}>{featuredProjects.map(item => <ProductStudy key={item.project.slug} item={item} />)}</div>
          <ProjectArchive projectHref={projectHref} className={styles.archive} />
        </div>
      </section>
      <StudioPractice />
      <StudioInvitation footerDestination={footerDestination} />
    </div>
  );
}
