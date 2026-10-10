import Link from "next/link";
import { SiteShell, Portrait, ActionLinks } from "@/app/site/components";
import StudioBody from "./StudioBody";
import { openStudioTheme } from "@/app/site/theme";
import { profile } from "@/app/socials";
import { projects, type Project } from "@/app/projects";
import styles from "./open-studio.module.css";

const orbitProjects = ["nella", "cortex"].map(slug => projects.find(project => project.slug === slug)!);

function OrbitProject({ project, href }: { project: Project; href: string }) {
  return (
    <Link className={styles.project} href={href} data-project={project.slug}>
      <span className={styles.projectSymbol} aria-hidden>{project.slug === "nella" ? "✳" : "⌘"}</span>
      <span><strong>{project.title}</strong><small>{project.tags[0]}</small></span>
      <span className={styles.projectArrow} aria-hidden>↗</span>
    </Link>
  );
}

type OpenStudioProps = {
  projectHref: (slug: string) => string;
  archiveHref?: string;
  footerDestination?: { href: string; label: string };
};

export default function OpenStudio({ projectHref, archiveHref, footerDestination }: OpenStudioProps) {
  return (
    <SiteShell theme={openStudioTheme}>
      <section className={styles.hero} aria-labelledby="studio-heading">
        <p className={styles.signature} data-enter="fade">{profile.name}</p>
        <h1 id="studio-heading" className={styles.headline} data-enter="word">Ideas taking shape.</h1>
        <p className={styles.note} data-enter="fade">I design products and build the software behind them.</p>
        <div className={styles.orbitStage}>
          <div className={styles.halo} aria-hidden />
          <svg className={styles.orbits} viewBox="0 0 1080 560" fill="none" aria-hidden>
            <ellipse className={styles.orbitPath} cx="540" cy="290" rx="430" ry="158" transform="rotate(-15 540 290)" pathLength="1" />
            <ellipse className={styles.innerPath} cx="540" cy="290" rx="315" ry="223" transform="rotate(19 540 290)" pathLength="1" />
            <circle cx="143" cy="301" r="5" />
            <circle cx="939" cy="264" r="7" />
          </svg>
          <figure className={styles.portraitWrap} data-enter="clip"><Portrait portrait="forest" /></figure>
          <div className={styles.roles} aria-label="What I do">
            {profile.roles.map(role => <span key={role} className={styles.role} data-enter="pop"><i aria-hidden />{role}</span>)}
          </div>
          <div className={styles.orbitProjects}>{orbitProjects.map(project => <OrbitProject key={project.slug} project={project} href={projectHref(project.slug)} />)}</div>
          <svg className={styles.pinwheel} viewBox="0 0 80 80" aria-hidden>
            <path d="M40 7C53 7 66 14 66 27C66 37 57 41 40 40C42 23 39 13 40 7ZM73 40C73 53 66 66 53 66C43 66 39 57 40 40C57 42 67 39 73 40ZM40 73C27 73 14 66 14 53C14 43 23 39 40 40C38 57 41 67 40 73ZM7 40C7 27 14 14 27 14C37 14 41 23 40 40C23 38 13 41 7 40Z" />
          </svg>
        </div>
        <ActionLinks className={styles.actions} />
      </section>
      <StudioBody projectHref={projectHref} archiveHref={archiveHref} footerDestination={footerDestination} />
    </SiteShell>
  );
}
