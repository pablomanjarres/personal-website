import { getStudyPreview, type ProjectStudy, type StudyDirectionId } from "../project-studies/data";
import { selectedWorkSlugs } from "../selected-work";
import { StudyActions, StudyLink, StudyMedia } from "../project-studies/primitives";
import { getCaseStudy } from "../project-studies/case-study";
import { StudyBack, StudyBrief, StudyComponents, StudyDecisions, StudyFlow, StudyMeasures, StudyProductVisual } from "../project-studies/case-study-primitives";
import styles from "./product-workbench.module.css";

type IndexProps = { studies: readonly ProjectStudy[]; direction: StudyDirectionId };
type DetailProps = { study: ProjectStudy; direction: StudyDirectionId };

function BenchProject({ study, direction, lead = false }: {
  study: ProjectStudy; direction: StudyDirectionId; lead?: boolean;
}) {
  const asset = getStudyPreview(study);
  return (
    <article className={`${styles.benchProject} ${lead ? styles.leadProject : ""}`}>
      <div className={styles.projectMount}>
        <StudyLink study={study} direction={direction} className={styles.projectVisual}>
          <StudyMedia asset={asset} className={styles.projectMedia} priority={lead} caption={false} />
        </StudyLink>
        {lead && <figure className={styles.indexLens} aria-hidden="true">
          <StudyMedia asset={asset} className={styles.lensMedia} detail caption={false} />
        </figure>}
      </div>
      <div className={styles.projectLabel}>
        <h2><StudyLink study={study} direction={direction}>{study.project.title}</StudyLink></h2>
        <span>{asset.label}</span>
      </div>
    </article>
  );
}

function ProjectLedger({ studies, direction }: IndexProps) {
  if (!studies.length) return null;
  return (
    <section className={styles.ledger} aria-label="More projects">
      <h2>Also built</h2>
      <div className={styles.ledgerItems}>{studies.map(study => (
        <StudyLink key={study.project.slug} study={study} direction={direction} className={styles.ledgerLink}>
          <span>{study.project.title}</span><small>{study.project.year}</small>
        </StudyLink>
      ))}</div>
    </section>
  );
}

export function ProductWorkbenchIndex({ studies, direction }: IndexProps) {
  return (
    <div className={styles.workbench}>
      <header className={styles.indexHeader}><h1>On the bench.</h1><p>Software. Products. Tools.</p></header>
      <section className={styles.selected} aria-label="Selected projects">
        {studies.slice(0, selectedWorkSlugs.length).map((study, index) => (
          <BenchProject key={study.project.slug} study={study} direction={direction} lead={index === 0} />
        ))}
      </section>
      <ProjectLedger studies={studies.slice(selectedWorkSlugs.length)} direction={direction} />
    </div>
  );
}

export function ProductWorkbenchDetail({ study, direction }: DetailProps) {
  const story = getCaseStudy(study);
  const supportingScreen = study.media.find((asset, index) => index > 0 && asset.kind === "screen");
  const video = study.media.find(asset => asset.kind === "video");
  return (
    <article className={`${styles.workbench} ${styles.caseStudy}`}>
      <StudyBack direction={direction} className={styles.backLink} />
      <header className={styles.caseIntro}>
        <div className={styles.introCopy}>
          <h1>{study.project.title}</h1>
          <p className={styles.caseHeadline}>{story.headline}</p>
          <p className={styles.introduction}>{story.introduction}</p>
          <StudyActions study={study} className={styles.caseActions} />
        </div>
        <StudyProductVisual study={study} priority caption={false} className={styles.productVisual} />
      </header>
      <StudyBrief study={study} className={styles.caseBrief} />
      <section className={styles.context} aria-label="Project context">
        <div><h2>The problem</h2><p>{story.challenge}</p></div>
        <div><h2>What I built</h2><p>{story.outcome}</p></div>
      </section>
      <section className={styles.decisionsSection} aria-labelledby="workbench-decisions">
        <header className={styles.sectionHeading}><h2 id="workbench-decisions">The choices behind it.</h2><p>{story.responsibility}</p></header>
        <div className={`${styles.decisionLayout} ${supportingScreen ? styles.withScreen : ""}`}>
          <StudyDecisions study={study} className={styles.caseDecisions} />
          {supportingScreen && <div className={styles.screenNote}>
            <StudyMedia asset={supportingScreen} className={styles.supportingScreen} caption boundPortrait={false} />
          </div>}
        </div>
      </section>
      {story.flow.length > 0 && <section className={styles.productFlow} aria-labelledby="workbench-flow">
        <header className={styles.sectionHeading}><h2 id="workbench-flow">From start to finish.</h2></header>
        <StudyFlow study={study} className={styles.caseFlow} />
      </section>}
      {story.measures.length > 0 && <StudyMeasures study={study} className={styles.caseMeasures} />}
      {story.components.length > 0 && <section className={styles.buildNotes} aria-labelledby="workbench-build">
        <h2 id="workbench-build">Under the surface.</h2>
        <StudyComponents study={study} />
      </section>}
      {video && <StudyMedia asset={video} className={styles.caseVideo} />}
    </article>
  );
}
