import { getStudyPreview, type ProjectStudy, type StudyDirectionId } from "../project-studies/data";
import { selectedWorkSlugs } from "../selected-work";
import { StudyActions, StudyLink, StudyMedia } from "../project-studies/primitives";
import interaction from "@/app/site/interaction.module.css";
import { getCaseStudy, getReleaseHeading } from "../project-studies/case-study";
import { StudyBack, StudyBrief, StudyComponents, StudyDecisions, StudyFlow, StudyMeasures, StudyProductVisual } from "../project-studies/case-study-primitives";
import styles from "./product-stack.module.css";

type IndexProps = { studies: readonly ProjectStudy[]; direction: StudyDirectionId };
type DetailProps = { study: ProjectStudy; direction: StudyDirectionId };

function ProjectSheet({ study, direction, index }: { study: ProjectStudy; direction: StudyDirectionId; index: number }) {
  return (
    <article id={`stack-${study.project.slug}`} className={styles.projectSheet} data-sheet={index}>
      <StudyLink study={study} direction={direction} className={styles.sheetLink}>
        <div className={styles.sheetHeading}><h2>{study.project.title}</h2><span>{study.project.year}</span></div>
        <StudyMedia asset={getStudyPreview(study)} className={styles.sheetMedia} priority={index === 0} />
        <span className={styles.openProject}>Open project <span aria-hidden="true">↗</span></span>
      </StudyLink>
    </article>
  );
}

function ProjectShelf({ studies, direction }: IndexProps) {
  if (!studies.length) return null;
  return (
    <section className={styles.shelf} aria-label="More projects">
      <h2>Keep looking.</h2>
      <div className={styles.shelfItems}>{studies.map(study => (
        <StudyLink study={study} direction={direction} className={styles.shelfProject} key={study.project.slug}>
          <StudyMedia asset={getStudyPreview(study)} className={styles.shelfMedia} caption={false} sizes="(max-width: 800px) calc((100vw - 82px) / 2), (max-width: 1556px) calc((90vw - 164px) / 4), 309px" />
          <span>{study.project.title}</span>
        </StudyLink>
      ))}</div>
    </section>
  );
}

export function ProductStackIndex({ studies, direction }: IndexProps) {
  const selected = studies.slice(0, selectedWorkSlugs.length);
  return (
    <div className={styles.stack}>
      <header className={styles.indexHeading}>
        <h1>Open the work.</h1>
        <nav className={styles.jumpTabs} aria-label="Featured projects">{selected.map(study => <a href={`#stack-${study.project.slug}`} className={interaction.action} key={study.project.slug}>{study.project.title}</a>)}</nav>
      </header>
      <section className={styles.deck} aria-label="Selected projects">{selected.map((study, index) => <ProjectSheet study={study} direction={direction} index={index} key={study.project.slug} />)}</section>
      <ProjectShelf studies={studies.slice(selectedWorkSlugs.length)} direction={direction} />
    </div>
  );
}

export function ProductStackDetail({ study, direction }: DetailProps) {
  const story = getCaseStudy(study);
  const supportingScreen = study.project.slug === "anki" ? study.media.find(asset => asset.id === "anki-home") : study.media.find(asset => asset.kind === "video");
  return (
    <article className={`${styles.stack} ${styles.caseFolio}`}>
      <StudyBack direction={direction} className={styles.folioBack} />
      <header className={styles.folioCover}>
        <div className={styles.coverText}>
          <h1>{study.project.title}</h1>
          <h2>{story.headline}</h2>
          <p>{story.introduction}</p>
          <StudyActions study={study} className={styles.folioActions} />
        </div>
        <StudyProductVisual study={study} className={styles.coverVisual} priority caption={false} />
      </header>
      <div className={styles.readingSpread}>
        <aside className={styles.marginNotes}>
          <StudyBrief study={study} className={styles.marginalBrief} />
          <h2>My part</h2><p>{story.responsibility}</p>
          <StudyMeasures study={study} className={styles.marginalMeasures} />
        </aside>
        <div className={styles.readingPages}>
          <section className={styles.problemPage}>
            <h2>The starting point.</h2><p>{story.challenge}</p>
          </section>
          <section>
            <h2>Working through the details.</h2>
            <StudyDecisions study={study} className={styles.folioDecisions} />
          </section>
          {supportingScreen && <StudyMedia asset={supportingScreen} className={styles.insertedScreen} />}
          <section>
            <h2>Inside the build.</h2>
            <StudyFlow study={study} className={styles.folioFlow} />
            <StudyComponents study={study} className={styles.buildNotes} />
            <div className={styles.folioTechnology}><h3>Built with</h3><p>{study.project.stack.join(" / ")}</p></div>
          </section>
          <section className={styles.finalPage}>
            <h2>{getReleaseHeading(study)}</h2><p>{story.outcome}</p>
            <StudyActions study={study} className={styles.folioActions} />
          </section>
        </div>
      </div>
    </article>
  );
}
