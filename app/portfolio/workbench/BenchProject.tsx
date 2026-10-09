import {
  getStudyPreview,
  type ProjectStudy,
} from "@/app/portfolio/studies/data";
import { StudyLink, StudyMedia } from "@/app/portfolio/studies/primitives";
import ProjectLogo from "@/app/ProjectLogo";
import { isWebsiteStudy } from "@/app/portfolio/web-studies/catalog";
import styles from "./workbench.module.css";

export function BenchProject({
  study,
  projectHref,
  lead = false,
}: {
  study: ProjectStudy;
  projectHref: (slug: string) => string;
  lead?: boolean;
}) {
  const asset = getStudyPreview(study);
  return (
    <article
      className={`${styles.benchProject} ${lead ? styles.leadProject : ""}`}
      data-project={study.project.slug}
      data-feature={lead ? "lead" : "supporting"}
      data-media-kind={asset.kind}
      data-reveal="media"
      data-enter={lead ? "pop" : undefined}
    >
      <div className={styles.projectMount}>
        <StudyLink
          href={projectHref(study.project.slug)}
          className={styles.projectVisual}
        >
          <StudyMedia
            asset={asset}
            className={styles.projectMedia}
            priority={lead}
            caption={false}
            sizes={
              lead
                ? "(max-width: 700px) 88vw, (max-width: 1611px) 90vw, 1450px"
                : "(max-width: 700px) 88vw, (max-width: 1611px) 41.85vw, 674px"
            }
          />
        </StudyLink>
        {lead && asset.kind !== "presentation" && (
          <figure className={styles.indexLens} aria-hidden="true">
            <StudyMedia
              asset={asset}
              className={styles.lensMedia}
              detail
              caption={false}
            />
          </figure>
        )}
      </div>
      <div className={styles.projectLabel}>
        <h2>
          <StudyLink href={projectHref(study.project.slug)}>
            {isWebsiteStudy(study.project.slug) && study.project.identity && (
              <ProjectLogo
                identity={study.project.identity}
                title={`${study.project.title} symbol`}
                className={styles.projectLogo}
              />
            )}
            {study.project.title}
          </StudyLink>
        </h2>
        <span>{asset.label}</span>
      </div>
    </article>
  );
}
