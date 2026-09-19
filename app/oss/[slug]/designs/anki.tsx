"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import type { Hero } from "../../heroes";
import s from "./anki.module.css";
import SlotRuler from "./anki/SlotRuler";

const delay = (ms: number): CSSProperties => ({ ["--delay" as string]: `${ms}ms` });

const samples = [
  {
    kind: "Lecture",
    source: "Sample architecture notes · Slide 4",
    question: "What does a context diagram show?",
    answer: "A software system and its relationships with people and other systems.",
    line: "A question from the material already reached.",
  },
  {
    kind: "Reading",
    source: "App guide · Reading progress",
    question: "Which book pages can become cards?",
    answer: "Only pages or locations at or before the saved reading checkpoint.",
    line: "The next chapter can wait until you get there.",
  },
  {
    kind: "Review",
    source: "App guide · Daily limit",
    question: "What goes first in the daily queue?",
    answer: "Due cards, before up to five new cards.",
    line: "One small round is enough for today.",
  },
] as const;

const ratings = ["Again", "Hard", "Mid", "Easy", "EZ"] as const;

function FoldButton({ href, children, quiet = false, external = false }: {
  href: string; children: ReactNode; quiet?: boolean; external?: boolean;
}) {
  return <a className={`${s.foldButton} ${quiet ? s.foldQuiet : ""}`} href={href}
    target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}>
    <span className={s.foldFace}>{children}</span>
    <span className={s.foldCorner} aria-hidden="true" />
    <span className={s.foldArrow} aria-hidden="true">↗</span>
  </a>;
}

function StudyLane() {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [reviewed, setReviewed] = useState(0);
  const startY = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const card = samples[index];

  const grade = () => {
    setRevealed(false);
    setIndex(current => (current + 1) % samples.length);
    setReviewed(current => Math.min(30, current + 1));
  };
  const pointerUp = (y: number) => {
    if (startY.current !== null && startY.current - y > 56) setRevealed(true);
    startY.current = null;
  };

  return <div className={s.studyLane} style={delay(620)}>
    <div className={s.laneTop}>
      <span className={s.liveDot} aria-hidden="true" />
      <span>Try a review</span>
      <span className={s.sampleTag}>Sample cards</span>
    </div>
    <div className={s.cardStage}>
      <div className={s.cardShadowTwo} aria-hidden="true" />
      <div className={s.cardShadowOne} aria-hidden="true" />
      <article key={index} className={`${s.studyCard} ${revealed ? s.cardRevealed : ""}`}
        onPointerDown={event => { startY.current = event.clientY; }}
        onPointerUp={event => pointerUp(event.clientY)}
        onPointerCancel={() => { startY.current = null; }}
        onTouchStart={event => { touchStartY.current = event.touches[0]?.clientY ?? null; }}
        onTouchEnd={event => {
          const endY = event.changedTouches[0]?.clientY;
          if (touchStartY.current !== null && endY !== undefined && touchStartY.current - endY > 56) {
            setRevealed(true);
          }
          touchStartY.current = null;
        }}
        onTouchCancel={() => { touchStartY.current = null; }}>
        <div className={s.cardMeta}>
          <span className={s.cardKind}>{card.kind}</span>
          <span className={s.cardIndex}>0{index + 1} / 0{samples.length}</span>
        </div>
        <div className={s.cardMain}>
          <span className={s.sourceLine}><i aria-hidden="true" />{card.source}</span>
          <h2>{card.question}</h2>
          <p className={s.cardContext}>{card.line}</p>
        </div>
        {revealed ? <div className={s.answer} aria-live="polite">
          <span>Answer</span><p>{card.answer}</p>
        </div> : <button className={s.reveal} onClick={() => setRevealed(true)} type="button">
          <span className={s.revealArrow} aria-hidden="true">↑</span> Swipe up or tap to reveal
        </button>}
      </article>
    </div>
    <div className={s.gradeShelf}>
      <div className={s.gradeIntro}>
        <span>{revealed ? "How well did you remember?" : "Recall it before you look."}</span>
        <span className={s.shelfCount}>{reviewed} / 30 today</span>
      </div>
      <div className={s.ratings} aria-label="Sample review grades">
        {ratings.map((rating, ratingIndex) => <button key={rating} type="button" disabled={!revealed}
          className={`${s.rating} ${ratingIndex === 4 ? s.ratingEz : ""}`}
          onClick={grade} aria-label={`Rate sample card ${rating}`}>
          <span className={s.ratingMark} aria-hidden="true">{ratingIndex + 1}</span>
          {rating}
        </button>)}
      </div>
      <SlotRuler reviewed={reviewed} />
    </div>
  </div>;
}

