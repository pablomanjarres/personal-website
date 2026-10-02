import type { ProjectStudy, StudyDirectionId } from "../project-studies/data";
import { selectedWorkSlugs } from "../selected-work";
import { StudyActions, StudyDemo, StudyLink, StudyMedia, StudyNext } from "../project-studies/primitives";
import { getCaseStudy } from "../project-studies/case-study";
import { StudyBack, StudyBrief, StudyComponents, StudyDecisions, StudyFlow, StudyMeasures, StudyProductVisual } from "../project-studies/case-study-primitives";
import interaction from "../interaction.module.css";
import styles from "./product-playground.module.css";

type IndexProps = { studies: readonly ProjectStudy[]; direction: StudyDirectionId };
type DetailProps = { study: ProjectStudy; nextStudy: ProjectStudy; direction: StudyDirectionId };

function still(study: ProjectStudy) {
  return study.media.find(asset => asset.kind !== "video") ?? study.media[0];
}

function ProductView({ study, direction, lead = false }: { study: ProjectStudy; direction: StudyDirectionId; lead?: boolean }) {
  const asset = still(study);
  return <article className={`${styles.productView} ${lead ? styles.lead : ""}`} data-product={study.project.slug}>
    <StudyLink study={study} direction={direction} className={styles.productLink}>
      <div className={styles.productLabel}><h2>{study.project.title}</h2><span>{asset.label}</span></div>
      <div className={styles.viewfinder}><StudyMedia asset={asset} className={styles.preview} priority={lead} caption={false} /></div>
      <span className={styles.open}>Open project <span aria-hidden>↗</span></span>
    </StudyLink>
  </article>;
}

function BuiltStrip({ studies, direction }: IndexProps) {
  return <section className={styles.builtStrip} aria-label="More projects">
    <h2>Also built.</h2>
    <div className={styles.stripItems}>{studies.map(study => <StudyLink key={study.project.slug} study={study} direction={direction} className={styles.stripItem}>
      <StudyMedia asset={still(study)} className={styles.stripImage} caption={false} sizes="(max-width: 900px) 100px, 136px" />
      <span>{study.project.title}</span><small>{study.project.year}</small>
    </StudyLink>)}</div>
  </section>;
}

export function ProductPlaygroundIndex({ studies, direction }: IndexProps) {
  const lead = studies[0];
  return <div className={styles.playground}>
    <header className={styles.indexHeading}><h1>Things I’ve built.</h1><a href="#more-built" className={`${styles.allWork} ${interaction.action}`}>Browse the work <span aria-hidden>↓</span></a></header>
    <section className={styles.productStage} aria-label="Selected projects" data-enter="settle">
      {lead && <ProductView study={lead} direction={direction} lead />}
      <div className={styles.companions}>{studies.slice(1, selectedWorkSlugs.length).map(study => <ProductView key={study.project.slug} study={study} direction={direction} />)}</div>
    </section>
    <div id="more-built"><BuiltStrip studies={studies.slice(selectedWorkSlugs.length)} direction={direction} /></div>
  </div>;
}

export function ProductPlaygroundDetail({ study, nextStudy, direction }: DetailProps) {
  const story = getCaseStudy(study);
  const videos = study.media.filter(asset => asset.kind === "video");
  return <div className={`${styles.playground} ${styles.detailPage}`}>
    <StudyBack direction={direction} className={styles.back} />
    <header className={styles.detailHeading}>
      <div><h1>{study.project.title}</h1><p>{story.headline}</p><StudyActions study={study} className={styles.actions} /></div>
      <StudyBrief study={study} className={styles.briefFacts} />
    </header>
    <section className={styles.mediaStage} aria-label={`${study.project.title} product interface`}><StudyProductVisual study={study} className={styles.productVisual} priority sizes="(max-width: 700px) 88vw, 86vw" /></section>
    <StudyMeasures study={study} className={styles.measures} />
    <section className={styles.context} aria-labelledby="playground-context-heading">
      <div><h2 id="playground-context-heading">Why I built it.</h2><p>{story.introduction}</p></div>
      <div className={styles.contextNotes}><article><h3>The challenge</h3><p>{story.challenge}</p></article><article><h3>My role</h3><p>{story.responsibility}</p></article><article><h3>The result</h3><p>{story.outcome}</p></article></div>
    </section>
    {story.flow.length > 0 && <section className={styles.walkthrough} aria-labelledby="playground-walkthrough-heading">
      <h2 id="playground-walkthrough-heading">A walk through the product.</h2>
      <StudyFlow study={study} className={styles.stations} />
    </section>}
    <section className={styles.engineering} aria-labelledby="playground-engineering-heading">
      <div className={styles.sectionHeading}><h2 id="playground-engineering-heading">The choices behind it.</h2><p>{study.project.stack.join(" / ")}</p></div>
      <StudyDecisions study={study} className={styles.decisions} />
      <StudyComponents study={study} className={styles.components} />
    </section>
    {(study.project.embedUrl || videos.length > 0) && <section className={styles.tryProduct} aria-labelledby="playground-try-heading"><h2 id="playground-try-heading">See it in action.</h2><StudyDemo study={study} className={styles.liveDemo} />{videos.map(asset => <StudyMedia key={asset.id} asset={asset} className={styles.video} />)}</section>}
    <footer className={styles.nextProduct}>
      <StudyNext study={nextStudy} direction={direction} className={styles.nextLabel} />
      <StudyLink study={nextStudy} direction={direction} className={styles.nextVisual}><StudyMedia asset={still(nextStudy)} className={styles.nextImage} caption={false} /></StudyLink>
    </footer>
  </div>;
}
