"use client";

import type { Hero } from "../../heroes";
import { SiteNav } from "../../../SiteNav";
import styles from "./valhalla.module.css";

// A compact, faithful slice of the real dashboard, recreated in the browser so
// the landing shows the product itself. Statuses mirror a real reading.
const CARDS: { icon: string; title: string; ok: boolean; line: string }[] = [
  { icon: "⎔", title: "Accounts", ok: true, line: "Account 1 · 5h 19% · 7d 18%" },
  { icon: "◱", title: "Apps", ok: true, line: "Cortex ok · Glances ok · Forge off" },
  { icon: "⚙", title: "Services", ok: true, line: "24 jobs · 7 running" },
  { icon: "◈", title: "MCP", ok: true, line: "4 MCP servers configured" },
  { icon: "▤", title: "VM", ok: false, line: "default: stopped (interns down)" },
  { icon: "✦", title: "Skills", ok: true, line: "21 skills" },
];

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
            <div className={styles.term}>
              <div className={styles.bar}>
                <span className={`${styles.tdot} ${styles.r}`} />
                <span className={`${styles.tdot} ${styles.y}`} />
                <span className={`${styles.tdot} ${styles.g}`} />
                <span className={styles.tt}>valhalla {"—"} the high seat</span>
              </div>
              <div className={styles.termbody}>
                <div className={styles.fleet}>
                  <span className={styles.livedot} />
                  <b>Fleet</b>
                  <span className={styles.fleetmeta}>ok {"·"} 8/8 surfaces</span>
                </div>
                <div className={styles.grid}>
                  {CARDS.map((c) => (
                    <div key={c.title} className={styles.card}>
                      <div className={styles.chead}>
                        <span className={styles.ctitle}>
                          <span className={styles.ic}>{c.icon}</span>
                          {c.title}
                        </span>
                        <span className={c.ok ? styles.gok : styles.goff}>{c.ok ? "●" : "○"}</span>
                      </div>
                      <div className={styles.cline}>{c.line}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
