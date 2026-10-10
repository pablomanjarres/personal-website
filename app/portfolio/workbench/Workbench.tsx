import { getStudyPreview, getStudySupportingMedia, type ProjectStudy } from "@/app/portfolio/studies/data";
import { selectedWorkSlugs } from "@/app/portfolio/selected-work";
import { StudyActions, StudyDemo, StudyMedia } from "@/app/portfolio/studies/primitives";
import { getCaseStudy } from "@/app/portfolio/studies/case-study";
import { StudyBack, StudyBrief, StudyComponents, StudyDecisions, StudyFlow, StudyMeasures, StudyProductVisual } from "@/app/portfolio/studies/case-study-primitives";
import { ProjectTechnicalNotes } from "@/app/portfolio/studies/ProjectTechnicalNotes";
import { StudyInterfaceGallery } from "@/app/portfolio/studies/interface-gallery";
import { isWebsiteStudy } from "@/app/portfolio/web-studies/catalog";
import interaction from "@/app/site/interaction.module.css";
import { BenchProject } from "./BenchProject";
import styles from "./workbench.module.css";

type IndexProps = { studies: readonly ProjectStudy[]; projectHref: (slug: string) => string };
type DetailProps = { study: ProjectStudy; indexHref: string; demoHref?: string };
type Collection = { id: string; label: string; title?: string; description?: string; studies: readonly ProjectStudy[]; featured?: boolean };

function CollectionNavigation({ collections }: { collections: readonly Collection[] }) {
  return (
    <nav className={styles.collectionNavigation} aria-label="Project collections">
      {collections.map(collection => (
        <a key={collection.id} href={`#${collection.id}`} className={`${interaction.action} ${interaction.button}`} aria-label={`${collection.label}, ${collection.studies.length} projects`}>
          <span>{collection.label}</span><span className={styles.collectionCount} aria-hidden="true">{collection.studies.length}</span>
        </a>
      ))}
    </nav>
  );
}

function ProjectCollection({ collection, projectHref }: { collection: Collection; projectHref: IndexProps["projectHref"] }) {
  return (
    <section id={collection.id} className={styles.projectCollection} aria-label={collection.title ? undefined : collection.label} aria-labelledby={collection.title ? `${collection.id}-heading` : undefined}>
      {collection.title && <header className={styles.collectionHeading} data-reveal="panel">
        <h2 id={`${collection.id}-heading`}>{collection.title}</h2>
        {collection.description && <p>{collection.description}</p>}
      </header>}
      <div className={styles.selected}>{collection.studies.map((study, index) => (
        <BenchProject key={study.project.slug} study={study} projectHref={projectHref} lead={collection.featured && index === 0} />
      ))}</div>
    </section>
  );
}

export function WorkbenchIndex({ studies, projectHref }: IndexProps) {
  const studiesBySlug = new Map(studies.map(study => [study.project.slug, study]));
  const selectedSlugs = new Set<string>(selectedWorkSlugs);
  const selected = selectedWorkSlugs.map(slug => studiesBySlug.get(slug)).filter((study): study is ProjectStudy => Boolean(study));
  const remaining = studies.filter(study => !selectedSlugs.has(study.project.slug));
  const products = remaining.filter(study => !isWebsiteStudy(study.project.slug));
  const websites = remaining.filter(study => isWebsiteStudy(study.project.slug));
  const collections: Collection[] = [
    { id: "selected-work", label: "Selected work", studies: selected, featured: true },
    { id: "products-and-tools", label: "Products and tools", title: "Products and tools.", description: "Applications, experiments and everyday tools. Open a project to explore the interface, the build and the decisions behind it.", studies: products },
    { id: "websites", label: "Websites", title: "Websites and identities.", description: `${websites.length} more projects across commerce, hospitality and creative work. Open a study to see the design decisions, live website and brand kit.`, studies: websites },
  ].filter(collection => collection.studies.length > 0);
  return (
    <div className={styles.workbench}>
      <header className={styles.indexHeader}><h1 data-enter="word">On the bench.</h1><p data-enter="fade">Software. Products. Tools.</p></header>
      <CollectionNavigation collections={collections} />
      {collections.map(collection => <ProjectCollection key={collection.id} collection={collection} projectHref={projectHref} />)}
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
