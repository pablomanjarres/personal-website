"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient rising ember field for the rune portal. Square 2-3px pixel motes —
 * aurora-green + ember-orange — emit from the lava base region (bottom-right,
 * biased toward the portal), drift up with buoyancy + horizontal wander +
 * per-particle flicker, and are drawn as additive ('lighter') crisp squares so
 * they read as 8-bit fire riding over the pixel-art. DPR-aware, pauses on hidden
 * tab, ~60 particle cap. Zero dependencies. Under prefers-reduced-motion the
 * loop never starts (the static scene is the fallback).
 */
export default function AuroraEmbers({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const ro =
      typeof ResizeObserver !== "undefined" ? new ResizeObserver(resize) : null;
    ro?.observe(canvas);

    type P = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      s: number;
      life: number;
      max: number;
      seed: number;
      green: boolean;
    };
    const pool: P[] = [];
    const CAP = 60;

    const spawn = () => {
      // emit from the lava base: x in [0.55, 1.0]*width, biased toward the portal
      const bias = Math.pow(Math.random(), 1.3);
      const x = width * (0.55 + 0.45 * (1 - bias));
      // more ember-orange near the molten portal, some aurora-green motes mixed
      const green = Math.random() < 0.42;
      pool.push({
        x,
        y: height + Math.random() * 10,
        vx: (Math.random() - 0.5) * 0.14,
        vy: -(0.16 + Math.random() * 0.42),
        s: Math.random() < 0.5 ? 2 : 3,
        life: 0,
        max: 2600 + Math.random() * 3200,
        seed: Math.random() * Math.PI * 2,
        green,
      });
    };

    let raf = 0;
    let last = performance.now();
    let paused = false;

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (paused) {
        last = now;
        return;
      }
      const dt = Math.min(48, now - last);
      last = now;
      const step = dt / 16.6667;

      if (pool.length < CAP && Math.random() < 0.6) spawn();

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      for (let i = pool.length - 1; i >= 0; i--) {
        const p = pool[i];
        p.life += dt / p.max;
        if (p.life >= 1) {
          pool.splice(i, 1);
          continue;
        }
        // buoyant rise + air-drag on drift + gentle sinusoidal wander
        p.vy -= 0.0008 * step;
        p.vx *= Math.pow(0.986, step);
        p.x += (p.vx + Math.sin(p.seed + p.life * 6) * 0.24) * step;
        p.y += p.vy * step * 8;

        const fade = Math.sin(Math.min(1, p.life) * Math.PI);
        const flick = 0.7 + 0.3 * Math.sin(now * 0.02 + p.seed);
        const alpha = Math.min(1, fade * flick);
        if (alpha <= 0.02) continue;

        ctx.globalAlpha = alpha;
        ctx.fillStyle = p.green ? "#5be584" : "#ff9a4a";
        // snap to integer pixels so the motes stay crisp 8-bit squares
        ctx.fillRect(Math.round(p.x), Math.round(p.y), p.s, p.s);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    };
    raf = requestAnimationFrame(frame);

    const onVisibility = () => {
      paused = document.hidden;
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      ro?.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
