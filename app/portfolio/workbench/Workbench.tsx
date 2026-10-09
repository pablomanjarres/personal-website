import { getStudyPreview, getStudySupportingMedia, type ProjectStudy } from "@/app/portfolio/studies/data";
import { selectedWorkSlugs } from "@/app/portfolio/selected-work";
import { StudyActions, StudyDemo, StudyLink, StudyMedia } from "@/app/portfolio/studies/primitives";
import { getCaseStudy } from "@/app/portfolio/studies/case-study";
import { StudyBack, StudyBrief, StudyComponents, StudyDecisions, StudyFlow, StudyMeasures, StudyProductVisual } from "@/app/portfolio/studies/case-study-primitives";
import { ProjectTechnicalNotes } from "@/app/portfolio/studies/ProjectTechnicalNotes";
import { StudyInterfaceGallery } from "@/app/portfolio/studies/interface-gallery";
import { isWebsiteStudy } from "@/app/portfolio/web-studies/catalog";
import { BenchProject } from "./BenchProject";
import styles from "./workbench.module.css";

type IndexProps = { studies: readonly ProjectStudy[]; projectHref: (slug: string) => string };
type DetailProps = { study: ProjectStudy; indexHref: string; demoHref?: string };

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
  const products = studies.filter(study => !isWebsiteStudy(study.project.slug));
  const websites = studies.filter(study => isWebsiteStudy(study.project.slug));
  return (
    <div className={styles.workbench}>
      <header className={styles.indexHeader}><h1 data-enter="word">On the bench.</h1><p data-enter="fade">Software. Products. Tools.</p></header>
      <section className={styles.selected} aria-label="Selected projects">
        {products.slice(0, selectedWorkSlugs.length).map((study, index) => (
          <BenchProject key={study.project.slug} study={study} projectHref={projectHref} lead={index === 0} />
        ))}
      </section>
      {websites.length > 0 && <section className={styles.websiteStudies} aria-labelledby="website-studies-heading">
        <header className={styles.websiteHeading} data-reveal="panel">
          <h2 id="website-studies-heading">Websites and identities.</h2>
          <p>{websites.length} distinct projects, from a mountain retreat to a working studio dashboard. Open a study to see its design decisions, live website and brand kit.</p>
        </header>
        <div className={styles.selected}>{websites.map(study => <BenchProject key={study.project.slug} study={study} projectHref={projectHref} />)}</div>
      </section>}
      <ProjectLedger studies={products.slice(selectedWorkSlugs.length)} projectHref={projectHref} />
    </div>
  );
}

export function WorkbenchDetail({ study, indexHref, demoHref }: DetailProps) {
  const story = getCaseStudy(study);
  const supportingMedia = getStudySupportingMedia(study);
  const preview = getStudyPreview(study);
  const additionalPresentations = study.media.filter(asset => asset.kind === "presentation" && asset.id !== preview.id && asset.id !== supportingMedia?.id);
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
        <div className={styles.productVisual} data-enter="pop"><StudyProductVisual study={study} priority caption={false} sizes="(max-width: 700px) 88vw, (max-width: 800px) 90vw, (max-width: 1550px) 40vw, 620px" /></div>
      </header>
      <div data-reveal="panel"><StudyBrief study={study} className={styles.caseBrief} /></div>
      {additionalPresentations.length > 0 && <section className={styles.physicalPresentations} aria-label="The design in context">
        {additionalPresentations.map(asset => <div key={asset.id} data-reveal="media"><StudyMedia asset={asset} sizes="(max-width: 700px) 88vw, (max-width: 1611px) 90vw, 1450px" /></div>)}
      </section>}
      <section className={styles.context} aria-label="Project context" data-reveal="panel">
        <div><h2>The problem</h2><p>{story.challenge}</p></div>
        <div><h2>What I built</h2><p>{story.outcome}</p></div>
      </section>
      <StudyInterfaceGallery study={study} />
      <section className={styles.decisionsSection} aria-labelledby="workbench-decisions" data-reveal="panel">
        <header className={styles.sectionHeading}><h2 id="workbench-decisions">The choices behind it.</h2><p>{story.responsibility}</p></header>
        <div className={`${styles.decisionLayout} ${supportingMedia ? styles.withScreen : ""}`}>
          <StudyDecisions study={study} className={styles.caseDecisions} />
          {supportingMedia && <div className={styles.screenNote}>
            <StudyMedia asset={supportingMedia} className={styles.supportingScreen} caption boundPortrait={false} sizes="(max-width: 700px) calc(88vw - 56px), (max-width: 800px) 82vw, (max-width: 1550px) 24vw, 375px" />
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
