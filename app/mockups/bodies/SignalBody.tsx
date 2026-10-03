import { Status } from "../../portfolio/components";
import { profile } from "../../socials";
import { capabilities, getFeaturedProjects, type FeaturedProject } from "./content";
import { BookingLink, EmailLink, ProjectLink, ProjectVisual } from "@/app/portfolio/featured/components";
import { BuildingLink, FooterLinks, ProjectArchive } from "./primitives";
import styles from "./signal-body.module.css";

const concept = "signal";
const featuredProjects = getFeaturedProjects(concept);

function FieldStudy({ item }: { item: FeaturedProject }) {
  return (
    <article className={styles.study} data-project={item.project.slug}>
      <div className={styles.studyCopy}>
        <p className={styles.need}>{item.problem}</p>
        <h3><ProjectLink item={item}>{item.project.title}</ProjectLink></h3>
        <p className={styles.product}>{item.product}</p>
        <p className={styles.credit}>{item.project.role}</p>
        <div className={styles.status}><Status status={item.project.status} /></div>
        <ProjectLink item={item} className={styles.read}>Read the project</ProjectLink>
      </div>
      <figure className={styles.studyImage}>
        <ProjectVisual item={item} className={styles.visual} sizes="(max-width: 700px) 88vw, 54vw" />
        <figcaption><span>{item.previewLabel}</span><span>{item.note}</span></figcaption>
      </figure>
    </article>
  );
}

function ProfileNote() {
  return (
    <section id="about" className={styles.profile} aria-labelledby="signal-about">
      <div className={styles.profileInner}>
        <aside className={styles.sideNote}>
          <h2 id="signal-about">A little about me.</h2>
          <p>I’m Pablo. I’m a software engineer, product designer, and founder. I work on web apps, AI tools, and developer products.</p>
          <BuildingLink concept={concept} className={styles.current}>Currently building {profile.building}.</BuildingLink>
        </aside>
        <div className={styles.disciplines}>
          {capabilities.map(capability => <div key={capability.title}><h3>{capability.title}</h3><p>{capability.text}</p></div>)}
        </div>
      </div>
    </section>
  );
}

function Invitation() {
  return (
    <footer id="contact" className={styles.contact} aria-labelledby="signal-contact">
      <div className={styles.invitation}>
        <h2 id="signal-contact">Tell me<br />about the work.</h2>
        <div className={styles.reply}>
          <p>A role on your team, a product to build, or an idea to talk through. A few lines are enough.</p>
          <EmailLink className={styles.email} />
          <BookingLink className={styles.booking}>Prefer a call? Book a conversation.</BookingLink>
        </div>
      </div>
      <FooterLinks className={styles.footerLinks} />
    </footer>
  );
}

export default function SignalBody() {
  return (
    <div className={styles.body}>
      <section id="work" className={styles.work} aria-labelledby="signal-work">
        <div className={styles.workIntro}>
          <h2 id="signal-work">Products with<br />a job to do.</h2>
          <p>A study app, lending software, and a desktop dashboard.</p>
        </div>
        <div className={styles.studies}>{featuredProjects.map(item => <FieldStudy key={item.project.slug} item={item} />)}</div>
        <ProjectArchive concept={concept} className={styles.archive} />
      </section>
      <ProfileNote />
      <Invitation />
    </div>
  );
}
