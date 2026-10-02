import type { ProjectStudy, StudyDirectionId } from "../project-studies/data";
import { selectedWorkSlugs } from "../selected-work";
import { StudyActions, StudyFacts, StudyLink, StudyMedia, StudyNext } from "../project-studies/primitives";
import interaction from "../interaction.module.css";
import styles from "./product-workbench.module.css";

type IndexProps = { studies: readonly ProjectStudy[]; direction: StudyDirectionId };
type DetailProps = { study: ProjectStudy; nextStudy: ProjectStudy; direction: StudyDirectionId };
type Asset = ProjectStudy["media"][number];

function still(study: ProjectStudy) {
  return study.media.find(asset => asset.kind !== "video") ?? study.media[0];
}

function BenchProject({ study, direction, lead = false }: {
  study: ProjectStudy; direction: StudyDirectionId; lead?: boolean;
}) {
  const asset = still(study);
  return (
    <article className={`${styles.benchProject} ${lead ? styles.leadProject : ""}`}>
      <div className={styles.projectMount}>
        <StudyLink study={study} direction={direction} className={styles.projectVisual}>
          <StudyMedia asset={asset} className={styles.projectMedia} priority={lead} caption={false} />
        </StudyLink>
        {lead && <figure className={styles.indexLens} aria-hidden="true">
          <StudyMedia asset={asset} className={styles.lensMedia} detail caption={false} />
        </figure>}
      </div>
      <div className={styles.projectLabel}>
        <h2><StudyLink study={study} direction={direction}>{study.project.title}</StudyLink></h2>
        <span>{asset.label}</span>
      </div>
    </article>
  );
}

function ProjectLedger({ studies, direction }: IndexProps) {
  if (!studies.length) return null;
  return (
    <section className={styles.ledger} aria-label="More projects">
      <h2>Also built</h2>
      <div className={styles.ledgerItems}>{studies.map(study => (
        <StudyLink key={study.project.slug} study={study} direction={direction} className={styles.ledgerLink}>
          <span>{study.project.title}</span><small>{study.project.year}</small>
        </StudyLink>
      ))}</div>
    </section>
  );
}

function BenchCapture({ asset, priority = false }: { asset: Asset; priority?: boolean }) {
  return (
    <figure className={styles.fullCapture} data-kind={asset.kind}>
      <StudyMedia asset={asset} className={styles.captureMedia} priority={priority} caption={false} />
      <figcaption className={styles.captureLabel}>
        <span>{asset.label}</span><a className={interaction.action} href={asset.src} target="_blank" rel="noreferrer">Open full size</a>
      </figcaption>
    </figure>
  );
}

function DetailCrop({ asset, region = "wide" }: { asset: Asset; region?: "focus" | "wide" }) {
  return (
    <figure className={`${styles.crop} ${region === "focus" ? styles.focusCrop : styles.wideCrop}`}>
      <StudyMedia asset={asset} className={styles.cropMedia} detail caption={false} />
      <figcaption>Detail of {asset.label.toLowerCase()}</figcaption>
    </figure>
  );
}

export function ProductWorkbenchIndex({ studies, direction }: IndexProps) {
  return (
    <div className={styles.workbench}>
      <header className={styles.indexHeader}><h1>On the bench.</h1><p>Software. Products. Tools.</p></header>
      <section className={styles.selected} aria-label="Selected projects">
        {studies.slice(0, selectedWorkSlugs.length).map((study, index) => (
          <BenchProject key={study.project.slug} study={study} direction={direction} lead={index === 0} />
        ))}
      </section>
      <ProjectLedger studies={studies.slice(selectedWorkSlugs.length)} direction={direction} />
    </div>
  );
}

export function ProductWorkbenchDetail({ study, nextStudy, direction }: DetailProps) {
  const primary = still(study);
  const extras = study.media.filter(asset => asset.id !== primary.id);
  return (
    <div className={styles.workbench}>
      <header className={styles.detailHeader}>
        <h1>{study.project.title}</h1><p>{study.caption}</p>
      </header>
      <div className={styles.inspectionBench}><BenchCapture asset={primary} priority /></div>
      <div className={styles.projectDrawer}>
        <StudyFacts study={study} className={styles.facts} />
        <StudyActions study={study} className={styles.actions} />
      </div>
      <section className={styles.closeups} aria-label={`Details of ${study.project.title}`}>
        <h2>A closer look.</h2>
        <div className={styles.cropCollection}>
          <DetailCrop asset={primary} region="focus" />
          <DetailCrop asset={primary} />
        </div>
      </section>
      {extras.length > 0 && <section className={styles.additionalMedia} aria-label="More project media">
        {extras.map(asset => <BenchCapture key={asset.id} asset={asset} />)}
      </section>}
      <footer className={styles.nextProject}>
        <StudyNext study={nextStudy} direction={direction} className={styles.nextLabel} />
        <StudyLink study={nextStudy} direction={direction} className={styles.nextPreview}>
          <StudyMedia asset={still(nextStudy)} className={styles.nextMedia} />
        </StudyLink>
      </footer>
    </div>
  );
}
