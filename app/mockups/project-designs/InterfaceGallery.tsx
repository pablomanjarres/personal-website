import type { ProjectStudy } from "@/app/portfolio/studies/data";
import type { StudyDirectionId } from "../project-studies/data";
import { selectedWorkSlugs } from "@/app/portfolio/selected-work";
import { StudyMedia, StudyActions } from "@/app/portfolio/studies/primitives";
import { StudyLink } from "../project-studies/primitives";
import interaction from "@/app/site/interaction.module.css";
import { getCaseStudy, getReleaseHeading } from "@/app/portfolio/studies/case-study";
import { StudyBrief, StudyComponents, StudyDecisions, StudyFlow, StudyMeasures, StudyProductVisual } from "@/app/portfolio/studies/case-study-primitives";
import { StudyBack } from "../project-studies/case-study-primitives";
import styles from "./interface-gallery.module.css";

type IndexProps = { studies: readonly ProjectStudy[]; direction: StudyDirectionId };
type DetailProps = { study: ProjectStudy; direction: StudyDirectionId };

function GalleryPiece({ study, direction, priority }: { study: ProjectStudy; direction: StudyDirectionId; priority: boolean }) {
  return (
    <article className={styles.piece}>
      <StudyLink study={study} direction={direction} className={styles.indexMediaLink}>
        <StudyMedia asset={study.media[0]} className={styles.indexMedia} priority={priority} caption={false} />
      </StudyLink>
      <div className={styles.caption}>
        <h2><StudyLink study={study} direction={direction}>{study.project.title}</StudyLink></h2>
        <p>{study.media[0].label}</p>
      </div>
    </article>
  );
}

function GalleryArchive({ studies, direction }: IndexProps) {
  if (!studies.length) return null;
  return (
    <details className={styles.archive}>
      <summary className={interaction.action}>More projects <span aria-hidden>+</span></summary>
      <div className={styles.archiveGrid}>{studies.map(study => (
        <StudyLink key={study.project.slug} study={study} direction={direction}>{study.project.title}</StudyLink>
      ))}</div>
    </details>
  );
}

export function InterfaceGalleryIndex({ studies, direction }: IndexProps) {
  return (
    <div className={styles.gallery}>
      <div className={`${styles.intro} ${styles.indexIntro}`}>
        <h1>Selected work</h1>
        <p>Learning. Lending.<br />Daily work.</p>
      </div>
      <div className={styles.collection}>{studies.slice(0, selectedWorkSlugs.length).map((study, index) => (
        <GalleryPiece key={study.project.slug} study={study} direction={direction} priority={index === 0} />
      ))}</div>
      <GalleryArchive studies={studies.slice(selectedWorkSlugs.length)} direction={direction} />
      <div className={styles.foot}><span>Software engineering and product design</span></div>
    </div>
  );
}

export function InterfaceGalleryDetail({ study, direction }: DetailProps) {
  const story = getCaseStudy(study);
  const supportingScreen = study.media.find((asset, index) => index > 0 && asset.kind === "screen");
  const video = study.media.find(asset => asset.kind === "video");
  return (
    <article className={`${styles.gallery} ${styles.caseExhibit}`}>
      <header className={styles.exhibitHeader}>
        <StudyBack direction={direction} className={styles.exhibitBack} />
        <h1>{study.project.title}</h1>
        <div className={styles.exhibitHeadline}><p>{story.headline}</p><StudyActions study={study} className={styles.exhibitActions} /></div>
      </header>
      <div className={styles.openingPlate}>
        <StudyProductVisual study={study} priority caption={false} className={styles.plateVisual} sizes="(max-width: 700px) 90vw, 86vw" />
        <div className={styles.plateCaption}><span>{story.platform}</span><p>{story.introduction}</p></div>
      </div>
      <div className={styles.editorialBrief}>
        <StudyBrief study={study} className={styles.exhibitBrief} />
        <section className={styles.briefText} aria-labelledby="gallery-brief"><h2 id="gallery-brief">The brief</h2><p>{story.challenge}</p><p>{story.responsibility}</p></section>
      </div>
      <section className={styles.annotatedChoices} aria-labelledby="gallery-decisions">
        <header><h2 id="gallery-decisions">Designed around the work.</h2></header>
        <div className={`${styles.annotationLayout} ${supportingScreen ? styles.hasPlate : ""}`}>
          <StudyDecisions study={study} className={styles.exhibitDecisions} />
          {supportingScreen && <div className={styles.secondaryPlate}><StudyMedia asset={supportingScreen} className={styles.secondaryVisual} boundPortrait={false} /></div>}
        </div>
      </section>
      {story.flow.length > 0 && <section className={styles.flowSpread} aria-labelledby="gallery-flow">
        <h2 id="gallery-flow">A path through the product</h2>
        <StudyFlow study={study} className={styles.exhibitFlow} />
      </section>}
      <section className={styles.shippedSpread} aria-labelledby="gallery-shipped">
        <div><h2 id="gallery-shipped">{getReleaseHeading(study)}</h2><p>{story.outcome}</p></div>
        {story.measures.length > 0 && <StudyMeasures study={study} className={styles.exhibitMeasures} />}
      </section>
      {story.components.length > 0 && <section className={styles.productionNotes} aria-labelledby="gallery-notes">
        <h2 id="gallery-notes">Build notes</h2>
        <StudyComponents study={study} />
      </section>}
      {video && <StudyMedia asset={video} className={styles.exhibitVideo} />}
    </article>
  );
}
