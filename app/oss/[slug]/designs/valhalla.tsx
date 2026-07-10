"use client";

import type { Hero } from "../../heroes";
import { SiteNav } from "../../../SiteNav";
import styles from "./valhalla.module.css";

export default function Hero({ hero, slug }: { hero: Hero; slug: string }) {
  const h = hero;

  return (
    <main className={styles.root}>
      <div className={styles.glow} aria-hidden />
      <div className={styles.rune} aria-hidden>
        {"ᛟ"}
      </div>

      <SiteNav active="oss" tone="dark" bleed />

      <div className={styles.wrap}>
        <section className={styles.hero}>
          <div className={styles.left}>
            <div className={styles.kicker}>{h.kicker}</div>
            <h1 className={styles.title}>
              <span className={styles.lead}>{h.titleLead}</span>
              <span className={styles.main}>{h.titleMain}</span>
            </h1>
            <p className={styles.sub}>{h.subtitle}</p>
            <p className={styles.note}>{h.note}</p>
            <div className={styles.cta}>
              <a className={`${styles.btn} ${styles.primary}`} href={h.repo} target="_blank" rel="noreferrer">
                {"★"} Star on GitHub
              </a>
              {h.live && (
                <a className={`${styles.btn} ${styles.ghost}`} href={h.live} target="_blank" rel="noreferrer">
                  Live demo {"↗"}
                </a>
              )}
              <a className={`${styles.btn} ${styles.ghost}`} href={`https://pablomanjarres.com/portfolio/projects/${slug}`}>
                Write-up
              </a>
            </div>
          </div>

          <div className={styles.right}>
            <figure className={styles.term}>
              <div className={styles.bar}>
                <span className={`${styles.tdot} ${styles.r}`} />
                <span className={`${styles.tdot} ${styles.y}`} />
                <span className={`${styles.tdot} ${styles.g}`} />
                <span className={styles.tt}>valhalla {"—"} the high seat</span>
              </div>
              <img
                className={styles.art}
                src={`/oss/${slug}.png`}
                alt="Valhalla, a pixel-art rune portal with the play-chevron sigil"
                width={1408}
                height={768}
              />
            </figure>
          </div>
        </section>
      </div>

      <footer className={styles.foot}>
        <span>{h.oss ? "MIT LICENSED" : "SOURCE AVAILABLE"}</span>
        <span>{"©"} 2026 Pablo Manjarres</span>
      </footer>
    </main>
  );
}
