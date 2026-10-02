import type { ProjectStudy, StudyDirectionId } from "../project-studies/data";
import { StudyActions, StudyDemo, StudyFacts, StudyLink, StudyMedia, StudyNext } from "../project-studies/primitives";
import interaction from "../interaction.module.css";
import styles from "./product-atlas.module.css";
import { selectedWorkSlugs } from "../selected-work";

type IndexProps = { studies: readonly ProjectStudy[]; direction: StudyDirectionId };
type DetailProps = { study: ProjectStudy; nextStudy: ProjectStudy; direction: StudyDirectionId };
type Asset = ProjectStudy["media"][number];

function mapAsset(study: ProjectStudy) {
  return study.media.find(asset => asset.kind === "screen")
    ?? study.media.find(asset => asset.kind !== "video")
    ?? study.media[0];
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

function DetailLandmark({ asset, side }: { asset: Asset; side: "left" | "right" }) {
  return <div className={`${styles.detailLandmark} ${side === "left" ? styles.leftCrop : styles.rightCrop}`} data-reveal>
    <StudyMedia asset={asset} className={styles.cropMedia} detail />
  </div>;
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

export function ProductAtlasDetail({ study, nextStudy, direction }: DetailProps) {
  const primary = mapAsset(study);
  const extras = study.media.filter(asset => asset.id !== primary.id);
  return <div className={styles.atlas}>
    <header className={styles.detailHeader}>
      <h1>{study.project.title}</h1>
      <p>{study.caption}</p>
    </header>
    <section id="full-view" className={styles.fullView} aria-label={`${study.project.title} full view`}>
      <StudyMedia asset={primary} className={styles.fullMedia} priority />
    </section>
    <div className={styles.detailMap}>
      <aside className={`${styles.rail} ${styles.detailRail}`}><nav aria-label="Project views">
        <span className={styles.railLabel}>{study.project.title}</span>
        <a href="#full-view" className={interaction.action}>Full view</a>{primary.kind !== "unavailable" && <a href="#details" className={interaction.action}>Details</a>}<a href="#project-facts" className={interaction.action}>Project facts</a>
      </nav></aside>
      <div className={styles.detailRoute}>
        {primary.kind !== "unavailable" && <section id="details" className={styles.landmarkPair} aria-labelledby="atlas-details-heading">
          <h2 id="atlas-details-heading">Closer.</h2>
          <DetailLandmark asset={primary} side="left" />
          <DetailLandmark asset={primary} side="right" />
        </section>}
        <StudyDemo study={study} className={styles.productDemo} />
        {extras.length > 0 && <section className={styles.extraMedia} aria-label="More product views">
          {extras.map(asset => <StudyMedia key={asset.id} asset={asset} className={styles.extraCapture} />)}
        </section>}
        <section id="project-facts" className={styles.projectFacts} aria-label="Project facts and links">
          <StudyFacts study={study} className={styles.facts} />
          <StudyActions study={study} className={styles.actions} />
        </section>
      </div>
    </div>
    <footer className={styles.nextRoute}>
      <StudyNext study={nextStudy} direction={direction} className={styles.nextLink} />
      <StudyMedia asset={mapAsset(nextStudy)} className={styles.nextMedia} />
    </footer>
  </div>;
}
