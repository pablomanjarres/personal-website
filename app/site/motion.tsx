"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import styles from "./motion.module.css";
import { useReducedMotion } from "./useReducedMotion";

export function MotionRoot({ children, className, style, concept }: {
  children: ReactNode; className: string; style: CSSProperties; concept: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [paused, setPaused] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    const root = ref.current;
    if (!root || reduced || paused) return;
    const pending = new Set<Element>();
    const registered = new WeakSet<Element>();
    let hero = root.querySelector<HTMLElement>("main section");
    let pointerFrame = 0;
    let scrollFrame = 0;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reveal = (element: Element) => {
      element.setAttribute("data-revealed", "true");
      element.removeAttribute("data-pending");
      observer?.unobserve(element);
      pending.delete(element);
    };
    const observer = typeof IntersectionObserver !== "undefined" ? new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) reveal(entry.target);
      }
    }, { threshold: 0.06 }) : null;
    const register = (scope: Element) => {
      const reveals = Array.from(scope.querySelectorAll("[data-reveal]"));
      if (scope.matches("[data-reveal]")) reveals.unshift(scope);
      for (const element of reveals) {
        if (registered.has(element)) continue;
        registered.add(element);
        if (element.hasAttribute("data-revealed")) continue;
        if (element.getBoundingClientRect().top >= window.innerHeight && observer) {
          element.setAttribute("data-pending", "true");
          pending.add(element);
          observer.observe(element);
        } else reveal(element);
      }
    };
    register(root);
    const contentObserver = new MutationObserver(records => {
      for (const record of records) {
        for (const node of record.addedNodes) if (node instanceof Element) register(node);
      }
      if (records.some(record => record.removedNodes.length)) {
        for (const element of pending) if (!root.contains(element)) {
          observer?.unobserve(element);
          element.removeAttribute("data-pending");
          registered.delete(element);
          pending.delete(element);
        }
      }
      hero = root.querySelector<HTMLElement>("main section");
      onScroll();
    });
    contentObserver.observe(root, { childList: true, subtree: true });
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
        scrollFrame = 0;
        if (!hero) return;
        const bounds = hero.getBoundingClientRect();
        const progress = Math.max(0, Math.min(1, -bounds.top / bounds.height));
        root.style.setProperty("--hero-scroll", progress.toFixed(3));
      });
    };
    const onFocus = (event: FocusEvent) => {
      let target = event.target instanceof Element ? event.target.closest("[data-reveal]") : null;
      while (target && root.contains(target)) {
        reveal(target);
        target = target.parentElement?.closest("[data-reveal]") ?? null;
      }
    };
    root.addEventListener("pointermove", onMove);
    root.addEventListener("pointerleave", resetPointer);
    root.addEventListener("focusin", onFocus);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => {
      observer?.disconnect();
      contentObserver.disconnect();
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", resetPointer);
      root.removeEventListener("focusin", onFocus);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(pointerFrame);
      cancelAnimationFrame(scrollFrame);
      resetPointer();
      root.style.setProperty("--hero-scroll", "0");
      for (const element of pending) element.removeAttribute("data-pending");
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
