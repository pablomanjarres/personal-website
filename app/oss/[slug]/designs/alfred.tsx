"use client";

import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import type { Hero } from "../../heroes";
import AlfredDesk from "./alfred/AlfredDesk";
import styles from "./alfred.module.css";

const delay = (ms: number): CSSProperties => ({ ["--d" as string]: `${ms}ms` });

function renderNote(note: string): ReactNode[] {
  return note.split("`").map((part, i) =>
    i % 2 === 1 ? (
      <code key={i} className={styles.kbd}>
        {part}
      </code>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

function BellButton({
  href,
  external = false,
  tone = "primary",
  children,
  style,
}: {
  href: string;
  external?: boolean;
  tone?: "primary" | "ghost";
  children: ReactNode;
  style?: CSSProperties;
}) {
  const className = `${styles.bellButton} ${
    tone === "ghost" ? styles.bellGhost : styles.bellPrimary
  }`;
  const props = external ? { target: "_blank", rel: "noreferrer" } : {};

  return (
    <a className={className} href={href} style={style} {...props}>
      <span className={styles.bellIcon} aria-hidden="true">
        <span className={styles.bellDome} />
        <span className={styles.bellBase} />
        <span className={styles.bellClapper} />
      </span>
      <span className={styles.bellLabel}>{children}</span>
      <span className={styles.bellRings} aria-hidden="true">
        <i />
        <i />
      </span>
    </a>
  );
}

function Seal({ children }: { children: ReactNode }) {
  return (
    <span className={styles.seal}>
      <span className={styles.sealMark} aria-hidden="true" />
      {children}
    </span>
  );
}

export default function Hero({ hero, slug }: { hero: Hero; slug: string }) {
  const writeup = `https://pablomanjarres.com/portfolio/projects/${slug}`;
  const leadWords = hero.titleLead.split(" ");
  const mainWords = hero.titleMain.split(" ");
  let word = 0;

  return (
    <main className={styles.root}>
      <div className={styles.atmosphere} aria-hidden="true">
        <div
          className={styles.portrait}
          style={{ ["--portrait" as string]: `url('/oss/${slug}.png')` }}
        />
        <div className={styles.manorGlass} />
        <div className={styles.wallpaper} />
        <div className={styles.ledgerLines} />
        <div className={styles.brassGlow} />
        <div className={styles.candleNoise} />
        <div className={styles.vignette} />
      </div>

      <nav className={styles.nav}>
        <Link className={styles.brand} href="/">
          <span className={styles.brandStar}>✦</span>
          Pablo
        </Link>
        <div className={styles.navLinks}>
          <Link href="/oss">Open source</Link>
          <Link href="/portfolio">Portfolio</Link>
          <a href={hero.repo} target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </div>
      </nav>

      <section className={styles.stage}>
        <div className={styles.copy}>
          <p className={styles.kicker} style={delay(180)}>
            <span className={styles.kickerPin} aria-hidden="true" />
            {hero.kicker}
          </p>

          <h1
            className={styles.title}
            aria-label={`${hero.titleLead} ${hero.titleMain}`}
          >
            <span className={styles.titleLine} aria-hidden="true">
              {leadWords.map((w, i) => (
                <span className={styles.mask} key={`lead-${w}-${i}`}>
                  <span className={styles.word} style={delay(300 + word++ * 80)}>
                    {w}
                  </span>
                </span>
              ))}
            </span>
            <span className={styles.titleLine} aria-hidden="true">
              {mainWords.map((w, i) => (
                <span className={styles.mask} key={`main-${w}-${i}`}>
                  <span
                    className={`${styles.word} ${
                      i === mainWords.length - 1 ? styles.titleAccent : ""
                    }`}
                    style={delay(300 + word++ * 80)}
                  >
                    {w}
                  </span>
                </span>
              ))}
            </span>
          </h1>

          <div className={styles.statusRow} style={delay(760)}>
            <Seal>Prototype</Seal>
            <Seal>Codex desktop first</Seal>
            <Seal>Awake helper only</Seal>
          </div>

          <p className={styles.subtitle} style={delay(860)}>
            {hero.subtitle}
          </p>

          <p className={styles.note} style={delay(980)}>
            <span className={styles.notePrompt}>alfred</span>
            <span>{renderNote(hero.note)}</span>
          </p>

          <div className={styles.ctaRow}>
            <BellButton href={hero.repo} external style={delay(1120)}>
              Star on GitHub
            </BellButton>
            {hero.live && (
              <BellButton href={hero.live} external tone="ghost" style={delay(1220)}>
                Live demo
              </BellButton>
            )}
            <BellButton href={writeup} tone="ghost" style={delay(hero.live ? 1320 : 1220)}>
              Read the case study
            </BellButton>
          </div>
        </div>

        <div className={styles.deskWrap}>
          <AlfredDesk style={delay(640)} />
          <div className={styles.limitCard} style={delay(1320)}>
            <span className={styles.limitTitle}>Boundary</span>
            <span className={styles.limitText}>
              Clap activation can wake the helper while macOS is awake. Sleeping
              wake needs outside hardware.
            </span>
          </div>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>{hero.oss ? "MIT LICENSED" : "SOURCE AVAILABLE"}</span>
        <span>© 2026 Pablo Manjarres</span>
      </footer>
    </main>
  );
}
