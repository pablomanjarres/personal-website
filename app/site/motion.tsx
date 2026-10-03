"use client";

import { useEffect, useRef, useState, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";
import styles from "./motion.module.css";

function subscribeReduced(listener: () => void) {
  const media = window.matchMedia("(prefers-reduced-motion: reduce)");
  media.addEventListener("change", listener);
  return () => media.removeEventListener("change", listener);
}
const getReduced = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const serverReduced = () => false;

export function MotionRoot({ children, className, style, concept }: {
  children: ReactNode; className: string; style: CSSProperties; concept: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const reduced = useSyncExternalStore(subscribeReduced, getReduced, serverReduced);

  useEffect(() => {
    const root = ref.current;
    if (!root || reduced || paused) return;
    const reveals = Array.from(root.querySelectorAll<HTMLElement>("[data-reveal]"));
    const hero = root.querySelector<HTMLElement>("main section");
    let pointerFrame = 0;
    let scrollFrame = 0;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const observer = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.setAttribute("data-revealed", "true");
          entry.target.removeAttribute("data-pending");
          observer?.unobserve(entry.target);
        }
      }
    }, { threshold: 0.06 }) : null;
    for (const element of reveals) {
      if (element.getBoundingClientRect().top >= window.innerHeight && observer) {
        element.setAttribute("data-pending", "true");
        observer.observe(element);
      } else element.setAttribute("data-revealed", "true");
    }
    const onMove = (event: PointerEvent) => {
      if (!finePointer.matches || event.pointerType !== "mouse") return;
      const x = Math.max(-1, Math.min(1, event.clientX / window.innerWidth * 2 - 1));
      const y = Math.max(-1, Math.min(1, event.clientY / window.innerHeight * 2 - 1));
      cancelAnimationFrame(pointerFrame);
      pointerFrame = requestAnimationFrame(() => {
        root.style.setProperty("--pointer-x", x.toFixed(3));
        root.style.setProperty("--pointer-y", y.toFixed(3));
      });
    };
    const resetPointer = () => {
      cancelAnimationFrame(pointerFrame);
      root.style.setProperty("--pointer-x", "0");
      root.style.setProperty("--pointer-y", "0");
    };
    const onScroll = () => {
      if (scrollFrame || !hero) return;
      scrollFrame = requestAnimationFrame(() => {
        const bounds = hero.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -bounds.top / bounds.height));
        root.style.setProperty("--hero-scroll", progress.toFixed(3));
        scrollFrame = 0;
      });
    };
    const onFocus = (event: FocusEvent) => {
      const target = event.target instanceof Element ? event.target.closest("[data-reveal]") : null;
      target?.setAttribute("data-revealed", "true");
      target?.removeAttribute("data-pending");
    };
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", resetPointer);
    root.addEventListener("focusin", onFocus);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      observer?.disconnect();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", resetPointer);
      root.removeEventListener("focusin", onFocus);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(pointerFrame);
      cancelAnimationFrame(scrollFrame);
      resetPointer();
      root.style.setProperty("--hero-scroll", "0");
      for (const element of reveals) element.removeAttribute("data-pending");
    };
  }, [paused, reduced]);

  const replay = () => {
    if (reduced || !ref.current) return;
    setPaused(false);
    ref.current.dataset.motion = "active";
    for (const animation of ref.current.getAnimations({ subtree: true })) {
      animation.currentTime = 0;
      animation.play();
    }
  };

  return (
    <div ref={ref} className={`${className} ${styles.root}`} style={style} data-concept={concept} data-motion={reduced ? "reduced" : paused ? "paused" : "active"}>
      {children}
      <div className={styles.controls} role="group" aria-label="Motion controls">
        <button type="button" onClick={() => setPaused(value => !value)} aria-pressed={paused} disabled={reduced}>{reduced ? "Motion off" : paused ? "Resume motion" : "Pause motion"}</button>
        <button type="button" onClick={replay} disabled={reduced} aria-label="Replay entrance animation">Replay <span aria-hidden>↻</span></button>
      </div>
    </div>
  );
}
