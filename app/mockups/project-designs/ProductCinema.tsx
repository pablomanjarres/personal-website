import type { ProjectStudy, StudyDirectionId } from "../project-studies/data";
import { StudyActions, StudyFacts, StudyLink, StudyMedia, StudyNext } from "../project-studies/primitives";
import styles from "./product-cinema.module.css";
import interaction from "../interaction.module.css";
import { selectedWorkSlugs } from "../selected-work";

type IndexProps = { studies: readonly ProjectStudy[]; direction: StudyDirectionId };
type DetailProps = { study: ProjectStudy; nextStudy: ProjectStudy; direction: StudyDirectionId };
type Asset = ProjectStudy["media"][number];

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

function MediaScene({ asset, index }: { asset: Asset; index: number }) {
  return (
    <section id={`cinema-${asset.id}`} className={styles.scene} data-kind={asset.kind} data-scene={index} data-reveal>
      <StudyMedia asset={asset} className={styles.sceneMedia} />
    </section>
  );
}

function SceneNavigation({ assets }: { assets: readonly Asset[] }) {
  if (assets.length < 2) return null;
  return <nav className={styles.sceneNavigation} aria-label="Project screens">{assets.map(asset => <a href={`#cinema-${asset.id}`} key={asset.id} className={interaction.action}>{asset.label}</a>)}</nav>;
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
  const first = study.media[0];
  return (
    <div className={styles.cinema}>
      <header className={styles.titleScene}><h1>{study.project.title}</h1><p>{study.caption}</p></header>
      {first && <section id={`cinema-${first.id}`} className={styles.premiere}><StudyMedia asset={first} className={styles.leadMedia} priority /></section>}
      <div className={styles.quietMetadata}><StudyFacts study={study} className={styles.facts} /><StudyActions study={study} className={styles.actions} /></div>
      <SceneNavigation assets={study.media} />
      {study.media.length > 1 && <div className={styles.sequence}>{study.media.slice(1).map((asset, index) => <MediaScene key={asset.id} asset={asset} index={index} />)}</div>}
      <footer className={styles.nextScene}><StudyNext study={nextStudy} direction={direction} className={styles.next} /></footer>
    </div>
  );
}
