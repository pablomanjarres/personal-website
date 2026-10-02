import Image from "next/image";
import { ankiAppMockup } from "../anki-media";
import type { FeaturedProject } from "./content";
import { ProjectLink } from "./primitives";
import styles from "./anki-app-mockup.module.css";

export function AnkiAppMockup({ item, className = "" }: { item: FeaturedProject; className?: string }) {
  return <ProjectLink item={item} className={`${styles.mockup} ${className}`}>
    <Image {...ankiAppMockup} className={styles.image} sizes="(max-width: 700px) 86vw, 54vw" />
  </ProjectLink>;
}
