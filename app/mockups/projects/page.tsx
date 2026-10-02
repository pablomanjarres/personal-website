import Image from "next/image";
import Link from "next/link";
import { studyDirections } from "../project-studies/directions";
import { studyHref } from "../project-studies/data";
import styles from "../review.module.css";

export default function ProjectMockupGallery() {
  return <main className={styles.gallery}><header className={styles.galleryHeader}><Link href="/mockups">Homepage designs</Link><h1>Less reading.<br />More of the work.</h1><p>Six ways to browse the projects and take a closer look.</p></header><div className={styles.conceptGrid}>{studyDirections.map((direction, index) => <Link key={direction.id} href={studyHref(direction.id)} className={styles.conceptCard}><div className={styles.conceptImage} style={{ background: direction.paper }}><Image src={`/mockups/project-previews/${direction.id}.webp`} alt={`${direction.name} project page`} fill sizes="(max-width: 700px) 90vw, 45vw" /></div><div className={styles.conceptLabel}><span>0{index + 1}</span><h2>{direction.name}</h2><span aria-hidden>↗</span></div><p>{direction.description}</p></Link>)}</div><footer className={styles.galleryFooter}>Open a project to see the full page. Each direction includes all 20 projects.</footer></main>;
}
