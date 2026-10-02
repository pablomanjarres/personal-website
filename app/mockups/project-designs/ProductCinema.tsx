import type { ProjectStudy, StudyDirectionId } from "../project-studies/data";
import { StudyActions, StudyLink, StudyMedia, StudyNext } from "../project-studies/primitives";
import { getCaseStudy, getReleaseHeading } from "../project-studies/case-study";
import { StudyBack, StudyBrief, StudyComponents, StudyDecisions, StudyFlow, StudyMeasures, StudyProductVisual } from "../project-studies/case-study-primitives";
import styles from "./product-cinema.module.css";
import interaction from "../interaction.module.css";
import { selectedWorkSlugs } from "../selected-work";

type IndexProps = { studies: readonly ProjectStudy[]; direction: StudyDirectionId };
type DetailProps = { study: ProjectStudy; nextStudy: ProjectStudy; direction: StudyDirectionId };

function ScreenCut({ study, direction, priority = false, compact = false }: { study: ProjectStudy; direction: StudyDirectionId; priority?: boolean; compact?: boolean }) {
  const asset = study.media.find(item => item.kind !== "video");
  return (
    <article className={styles.screenCut} data-reveal>
      <StudyLink study={study} direction={direction} className={styles.indexLink}>
        {asset && <StudyMedia asset={asset} className={styles.indexMedia} priority={priority} sizes={compact ? "(max-width: 700px) 88vw, (max-width: 1000px) 44vw, (max-width: 1500px) 30vw, 440px" : undefined} />}
        <div className={styles.cutCaption}><h2>{study.project.title}</h2><span>{study.project.year}</span></div>
      </StudyLink>
    </article>
  );
}

function CinemaChapters() {
  return <nav className={styles.chapters} aria-label="Case study chapters">
    <a href="#cinema-brief" className={interaction.action}>Brief</a>
    <a href="#cinema-decisions" className={interaction.action}>Decisions</a>
    <a href="#cinema-build" className={interaction.action}>Build</a>
    <a href="#cinema-release" className={interaction.action}>The build</a>
  </nav>;
}

export function ProductCinemaIndex({ studies, direction }: IndexProps) {
  const selectedCount = selectedWorkSlugs.length;
  return (
    <div className={styles.cinema}>
      <header className={styles.indexHeading}><h1>Built products.</h1><p>Open a project.</p></header>
      <section className={styles.screenings} aria-label="Selected projects">{studies.slice(0, selectedCount).map((study, index) => <ScreenCut key={study.project.slug} study={study} direction={direction} priority={index === 0} />)}</section>
      {studies.length > selectedCount && <section className={styles.catalog} aria-label="More projects">{studies.slice(selectedCount).map(study => <ScreenCut key={study.project.slug} study={study} direction={direction} compact />)}</section>}
    </div>
  );
}

export function ProductCinemaDetail({ study, nextStudy, direction }: DetailProps) {
  const story = getCaseStudy(study);
  const supportingScreen = study.project.slug === "anki" ? study.media.find(asset => asset.id === "anki-review") : study.media.find(asset => asset.kind === "video");
  return (
    <article className={`${styles.cinema} ${styles.caseCinema}`}>
      <StudyBack direction={direction} className={styles.back} />
      <header className={styles.openingFrame}>
        <div className={styles.openingCopy}>
          <h1>{study.project.title}</h1>
          <h2>{story.headline}</h2>
          <p>{story.introduction}</p>
          <StudyActions study={study} className={styles.projectActions} />
        </div>
        <StudyProductVisual study={study} className={styles.heroVisual} priority caption={false} />
      </header>
      <StudyBrief study={study} className={styles.visibleBrief} />
      <CinemaChapters />
      <section id="cinema-brief" className={styles.briefScene}>
        <header><span>The brief</span><h2>What the product needed.</h2></header>
        <div className={styles.briefCopy}>
          <p>{story.challenge}</p>
          <div><h3>My part</h3><p>{story.responsibility}</p></div>
        </div>
      </section>
      <StudyMeasures study={study} className={styles.productMeasures} />
      <section id="cinema-decisions" className={styles.decisionScene}>
        <header><h2>Decisions that shaped it.</h2><p>How the interface and the system fit together.</p></header>
        <div className={styles.decisionLayout} data-has-media={Boolean(supportingScreen)}>
          <StudyDecisions study={study} className={styles.decisionList} />
          {supportingScreen && <StudyMedia asset={supportingScreen} className={styles.supportingScreen} />}
        </div>
      </section>
      <section id="cinema-build" className={styles.buildScene}>
        <header><h2>{story.flow.length ? "How it works." : "Inside the build."}</h2>{story.flow.length > 0 && <p>The path through the product.</p>}</header>
        <StudyFlow study={study} className={styles.buildFlow} />
        <StudyComponents study={study} className={styles.systemParts} />
        <div className={styles.technology}><h3>Built with</h3><p>{study.project.stack.join(" / ")}</p></div>
      </section>
      <section id="cinema-release" className={styles.releaseScene}>
        <h2>{getReleaseHeading(study)}</h2>
        <div><p>{story.outcome}</p><StudyActions study={study} className={styles.projectActions} /></div>
      </section>
      <footer className={styles.nextScene}><StudyNext study={nextStudy} direction={direction} className={styles.next} /></footer>
    </article>
  );
}
