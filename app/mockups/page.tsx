import type { Metadata } from "next";
import { concepts } from "./concepts";
import { ReviewCard, ReviewGallery, ReviewPreview, ReviewSavedLink } from "./review";
import styles from "./review.module.css";

export const metadata: Metadata = { title: "Six directions for Pablo’s website", robots: { index: false, follow: false } };

export default function MockupGallery() {
  return <ReviewGallery
    header={<><span>Pablo Manjarres / Homepage explorations</span><h1>Six directions.<br />One personal website.</h1><p>Six directions for the whole page. Compare the projects, the story, and the way each one ends.</p><ReviewSavedLink href="https://github.com/pablomanjarres/personal-website/archive/refs/tags/mockups-saved-2026-10-02.zip" target="_blank" rel="noreferrer">Download the saved six-version source</ReviewSavedLink></>}
    footer={<><ReviewSavedLink href="/mockups/projects">Explore six project page designs ↗</ReviewSavedLink><p>Open a page to see the selected projects, its about section, and its contact section. Pause and Replay let you compare the motion.</p></>}
  >
    {concepts.map(concept => <ReviewCard key={concept.id} href={`/mockups/${concept.id}`} number={concept.number} name={concept.name} description={concept.description}>
      <div className={styles.previewPair}>
        <ReviewPreview src={`/mockups/previews/${concept.id}.webp`} alt={`${concept.name} hero`} background={concept.paper} />
        <ReviewPreview src={`/mockups/body-previews/${concept.id}.webp?v=paired-export-2`} alt={`${concept.name} project presentation`} variant="body" />
      </div>
    </ReviewCard>)}
  </ReviewGallery>;
}
