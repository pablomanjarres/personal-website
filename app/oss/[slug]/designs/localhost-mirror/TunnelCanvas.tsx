"use client";

import { useEffect, useRef } from "react";

/**
 * Tunnel of light — dependency-free canvas2d (0 new deps).
 *
 * Concentric rings + fine particles are emitted at the vanishing point and
 * accelerate toward the viewer (perspective: screen r = FOCAL / z). Every stroke
 * is drawn with globalCompositeOperation = "lighter" so overlaps sum into an
 * additive tailnet-green (#4ADE80) glow — a private tunnel of light receding
 * into the dark network. A faint silver ring every Nth "hop" reads as a tailnet
 * relay; a slow rotation + elliptical squash gives the wormhole warp. A trailing
 * near-black fill each frame leaves light-streaks instead of hard-clearing.
 *
 * prefers-reduced-motion: reduce → paint ONE static tunnel-mouth frame, no rAF.
 * The whole loop is isolated in this leaf so the rest of the hero stays light.
 */
export default function TunnelCanvas({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvasEl = ref.current;
    if (!canvasEl) return;
    const context = canvasEl.getContext("2d");
    if (!context) return;
    // Non-nullable bindings so the narrowing survives inside the nested
    // rAF/observer closures below (TS widens captured vars otherwise).
    const canvas: HTMLCanvasElement = canvasEl;
    const ctx: CanvasRenderingContext2D = context;

    const GREEN = [74, 222, 128] as const; // #4ADE80 tailnet signal
    const SILVER = [184, 194, 206] as const; // #B8C2CE mirror chrome
    const BG_TRAIL = "rgba(11, 13, 16, 0.30)"; // #0B0D10 fade for light trails
    const BG_SOLID = "rgb(11, 13, 16)";

    const FOCAL = 210;
    const ZFAR = 3.6;
    const ZNEAR = 0.16;

    type Ring = { z: number; hop: boolean; squash: number };
    type Dot = { z: number; a: number; r: number; silver: boolean };

    let W = 0;
    let H = 0;
    let cx = 0;
    let cy = 0;
    let maxR = 0;

    let rings: Ring[] = [];
    let dots: Dot[] = [];
    let ringAcc = 0;
    let hopCount = 0;
    let theta = 0;

    let raf = 0;
    let last = 0;
    let running = false;

    const colour = (base: readonly number[], alpha: number) =>
      `rgba(${base[0]}, ${base[1]}, ${base[2]}, ${alpha})`;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = Math.max(1, Math.round(rect.width));
      H = Math.max(1, Math.round(rect.height));
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cx = W / 2;
      cy = H / 2;
      maxR = Math.hypot(W, H) * 0.62;
    }

    function seedDots() {
      const N = Math.round(Math.min(150, Math.max(70, (W * H) / 5200)));
      dots = [];
      for (let i = 0; i < N; i++) {
        dots.push({
          z: ZNEAR + Math.random() * (ZFAR - ZNEAR),
          a: Math.random() * Math.PI * 2,
          r: 0.6 + Math.random() * 1.4,
          silver: Math.random() > 0.84,
        });
      }
    }

    function base() {
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = BG_SOLID;
      ctx.fillRect(0, 0, W, H);
    }

    // one composited frame at a given intensity (shared by animation + static).
    function draw(intensity: number) {
      ctx.globalCompositeOperation = "lighter";
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(theta);

      for (const ring of rings) {
        const r = FOCAL / ring.z;
        if (r > maxR) continue;
        const p = (ZFAR - ring.z) / (ZFAR - ZNEAR); // 0 far → 1 near
        const fade = Math.sin(Math.max(0, Math.min(1, p)) * Math.PI);
        const alpha = fade * intensity * (ring.hop ? 0.5 : 0.4);
        ctx.lineWidth = 0.6 + p * 2.4;
        ctx.strokeStyle = colour(ring.hop ? SILVER : GREEN, alpha);
        ctx.beginPath();
        ctx.ellipse(0, 0, r, r * ring.squash, 0, 0, Math.PI * 2);
        ctx.stroke();
      }

      for (const d of dots) {
        const r = FOCAL / d.z;
        if (r > maxR) continue;
        const p = (ZFAR - d.z) / (ZFAR - ZNEAR);
        const fade = Math.sin(Math.max(0, Math.min(1, p)) * Math.PI);
        const x = Math.cos(d.a) * r;
        const y = Math.sin(d.a) * r * 0.96;
        const size = d.r * (0.5 + p * 1.6);
        ctx.fillStyle = colour(d.silver ? SILVER : GREEN, fade * intensity * 0.85);
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();

      // bright light-source at the vanishing point
      const coreR = FOCAL * 0.62;
      const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, coreR);
      grad.addColorStop(0, colour(GREEN, 0.55 * intensity));
      grad.addColorStop(0.35, colour(GREEN, 0.16 * intensity));
      grad.addColorStop(1, colour(GREEN, 0));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, coreR, 0, Math.PI * 2);
      ctx.fill();

      ctx.globalCompositeOperation = "source-over";
    }

    function paintStatic() {
      base();
      rings = [];
      for (let i = 0; i < 9; i++) {
        rings.push({
          z: ZNEAR + (i / 9) * (ZFAR - ZNEAR),
          hop: i % 3 === 0,
          squash: 0.94,
        });
      }
      draw(1);
    }

    function tick(now: number) {
      if (!running) return;
      const dt = last ? Math.min(48, now - last) : 16;
      last = now;

      // fade previous frame → light trails
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = BG_TRAIL;
      ctx.fillRect(0, 0, W, H);

      theta += 0.00016 * dt;
      const speed = 0.00135 * dt;

      for (const ring of rings) ring.z -= speed * ring.z;
      rings = rings.filter((r) => r.z > ZNEAR);

      for (const d of dots) {
        d.z -= speed * d.z;
        if (d.z <= ZNEAR) {
          d.z = ZFAR;
          d.a = Math.random() * Math.PI * 2;
          d.r = 0.6 + Math.random() * 1.4;
          d.silver = Math.random() > 0.84;
        }
      }

      ringAcc += dt;
      while (ringAcc >= 150) {
        ringAcc -= 150;
        hopCount++;
        rings.push({
          z: ZFAR,
          hop: hopCount % 6 === 0,
          squash: 0.9 + Math.random() * 0.08,
        });
      }

      draw(1);
      raf = requestAnimationFrame(tick);
    }

    function start() {
      if (running) return;
      running = true;
      last = 0;
      raf = requestAnimationFrame(tick);
    }

    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
    }

    resize();
    seedDots();

    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)");
    if (reduce?.matches) {
      paintStatic();
      const roStatic = new ResizeObserver(() => {
        resize();
        seedDots();
        paintStatic();
      });
      roStatic.observe(canvas);
      return () => roStatic.disconnect();
    }

    base();
    start();

    const ro = new ResizeObserver(() => {
      resize();
      seedDots();
      base();
    });
    ro.observe(canvas);

    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) start();
          else stop();
        }
      },
      { threshold: 0.01 }
    );
    io.observe(canvas);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
