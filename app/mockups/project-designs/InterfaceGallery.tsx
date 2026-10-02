import type { ProjectStudy, StudyDirectionId } from "../project-studies/data";
import { selectedWorkSlugs } from "../selected-work";
import { StudyMedia, StudyLink, StudyFacts, StudyActions, StudyNext } from "../project-studies/primitives";
import interaction from "../interaction.module.css";
import styles from "./interface-gallery.module.css";

type IndexProps = { studies: readonly ProjectStudy[]; direction: StudyDirectionId };
type DetailProps = { study: ProjectStudy; nextStudy: ProjectStudy; direction: StudyDirectionId };
type Asset = ProjectStudy["media"][number];

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

function Exhibit({ asset, detail = false }: { asset: Asset; detail?: boolean }) {
  return (
    <figure className={styles.exhibit}>
      <StudyMedia asset={asset} detail={detail} caption={false} className={`${styles.exhibitMedia} ${detail ? styles.detailMedia : ""}`} />
      <figcaption className={styles.mediaCaption}>{detail ? `Detail of ${asset.label.toLowerCase()}` : asset.label}</figcaption>
    </figure>
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

export function InterfaceGalleryDetail({ study, nextStudy, direction }: DetailProps) {
  const primary = study.media[0];
  const secondary = study.media.filter(asset => asset.id !== primary.id).slice(0, 1);
  return (
    <div className={styles.gallery}>
      <header className={styles.intro}>
        <h1>{study.project.title}</h1>
        <p>{study.caption}</p>
      </header>
      <figure className={styles.hero}>
        <StudyMedia asset={primary} className={styles.heroMedia} priority caption={false} />
        <figcaption className={styles.mediaCaption}><span>{primary.label}</span><a className={interaction.action} href={primary.src} target="_blank" rel="noreferrer">View full size</a></figcaption>
      </figure>
      <div className={styles.exhibition}>
        <Exhibit asset={primary} detail />
        {secondary.map(asset => <Exhibit key={asset.id} asset={asset} />)}
      </div>
      <div className={styles.factsRow}>
        <StudyFacts study={study} className={styles.facts} />
        <StudyActions study={study} className={styles.actions} />
      </div>
      <div className={styles.next}>
        <StudyNext study={nextStudy} direction={direction} className={styles.nextText} />
        <StudyLink study={nextStudy} direction={direction} className={styles.nextVisual}>
          <StudyMedia asset={nextStudy.media[0]} className={styles.nextMedia} />
        </StudyLink>
      </div>
      <div className={styles.foot}><span>Software engineering and product design</span></div>
    </div>
  );
}
