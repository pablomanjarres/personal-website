import interaction from "@/app/site/interaction.module.css";
import { getStudyInterfaceViews, type ProjectStudy } from "./data";
import { StudyMedia } from "./primitives";
import styles from "./interface-gallery.module.css";

export function StudyInterfaceGallery({ study }: { study: ProjectStudy }) {
  const views = getStudyInterfaceViews(study);
  if (!views.length) return null;
  return (
    <section className={styles.gallery} aria-labelledby="workbench-interfaces">
      <header className={styles.heading} data-reveal="panel">
        <h2 id="workbench-interfaces">Inside the product.</h2>
        <p>Screens from the working product, with demonstration data.</p>
      </header>
      <div className={styles.views}>
        {views.map(({ asset, description }) => <article key={asset.id} className={styles.view} data-reveal="media">
          <header className={styles.viewHeading}>
            <div><h3 id={`${asset.id}-title`}>{asset.label}</h3><p>{description}</p></div>
            <a href={asset.src} target="_blank" rel="noreferrer" className={`${interaction.action} ${interaction.textLink} ${styles.fullSize}`} aria-label={`Open ${asset.label.toLowerCase()} at full size in a new tab`}>Full size<span className={interaction.arrow} aria-hidden>↗</span></a>
          </header>
          <p id={`${asset.id}-scroll`} className={styles.scrollCue}>Scroll sideways to inspect the interface.</p>
          <div className={`${styles.viewport} ${interaction.action}`} role="region" aria-labelledby={`${asset.id}-title`} aria-describedby={`${asset.id}-scroll`} tabIndex={0}>
            <StudyMedia asset={asset} className={styles.screen} caption={false} sizes="(max-width: 1067px) 960px, (max-width: 1611px) 90vw, 1450px" />
          </div>
        </article>)}
      </div>
    </section>
  );
}
