import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { concepts } from "./concepts";
import styles from "./review.module.css";

export const metadata: Metadata = { title: "Six directions for Pablo’s website", robots: { index: false, follow: false } };

export default function MockupGallery() {
  return (
    <main className={styles.gallery}>
      <header className={styles.galleryHeader}><span>Pablo Manjarres / Homepage explorations</span><h1>Six directions.<br />One personal website.</h1><p>Original layouts, your latest portraits, and your actual work. Open any design to see the full page.</p></header>
      <div className={styles.conceptGrid}>{concepts.map(concept => <Link key={concept.id} href={`/mockups/${concept.id}`} className={styles.conceptCard}>
        <div className={styles.conceptImage} style={{ background: concept.paper }}><Image src={`/mockups/previews/${concept.id}.webp`} alt={`${concept.name} homepage preview`} fill sizes="(max-width: 700px) 90vw, 45vw" /></div>
        <div className={styles.conceptLabel}><span>{concept.number}</span><h2>{concept.name}</h2><span aria-hidden>↗</span></div><p>{concept.description}</p>
      </Link>)}</div>
      <footer className={styles.galleryFooter}>Choose a direction, or combine the layout of one with the portrait and palette of another.</footer>
    </main>
  );
}
