import { getStudyPreview, type ProjectStudy } from "@/app/portfolio/studies/data";
import { selectedWorkSlugs } from "@/app/portfolio/selected-work";
import { StudyActions, StudyDemo, StudyLink, StudyMedia } from "@/app/portfolio/studies/primitives";
import { getCaseStudy } from "@/app/portfolio/studies/case-study";
import { StudyBack, StudyBrief, StudyComponents, StudyDecisions, StudyFlow, StudyMeasures, StudyProductVisual } from "@/app/portfolio/studies/case-study-primitives";
import { ProjectTechnicalNotes } from "@/app/portfolio/studies/ProjectTechnicalNotes";
import styles from "./workbench.module.css";

type IndexProps = { studies: readonly ProjectStudy[]; projectHref: (slug: string) => string };
type DetailProps = { study: ProjectStudy; indexHref: string; demoHref?: string };

function BenchProject({ study, projectHref, lead = false }: {
  study: ProjectStudy; projectHref: (slug: string) => string; lead?: boolean;
}) {
  const asset = getStudyPreview(study);
  return (
    <article className={`${styles.benchProject} ${lead ? styles.leadProject : ""}`} data-reveal="media" data-enter={lead ? "pop" : undefined}>
      <div className={styles.projectMount}>
        <StudyLink href={projectHref(study.project.slug)} className={styles.projectVisual}>
          <StudyMedia asset={asset} className={styles.projectMedia} priority={lead} caption={false} />
        </StudyLink>
        {lead && <figure className={styles.indexLens} aria-hidden="true">
          <StudyMedia asset={asset} className={styles.lensMedia} detail caption={false} />
        </figure>}
      </div>
      <div className={styles.projectLabel}>
        <h2><StudyLink href={projectHref(study.project.slug)}>{study.project.title}</StudyLink></h2>
        <span>{asset.label}</span>
      </div>
    </article>
  );
}

function ProjectLedger({ studies, projectHref }: IndexProps) {
  if (!studies.length) return null;
  return (
    <section className={styles.ledger} aria-label="More projects" data-reveal="panel">
      <h2>Also built</h2>
      <div className={styles.ledgerItems}>{studies.map(study => (
        <StudyLink key={study.project.slug} href={projectHref(study.project.slug)} className={styles.ledgerLink}>
          <span>{study.project.title}</span><small>{study.project.year}</small>
        </StudyLink>
      ))}</div>
    </section>
  );
}

export function WorkbenchIndex({ studies, projectHref }: IndexProps) {
  return (
    <div className={styles.workbench}>
      <header className={styles.indexHeader}><h1 data-enter="word">On the bench.</h1><p data-enter="fade">Software. Products. Tools.</p></header>
      <section className={styles.selected} aria-label="Selected projects">
        {studies.slice(0, selectedWorkSlugs.length).map((study, index) => (
          <BenchProject key={study.project.slug} study={study} projectHref={projectHref} lead={index === 0} />
        ))}
      </section>
      <ProjectLedger studies={studies.slice(selectedWorkSlugs.length)} projectHref={projectHref} />
    </div>
  );
}

export function WorkbenchDetail({ study, indexHref, demoHref }: DetailProps) {
  const story = getCaseStudy(study);
  const supportingScreen = study.media.find((asset, index) => index > 0 && asset.kind === "screen");
  const video = study.media.find(asset => asset.kind === "video");
  return (
    <article className={`${styles.workbench} ${styles.caseStudy}`}>
      <StudyBack indexHref={indexHref} className={styles.backLink} />
      <header className={styles.caseIntro}>
        <div className={styles.introCopy} data-enter="fade">
          <h1>{study.project.title}</h1>
          <p className={styles.caseHeadline}>{story.headline}</p>
          <p className={styles.introduction}>{story.introduction}</p>
          <StudyActions study={study} className={styles.caseActions} />
        </div>
        <div className={styles.productVisual} data-enter="pop"><StudyProductVisual study={study} priority caption={false} /></div>
      </header>
      <div data-reveal="panel"><StudyBrief study={study} className={styles.caseBrief} /></div>
      <section className={styles.context} aria-label="Project context" data-reveal="panel">
        <div><h2>The problem</h2><p>{story.challenge}</p></div>
        <div><h2>What I built</h2><p>{story.outcome}</p></div>
      </section>
      <section className={styles.decisionsSection} aria-labelledby="workbench-decisions" data-reveal="panel">
        <header className={styles.sectionHeading}><h2 id="workbench-decisions">The choices behind it.</h2><p>{story.responsibility}</p></header>
        <div className={`${styles.decisionLayout} ${supportingScreen ? styles.withScreen : ""}`}>
          <StudyDecisions study={study} className={styles.caseDecisions} />
          {supportingScreen && <div className={styles.screenNote}>
            <StudyMedia asset={supportingScreen} className={styles.supportingScreen} caption boundPortrait={false} />
          </div>}
        </div>
      </section>
      {story.flow.length > 0 && <section className={styles.productFlow} aria-labelledby="workbench-flow" data-reveal="panel">
        <header className={styles.sectionHeading}><h2 id="workbench-flow">From start to finish.</h2></header>
        <StudyFlow study={study} className={styles.caseFlow} />
      </section>}
      {story.measures.length > 0 && <div data-reveal="panel"><StudyMeasures study={study} className={styles.caseMeasures} /></div>}
      {story.components.length > 0 && <section className={styles.buildNotes} aria-labelledby="workbench-build" data-reveal="panel">
        <h2 id="workbench-build">Under the surface.</h2>
        <StudyComponents study={study} />
      </section>}
      <div data-reveal="panel"><ProjectTechnicalNotes study={study} /></div>
      {study.project.embedUrl && <section className={styles.liveDemo} aria-labelledby="workbench-demo" data-reveal="panel">
        <header className={styles.sectionHeading}><h2 id="workbench-demo">Try the product.</h2></header>
        <StudyDemo study={study} fullScreenHref={demoHref} />
      </section>}
      {video && <div data-reveal="media"><StudyMedia asset={video} className={styles.caseVideo} /></div>}
    </article>
  );
}
