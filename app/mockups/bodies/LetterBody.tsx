import Image from "next/image";
import { profile } from "../../socials";
import { getFeaturedProjects, type FeaturedProject } from "./content";
import { BuildingLink, BookingLink, EmailLink, FooterLinks, ProjectArchive, ProjectLink, ProjectVisual } from "./primitives";
import styles from "./letter-body.module.css";

const concept = "soft-focus";
const featuredProjects = getFeaturedProjects(concept);

function FolioEntry({ item }: { item: FeaturedProject }) {
  return (
    <article className={styles.entry} data-project={item.project.slug}>
      <header className={styles.projectHeading}>
        <h3><ProjectLink item={item}>{item.project.title}</ProjectLink></h3>
        <p>{item.project.role}</p>
      </header>
      <figure className={styles.placement}>
        <ProjectVisual item={item} className={styles.visual} sizes="(max-width: 700px) 88vw, 76vw" />
        <figcaption>{item.previewLabel}</figcaption>
      </figure>
      <aside className={styles.marginNote}>
        <p>{item.product}</p>
        <ProjectLink item={item} className={styles.projectLink}>Read the project</ProjectLink>
      </aside>
    </article>
  );
}

function PersonalLetter() {
  return (
    <section id="about" className={styles.letter} aria-labelledby="letter-about">
      <div className={styles.letterPortrait}>
        <Image src="/mockups/portraits/hoodie.webp" alt={profile.name} width={1122} height={1402} sizes="(max-width: 700px) 34vw, 220px" />
        <span>{profile.name}</span>
      </div>
      <div className={styles.letterCopy}>
        <h2 id="letter-about">A note from me.</h2>
        <p>My work spans software engineering, product design, and founding products. I design the screens and build the systems behind them.</p>
        <p>I’m building <BuildingLink concept={concept}>{profile.building}</BuildingLink>. The projects here cover studying, lending, and daily work.</p>
        <p>If you’re looking for someone who can work across design and implementation, these are the projects I’d point you to.</p>
      </div>
    </section>
  );
}

function OpenPostcard() {
  return (
    <footer id="contact" className={styles.contact} aria-labelledby="letter-contact">
      <div className={styles.postcard}>
        <div className={styles.message}>
          <span>To {profile.name}</span>
          <h2 id="letter-contact">Write when<br />you’re ready.</h2>
          <p>When you want to talk about a role or a project, send me a note.</p>
        </div>
        <div className={styles.reply}>
          <span>A place to start</span>
          <EmailLink className={styles.email} />
          <BookingLink className={styles.booking}>Or book a call.</BookingLink>
        </div>
      </div>
      <FooterLinks className={styles.footerLinks} />
    </footer>
  );
}

export default function LetterBody() {
  return (
    <div className={styles.body}>
      <section id="work" className={styles.work} aria-labelledby="letter-work">
        <div className={styles.intro}>
          <h2 id="letter-work">A selection<br />of my work.</h2>
          <p>Some products I’ve designed and built.<br />Open a project for the details.</p>
        </div>
        <div className={styles.folio}>{featuredProjects.map(item => <FolioEntry key={item.project.slug} item={item} />)}</div>
        <ProjectArchive concept={concept} className={styles.archive} />
      </section>
      <PersonalLetter />
      <OpenPostcard />
    </div>
  );
}
