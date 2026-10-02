import type { ProjectStudy, StudyDirectionId } from "../project-studies/data";
import { selectedWorkSlugs } from "../selected-work";
import { StudyActions, StudyFacts, StudyLink, StudyMedia, StudyNext } from "../project-studies/primitives";
import interaction from "../interaction.module.css";
import styles from "./product-stack.module.css";

type IndexProps = { studies: readonly ProjectStudy[]; direction: StudyDirectionId };
type DetailProps = { study: ProjectStudy; nextStudy: ProjectStudy; direction: StudyDirectionId };
type Asset = ProjectStudy["media"][number];

function preview(study: ProjectStudy) {
  return study.media.find(asset => asset.kind !== "video") ?? study.media[0];
}

function ProjectSheet({ study, direction, index }: { study: ProjectStudy; direction: StudyDirectionId; index: number }) {
  return (
    <article id={`stack-${study.project.slug}`} className={styles.projectSheet} data-sheet={index}>
      <StudyLink study={study} direction={direction} className={styles.sheetLink}>
        <div className={styles.sheetHeading}><h2>{study.project.title}</h2><span>{study.project.year}</span></div>
        <StudyMedia asset={preview(study)} className={styles.sheetMedia} priority={index === 0} />
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
          <StudyMedia asset={preview(study)} className={styles.shelfMedia} caption={false} sizes="(max-width: 800px) calc((100vw - 82px) / 2), (max-width: 1556px) calc((90vw - 164px) / 4), 309px" />
          <span>{study.project.title}</span>
        </StudyLink>
      ))}</div>
    </section>
  );
}

function OpenSheet({ asset, priority = false }: { asset: Asset; priority?: boolean }) {
  return <section className={styles.openSheet} data-media={asset.kind}><StudyMedia asset={asset} className={styles.openMedia} priority={priority} /></section>;
}

function Foldout({ asset }: { asset: Asset }) {
  return (
    <details className={styles.foldout}>
      <summary className={interaction.action}>A closer look <span aria-hidden="true">+</span></summary>
      <div className={styles.foldoutContent}><StudyMedia asset={asset} detail className={styles.closeupMedia} /></div>
    </details>
  );
}

function NextSheet({ study, direction }: { study: ProjectStudy; direction: StudyDirectionId }) {
  return (
    <footer className={styles.nextSheet}>
      <StudyNext study={study} direction={direction} className={styles.nextTitle} />
      <StudyLink study={study} direction={direction} className={styles.nextPreview}><StudyMedia asset={preview(study)} className={styles.nextMedia} /></StudyLink>
    </footer>
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

export function ProductStackDetail({ study, nextStudy, direction }: DetailProps) {
  const primary = preview(study);
  const otherMedia = study.media.filter(asset => asset.id !== primary.id);
  return (
    <div className={styles.stack}>
      <header className={styles.detailHeading}><h1>{study.project.title}</h1><p>{study.caption}</p></header>
      <div className={styles.openBook}>
        <OpenSheet asset={primary} priority />
        <div className={styles.projectNotes}><StudyFacts study={study} className={styles.facts} /><StudyActions study={study} className={styles.actions} /></div>
        <Foldout asset={primary} />
      </div>
      {otherMedia.length > 0 && <section className={styles.extraPages} aria-label="More project media">{otherMedia.map(asset => <OpenSheet asset={asset} key={asset.id} />)}</section>}
      <NextSheet study={nextStudy} direction={direction} />
    </div>
  );
}
