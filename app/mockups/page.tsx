import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { concepts } from "./concepts";
import styles from "./review.module.css";

export const metadata: Metadata = { title: "Six directions for Pablo’s website", robots: { index: false, follow: false } };

export default function MockupGallery() {
  return (
    <main className={styles.gallery}>
      <header className={styles.galleryHeader}><span>Pablo Manjarres / Homepage explorations</span><h1>Six directions.<br />One personal website.</h1><p>Six directions for the whole page. Compare the projects, the story, and the way each one ends.</p><a className={styles.savedLink} href="https://github.com/pablomanjarres/personal-website/archive/refs/tags/mockups-saved-2026-10-02.zip" target="_blank" rel="noreferrer">Download the saved six-version source</a></header>
      <div className={styles.conceptGrid}>{concepts.map(concept => <Link key={concept.id} href={`/mockups/${concept.id}`} className={styles.conceptCard}>
        <div className={styles.previewPair}><div className={styles.conceptImage} style={{ background: concept.paper }}><Image src={`/mockups/previews/${concept.id}.webp`} alt={`${concept.name} hero`} fill sizes="(max-width: 700px) 90vw, 45vw" /></div><div className={styles.bodyImage}><Image src={`/mockups/body-previews/${concept.id}.webp`} alt={`${concept.name} project presentation`} fill sizes="(max-width: 700px) 90vw, 45vw" /></div></div>
        <div className={styles.conceptLabel}><span>{concept.number}</span><h2>{concept.name}</h2><span aria-hidden>↗</span></div><p>{concept.description}</p>
      </Link>)}</div>
      <footer className={styles.galleryFooter}><Link className={styles.savedLink} href="/mockups/projects">Explore six project page designs ↗</Link><p>Open a page to see all four featured projects, its about section, and its contact section. Pause and Replay let you compare the motion.</p></footer>
    </main>
  );
}
