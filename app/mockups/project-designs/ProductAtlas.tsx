import { getStudyPreview, type ProjectStudy, type StudyDirectionId } from "../project-studies/data";
import { StudyActions, StudyDemo, StudyLink, StudyMedia } from "../project-studies/primitives";
import { getCaseStudy } from "../project-studies/case-study";
import { StudyBack, StudyBrief, StudyComponents, StudyDecisions, StudyFlow, StudyMeasures, StudyProductVisual } from "../project-studies/case-study-primitives";
import interaction from "../interaction.module.css";
import styles from "./product-atlas.module.css";
import { selectedWorkSlugs } from "../selected-work";

type IndexProps = { studies: readonly ProjectStudy[]; direction: StudyDirectionId };
type DetailProps = { study: ProjectStudy; direction: StudyDirectionId };

function mapAsset(study: ProjectStudy) {
  return study.media.find(asset => asset.kind === "screen")
    ?? getStudyPreview(study);
}

function ProductLandmark({ study, direction, compact = false, priority = false }: {
  study: ProjectStudy; direction: StudyDirectionId; compact?: boolean; priority?: boolean;
}) {
  const asset = mapAsset(study);
  const media = <StudyMedia asset={asset} className={compact ? styles.compactMedia : styles.mapMedia} priority={priority} sizes={compact ? "(max-width: 700px) 41vw, 33vw" : undefined} />;
  return <article id={`project-${study.project.slug}`} className={compact ? styles.compactLandmark : styles.landmark} data-reveal>
    <div className={styles.landmarkLabel}>
      <h2><StudyLink study={study} direction={direction}>{study.project.title}</StudyLink></h2>
      {!compact && <span>{study.project.tags[0]}</span>}
    </div>
    {asset.kind === "video" ? media : <StudyLink study={study} direction={direction} className={styles.landmarkWindow}>{media}</StudyLink>}
  </article>;
}

function MapRail({ studies }: { studies: readonly ProjectStudy[] }) {
  return <aside className={styles.rail}>
    <nav aria-label="Featured projects">
      <span className={styles.railLabel}>Find a project</span>
      <div className={styles.progressTrack} aria-hidden="true"><span /></div>
      {studies.map(study => <a key={study.project.slug} href={`#project-${study.project.slug}`} className={interaction.action}>{study.project.title}</a>)}
      <a href="#more-work" className={interaction.action}>More work</a>
    </nav>
  </aside>;
}

export function ProductAtlasIndex({ studies, direction }: IndexProps) {
  const featured = studies.slice(0, selectedWorkSlugs.length);
  return <div className={styles.atlas}>
    <header className={styles.indexHeader}>
      <h1>Products<br />in practice.</h1>
      <p>Software, interfaces, and tools.</p>
    </header>
    <div className={styles.map}>
      <MapRail studies={featured} />
      <section className={styles.mainRoute} aria-label="Selected projects">
        {featured.map((study, index) => <ProductLandmark key={study.project.slug} study={study} direction={direction} priority={index === 0} />)}
      </section>
    </div>
    <section id="more-work" className={styles.moreWork} aria-labelledby="atlas-more-heading">
      <h2 id="atlas-more-heading">More work.</h2>
      <div className={styles.satellites}>{studies.slice(selectedWorkSlugs.length).map(study => <ProductLandmark key={study.project.slug} study={study} direction={direction} compact />)}</div>
    </section>
  </div>;
}

export function ProductAtlasDetail({ study, direction }: DetailProps) {
  const story = getCaseStudy(study);
  const hasArchitecture = story.flow.length > 0 || story.components.length > 0;
  return <div className={`${styles.atlas} ${styles.caseStudy}`}>
    <StudyBack direction={direction} className={styles.back} />
    <header className={styles.detailHeader}>
      <h1>{study.project.title}</h1>
      <p>{story.headline}</p>
      <StudyBrief study={study} className={styles.briefFacts} />
    </header>
    <section className={styles.fullView} aria-label={`${study.project.title} product interface`}>
      <StudyProductVisual study={study} className={styles.fullMedia} priority sizes="(max-width: 700px) 88vw, 86vw" />
    </section>
    <div className={styles.detailMap}>
      <aside className={styles.detailRail}><nav aria-label="Case study sections">
        <a href="#brief" className={interaction.action}>Brief</a>
        <a href="#decisions" className={interaction.action}>Decisions</a>
        {hasArchitecture && <a href="#architecture" className={interaction.action}>Architecture</a>}
      </nav></aside>
      <div className={styles.detailRoute}>
        <section id="brief" className={styles.storySection} aria-labelledby="atlas-brief-heading">
          <h2 id="atlas-brief-heading">The brief.</h2>
          <p className={styles.introduction}>{story.introduction}</p>
          <div className={styles.context}>
            <article><h3>The challenge</h3><p>{story.challenge}</p></article>
            <article><h3>My responsibility</h3><p>{story.responsibility}</p></article>
          </div>
          <div className={styles.outcome}><h3>The result</h3><p>{story.outcome}</p><StudyMeasures study={study} className={styles.measures} /></div>
        </section>
        <section id="decisions" className={styles.storySection} aria-labelledby="atlas-decisions-heading">
          <h2 id="atlas-decisions-heading">Decisions that shaped it.</h2>
          <StudyDecisions study={study} className={styles.decisions} />
        </section>
        {hasArchitecture && <section id="architecture" className={styles.storySection} aria-labelledby="atlas-architecture-heading">
          <h2 id="atlas-architecture-heading">How it fits together.</h2>
          <StudyFlow study={study} className={styles.flow} />
          <StudyComponents study={study} className={styles.components} />
          <div className={styles.stack}><h3>Built with</h3><p>{study.project.stack.join(" / ")}</p></div>
        </section>}
        {study.project.embedUrl && <section className={styles.demoSection} aria-label="Try the product"><h2>Try the product.</h2><StudyDemo study={study} className={styles.productDemo} /></section>}
        <StudyActions study={study} className={styles.actions} />
      </div>
    </div>
  </div>;
}
