"use client";

// Faint ciphertext RAIN — the ambient vault atmosphere. Phosphor-teal hex/symbol
// glyphs fall in columns on true black; each frame overpaints translucent black
// to leave a fading comet trail. Kept deliberately faint (head alpha ~0.16) and
// throttled to ~30fps for OLED battery. Reduced-motion draws a single static
// glyph field instead. Dependency-free canvas2d — no WebGL, no libraries.
import { useEffect, useRef } from "react";

const GLYPHS = "ABCDEF0123456789ABCDEF0123456789!<>-_/[]{}=+*^?#".split("");
const rnd = (n: number) => (Math.random() * n) | 0;

export default function CipherRain({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const COL = 22; // px between columns
    const FS = 15; // glyph size in css px
    const ROW = FS + 3;

    let W = 0;
    let H = 0;
    let cols = 0;
    let y: number[] = [];
    let sp: number[] = [];
    let a: number[] = [];

    // Read the *computed* font-family (set on .rain in the CSS module) so the
    // next/font var() is already resolved to a real family the canvas can use —
    // reading a nested-var custom property would hand ctx an unusable "var(...)".
    const fontStack = () =>
      getComputedStyle(canvas).fontFamily || "ui-monospace, monospace";

    const measure = () => {
      const p = canvas.parentElement;
      const r = p
        ? p.getBoundingClientRect()
        : { width: window.innerWidth, height: window.innerHeight };
      W = Math.max(1, Math.floor(r.width));
      H = Math.max(1, Math.floor(r.height));
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.floor(W * dpr);
      canvas.height = Math.floor(H * dpr);
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.font = `${FS}px ${fontStack()}`;
      ctx.textBaseline = "top";
      cols = Math.ceil(W / COL) + 1;
      y = new Array(cols);
      sp = new Array(cols);
      a = new Array(cols);
      for (let i = 0; i < cols; i++) {
        y[i] = rnd(H);
        sp[i] = 0.45 + Math.random() * 0.7; // rows per drawn frame
        a[i] = 0.08 + Math.random() * 0.09; // per-column head alpha (<= ~0.17)
      }
    };

    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      measure();
      ctx.clearRect(0, 0, W, H);
      for (let cx = 0; cx < cols; cx++) {
        for (let ry = 0; ry * ROW < H; ry++) {
          if (Math.random() < 0.55) continue;
          ctx.fillStyle = `rgba(34,230,164,${0.03 + Math.random() * 0.05})`;
          ctx.fillText(GLYPHS[rnd(GLYPHS.length)], cx * COL, ry * ROW);
        }
      }
      return;
    }

    measure();

    let raf = 0;
    let last = 0;
    const STEP = 1000 / 30;

    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last < STEP) return;
      last = t;

      // Fade the previous frame to leave short comet trails.
      ctx.fillStyle = "rgba(0,0,0,0.10)";
      ctx.fillRect(0, 0, W, H);
      ctx.font = `${FS}px ${fontStack()}`;

      for (let i = 0; i < cols; i++) {
        const px = i * COL;
        const py = y[i] * ROW;
        // trailing glyph (dimmer teal)
        ctx.fillStyle = `rgba(34,230,164,${a[i]})`;
        ctx.fillText(GLYPHS[rnd(GLYPHS.length)], px, py);
        // brighter head just above, occasionally, for depth
        ctx.fillStyle = `rgba(150,255,214,${a[i] + 0.05})`;
        ctx.fillText(GLYPHS[rnd(GLYPHS.length)], px, py - ROW);

        y[i] += sp[i];
        if (py > H && Math.random() > 0.975) {
          y[i] = -rnd(12);
          sp[i] = 0.45 + Math.random() * 0.7;
          a[i] = 0.08 + Math.random() * 0.09;
        }
      }
    };

    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        last = 0;
        raf = requestAnimationFrame(draw);
      }
    };

    let rt = 0;
    const ro = new ResizeObserver(() => {
      window.clearTimeout(rt);
      rt = window.setTimeout(measure, 150);
    });
    if (canvas.parentElement) ro.observe(canvas.parentElement);
    document.addEventListener("visibilitychange", onVisibility);
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(rt);
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