export default function Hero({ hero, slug }: { hero: Hero; slug: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPlayback = () => {
      const video = videoRef.current;
      if (!video) return;
      if (preference.matches) {
        video.pause();
        video.currentTime = 0;
      } else {
        void video.play().catch(() => {});
      }
    };
    preference.addEventListener("change", syncPlayback);
    syncPlayback();
    return () => preference.removeEventListener("change", syncPlayback);
  }, []);

  return <main className={s.root}>
    <div className={s.art} aria-hidden="true" />
    <video ref={videoRef} className={s.ambientVideo} loop muted playsInline preload="metadata"
      poster="/oss/anki.png" aria-hidden="true">
      <source src="/portfolio/banners/anki.webm" type="video/webm" />
      <source src="/portfolio/banners/anki.mp4" type="video/mp4" />
    </video>
    <div className={s.scrim} aria-hidden="true" />
    <div className={s.orbit} aria-hidden="true" />
    <div className={s.grain} aria-hidden="true" />
    <div className={s.vignette} aria-hidden="true" />
    <div className={s.edgeFrame} aria-hidden="true" />

    <nav className={s.nav} aria-label="Site navigation">
      <Link className={s.brand} href="/"><span className={s.brandStar} aria-hidden="true">✦</span> Pablo</Link>
      <div className={s.navLinks}>
        <Link href="/oss">Open source</Link>
        <Link href="/portfolio">Portfolio</Link>
        <a href={hero.repo} target="_blank" rel="noreferrer">GitHub ↗</a>
      </div>
    </nav>

    <section className={s.hero}>
      <div className={s.copy}>
        <div className={s.smallRule} style={delay(100)}><span className={s.ruleMark} />{hero.kicker}</div>
        <h1 className={s.headline} aria-label={`${hero.titleLead} ${hero.titleMain}`}>
          <span className={s.lineMask}><span className={s.headlineLine} style={delay(210)} aria-hidden="true">{hero.titleLead}</span></span>
          <span className={s.lineMask}><span className={`${s.headlineLine} ${s.headlineSecond}`} style={delay(330)} aria-hidden="true">{hero.titleMain}</span></span>
        </h1>
        <p className={s.subtitle} style={delay(470)}>{hero.subtitle}</p>
        <div className={s.actions} style={delay(570)}>
          <FoldButton href={hero.repo} external>View the code</FoldButton>
          <FoldButton href={`/portfolio/projects/${slug}`} quiet>Read the story</FoldButton>
        </div>
        <p className={s.note} style={delay(680)}><span className={s.noteLine} aria-hidden="true" />{hero.note}</p>
        <div className={s.principles} style={delay(760)}>
          <div><strong>30</strong><span>distinct cards at most</span></div>
          <div><strong>05</strong><span>new cards a day</span></div>
          <div><strong>01</strong><span>source for every answer</span></div>
        </div>
      </div>
      <StudyLane />
    </section>

    <footer className={s.footer}>
      <span className={s.footerName}>{hero.title}</span>
      <span>{hero.oss ? "MIT LICENSED" : "SOURCE AVAILABLE"}</span>
      <span>© 2026 Pablo Manjarres</span>
    </footer>
  </main>;
}
