import Image from "next/image";
import type { CSSProperties } from "react";
import { ankiInterfaceStudyScreens } from "../anki-media";
import type { FeaturedProject } from "./content";
import { ProjectLink } from "./primitives";
import styles from "./anki-interface-study.module.css";

export function AnkiInterfaceStudy({ item, className = "" }: { item: FeaturedProject; className?: string }) {
  return <ProjectLink item={item} className={`${styles.study} ${className}`}>
    <div className={styles.screens}>
      {ankiInterfaceStudyScreens.map(screen => <span key={screen.id} className={styles.phone} style={{ "--screen-ratio": screen.width / screen.height } as CSSProperties}>
        <Image src={screen.src} alt={screen.alt} width={screen.width} height={screen.height} sizes="(max-width: 700px) 32vw, 260px" />
      </span>)}
    </div>
  </ProjectLink>;
}
