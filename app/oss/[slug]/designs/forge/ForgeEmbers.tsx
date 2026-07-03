"use client";

import { useEffect, useRef } from "react";

/**
 * Ambient rising-ember / spark field. Warm particles emit from the bottom edge,
 * drift up with buoyancy + horizontal wander + per-particle flicker, drawn as
 * additive ('lighter') glow sprites so they read as fire. Zero dependencies.
 * Under prefers-reduced-motion the loop never starts (the CSS ember pool + baked
 * floor glow are the static fallback).
 */
export default function ForgeEmbers({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;

    // pre-baked soft glow sprites (orange + gold) — cheap additive drawImage
    const sprite = (inner: string, outer: string): HTMLCanvasElement => {
      const s = document.createElement("canvas");
      const size = 64;
      s.width = size;
      s.height = size;
      const g = s.getContext("2d");
      if (g) {
        const rad = g.createRadialGradient(
          size / 2,
          size / 2,
          0,
          size / 2,
          size / 2,
          size / 2
        );
        rad.addColorStop(0, "rgba(255,255,255,0.95)");
        rad.addColorStop(0.32, inner);
        rad.addColorStop(0.7, outer);
        rad.addColorStop(1, "rgba(255,76,0,0)");
        g.fillStyle = rad;
        g.fillRect(0, 0, size, size);
      }
      return s;
    };
    const sprites = [
      sprite("rgba(255,150,40,0.95)", "rgba(255,76,0,0.35)"),
      sprite("rgba(255,196,74,0.95)", "rgba(255,120,0,0.3)"),
    ];

    type P = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      life: number;
      max: number;
      seed: number;
      spr: number;
      flick: number;
    };
    const pool: P[] = [];

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
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(resize)
        : null;
    ro?.observe(canvas);

    const cap = () => Math.min(150, Math.round(width / 9));

    const spawn = () => {
      // bias emission toward the centre where the forge is hottest
      const bias = Math.pow(Math.random(), 1.4);
      const side = Math.random() < 0.5 ? -1 : 1;
      const x = width / 2 + side * bias * (width / 2) * 1.02;
      const max = 2200 + Math.random() * 3200;
      pool.push({
        x,
        y: height + Math.random() * 14,
        vx: (Math.random() - 0.5) * 0.12,
        vy: -(0.18 + Math.random() * 0.5),
        r: 0.7 + Math.random() * 2.1,
        life: 0,
        max,
        seed: Math.random() * Math.PI * 2,
        spr: Math.random() < 0.7 ? 0 : 1,
        flick: 0.5 + Math.random() * 0.5,
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

      // emit
      const budget = cap();
      if (pool.length < budget) {
        const emit = 1 + Math.random() * 2.4;
        for (let i = 0; i < emit && pool.length < budget; i++) spawn();
      }

      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";

      for (let i = pool.length - 1; i >= 0; i--) {
        const p = pool[i];
        p.life += dt / p.max;
        if (p.life >= 1) {
          pool.splice(i, 1);
          continue;
        }
        // buoyant rise, slight upward acceleration then air-drag on drift
        p.vy -= 0.0009 * step;
        p.vx *= Math.pow(0.985, step);
        p.x += (p.vx + Math.sin(p.seed + p.life * 7) * 0.28) * step;
        p.y += p.vy * step * 8;

        // alpha: quick ignite, long fade; multiplied by a subtle flicker
        const fade = Math.sin(Math.min(1, p.life) * Math.PI);
        const flick =
          0.72 + 0.28 * Math.sin(now * 0.02 * p.flick + p.seed);
        const alpha = fade * flick;
        if (alpha <= 0.01) continue;

        const size = p.r * (1.6 - p.life * 0.7) * 8;
        ctx.globalAlpha = Math.min(1, alpha);
        ctx.drawImage(
          sprites[p.spr],
          p.x - size / 2,
          p.y - size / 2,
          size,
          size
        );
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
