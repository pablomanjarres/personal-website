import type { ProjectStudy, StudyDirectionId } from "../project-studies/data";
import type { CSSProperties } from "react";
import { selectedWorkSlugs } from "../selected-work";
import { StudyActions, StudyDemo, StudyFacts, StudyLink, StudyMedia, StudyNext } from "../project-studies/primitives";
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

function ScreenshotView({ study, priority = false }: { study: ProjectStudy; priority?: boolean }) {
  const asset = still(study);
  if (asset.kind === "unavailable") return <StudyMedia asset={asset} className={styles.screen} />;
  return <fieldset className={styles.screenshotView} data-portrait={asset.width < asset.height} style={{ "--screen-ratio": asset.width / asset.height } as CSSProperties}>
    <legend>{asset.label}</legend>
    <div className={styles.viewChoices}>
      <label><input type="radio" name={`${study.project.slug}-view`} value="full" defaultChecked className={interaction.action} />Full view</label>
      <label><input type="radio" name={`${study.project.slug}-view`} value="close" className={interaction.action} />Closer look</label>
      <span className={styles.panHint}>Scroll to inspect</span>
    </div>
    <div className={`${styles.screenViewport} ${interaction.action}`} tabIndex={0} role="region" aria-label={`${study.project.title} screenshot. Use the arrow keys to pan the enlarged view.`}>
      <StudyMedia asset={asset} className={styles.screen} priority={priority} caption={false} boundPortrait={false} />
    </div>
  </fieldset>;
}

function MediaStage({ study }: { study: ProjectStudy }) {
  const videos = study.media.filter(asset => asset.kind === "video");
  return <section className={styles.mediaStage} aria-label={`${study.project.title} product views`}>
    {study.project.embedUrl ? <>
      <StudyDemo study={study} className={styles.liveDemo} />
      <details className={styles.inspection}><summary className={interaction.action}>Inspect screenshot <span aria-hidden>+</span></summary><ScreenshotView study={study} /></details>
    </> : <ScreenshotView study={study} priority />}
    {videos.map(asset => <div key={asset.id} className={styles.recording}><StudyMedia asset={asset} className={styles.video} /></div>)}
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
  return <div className={styles.playground}>
    <header className={styles.detailHeading}><h1>{study.project.title}</h1><p>{study.caption}</p></header>
    <MediaStage study={study} />
    <div className={styles.projectNotes}><StudyFacts study={study} className={styles.facts} /><StudyActions study={study} className={styles.actions} /></div>
    <footer className={styles.nextProduct}>
      <StudyNext study={nextStudy} direction={direction} className={styles.nextLabel} />
      <StudyLink study={nextStudy} direction={direction} className={styles.nextVisual}><StudyMedia asset={still(nextStudy)} className={styles.nextImage} caption={false} /></StudyLink>
    </footer>
  </div>;
}
