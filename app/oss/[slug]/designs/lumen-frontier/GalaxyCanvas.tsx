"use client";

/**
 * GalaxyCanvas — the Lumen Frontier hero motion.
 *
 * The product itself is a Three.js fly-through galaxy, so the landing hero
 * reuses that DNA — but this site ships ZERO 3D dependencies, so the canonical
 * "galaxy generator" (thousands of additive points scattered on spiral arms,
 * color-lerped from a warm brass/cognac core through ivory mids to a burgundy
 * rim) is ported here to a RAW WebGL context. Slow autorotate + eased pointer
 * parallax + a gentle sinusoidal dolly read as drifting through the galaxy; a
 * fainter second point layer rotates slower for star-dust parallax.
 *
 * Robustness: reduced-motion and WebGL-unavailable visitors never start the GPU
 * loop — the canvas simply stays transparent and the CSS radial-gradient poster
 * (painted underneath, server-side) shows through. DPR is capped at 2, the loop
 * pauses on a hidden tab, and everything is torn down on unmount.
 */

import { useEffect, useRef } from "react";

// ---- tiny column-major mat4 helpers (no gl-matrix dependency) --------------
function mul(a: Float32Array, b: Float32Array): Float32Array {
  const o = new Float32Array(16);
  for (let c = 0; c < 4; c++) {
    const b0 = b[c * 4], b1 = b[c * 4 + 1], b2 = b[c * 4 + 2], b3 = b[c * 4 + 3];
    o[c * 4] = a[0] * b0 + a[4] * b1 + a[8] * b2 + a[12] * b3;
    o[c * 4 + 1] = a[1] * b0 + a[5] * b1 + a[9] * b2 + a[13] * b3;
    o[c * 4 + 2] = a[2] * b0 + a[6] * b1 + a[10] * b2 + a[14] * b3;
    o[c * 4 + 3] = a[3] * b0 + a[7] * b1 + a[11] * b2 + a[15] * b3;
  }
  return o;
}
function perspective(fovy: number, aspect: number, near: number, far: number): Float32Array {
  const f = 1 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);
  const o = new Float32Array(16);
  o[0] = f / aspect;
  o[5] = f;
  o[10] = (far + near) * nf;
  o[11] = -1;
  o[14] = 2 * far * near * nf;
  return o;
}
function rotX(a: number): Float32Array {
  const c = Math.cos(a), s = Math.sin(a);
  return new Float32Array([1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]);
}
function rotY(a: number): Float32Array {
  const c = Math.cos(a), s = Math.sin(a);
  return new Float32Array([c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]);
}
function translate(x: number, y: number, z: number): Float32Array {
  return new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1]);
}

// ---- galaxy geometry (the "galaxy generator") ------------------------------
type Layer = { pos: WebGLBuffer; col: WebGLBuffer; count: number };

const CORE: [number, number, number] = [0.97, 0.78, 0.5]; // warm brass/cognac core
const MID: [number, number, number] = [0.95, 0.91, 0.83]; // ivory mid
const RIM: [number, number, number] = [0.48, 0.18, 0.23]; // burgundy rim

function ramp(t: number, out: number[], o: number) {
  // core -> ivory -> burgundy, two-stop lerp for the ivory mids
  let r: number, g: number, b: number;
  if (t < 0.5) {
    const k = t / 0.5;
    r = CORE[0] + (MID[0] - CORE[0]) * k;
    g = CORE[1] + (MID[1] - CORE[1]) * k;
    b = CORE[2] + (MID[2] - CORE[2]) * k;
  } else {
    const k = (t - 0.5) / 0.5;
    r = MID[0] + (RIM[0] - MID[0]) * k;
    g = MID[1] + (RIM[1] - MID[1]) * k;
    b = MID[2] + (RIM[2] - MID[2]) * k;
  }
  out[o] = r;
  out[o + 1] = g;
  out[o + 2] = b;
}

function buildGalaxy(count: number) {
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  const c: number[] = [0, 0, 0];
  const maxR = 4.2;
  const branches = 4;
  const spin = 0.9;
  const randomness = 0.26;
  const rp = 3;
  for (let i = 0; i < count; i++) {
    const r = Math.random() * maxR;
    const branch = ((i % branches) / branches) * Math.PI * 2;
    const spinA = r * spin;
    const s = () => (Math.random() < 0.5 ? 1 : -1) * Math.pow(Math.random(), rp) * randomness * r;
    const ox = s();
    const oy = s() * 0.5; // flatten the disk
    const oz = s();
    pos[i * 3] = Math.cos(branch + spinA) * r + ox;
    pos[i * 3 + 1] = oy;
    pos[i * 3 + 2] = Math.sin(branch + spinA) * r + oz;
    ramp(r / maxR, c, 0);
    col[i * 3] = c[0];
    col[i * 3 + 1] = c[1];
    col[i * 3 + 2] = c[2];
  }
  return { pos, col };
}

function buildDust(count: number) {
  const pos = new Float32Array(count * 3);
  const col = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    const r = 3 + Math.random() * 4.6;
    const a = Math.random() * Math.PI * 2;
    pos[i * 3] = Math.cos(a) * r + (Math.random() - 0.5) * 1.5;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 2.6;
    pos[i * 3 + 2] = Math.sin(a) * r + (Math.random() - 0.5) * 1.5;
    const tone = 0.42 + Math.random() * 0.28;
    col[i * 3] = 0.95 * tone;
    col[i * 3 + 1] = 0.9 * tone;
    col[i * 3 + 2] = 0.78 * tone;
  }
  return { pos, col };
}

const VERT = `
attribute vec3 aPos;
attribute vec3 aColor;
uniform mat4 uProj;
uniform mat4 uView;
uniform float uSize;
varying vec3 vColor;
void main() {
  vec4 mv = uView * vec4(aPos, 1.0);
  gl_Position = uProj * mv;
  gl_PointSize = clamp(uSize * (6.0 / -mv.z), 1.0, 28.0);
  vColor = aColor;
}`;

const FRAG = `
precision mediump float;
varying vec3 vColor;
void main() {
  float d = distance(gl_PointCoord, vec2(0.5));
  float a = smoothstep(0.5, 0.0, d);
  a = pow(a, 1.6);
  if (a < 0.01) discard;
  gl_FragColor = vec4(vColor, a);
}`;

export default function GalaxyCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let gl: WebGLRenderingContext | null = null;
    try {
      const opts: WebGLContextAttributes = {
        alpha: true,
        premultipliedAlpha: false,
        antialias: true,
        depth: false,
        powerPreference: "low-power",
      };
      gl =
        (canvas.getContext("webgl", opts) as WebGLRenderingContext | null) ||
        (canvas.getContext("experimental-webgl", opts) as WebGLRenderingContext | null);
    } catch {
      gl = null;
    }
    if (!gl) return;
    const glc = gl;

    const compile = (type: number, src: string) => {
      const sh = glc.createShader(type);
      if (!sh) return null;
      glc.shaderSource(sh, src);
      glc.compileShader(sh);
      if (!glc.getShaderParameter(sh, glc.COMPILE_STATUS)) {
        glc.deleteShader(sh);
        return null;
      }
      return sh;
    };
    const vs = compile(glc.VERTEX_SHADER, VERT);
    const fs = compile(glc.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = glc.createProgram();
    if (!prog) return;
    glc.attachShader(prog, vs);
    glc.attachShader(prog, fs);
    glc.linkProgram(prog);
    if (!glc.getProgramParameter(prog, glc.LINK_STATUS)) {
      glc.deleteProgram(prog);
      return;
    }

    const aPos = glc.getAttribLocation(prog, "aPos");
    const aColor = glc.getAttribLocation(prog, "aColor");
    const uProj = glc.getUniformLocation(prog, "uProj");
    const uView = glc.getUniformLocation(prog, "uView");
    const uSize = glc.getUniformLocation(prog, "uSize");

    const makeLayer = (data: { pos: Float32Array; col: Float32Array }): Layer | null => {
      const pb = glc.createBuffer();
      const cb = glc.createBuffer();
      if (!pb || !cb) return null;
      glc.bindBuffer(glc.ARRAY_BUFFER, pb);
      glc.bufferData(glc.ARRAY_BUFFER, data.pos, glc.STATIC_DRAW);
      glc.bindBuffer(glc.ARRAY_BUFFER, cb);
      glc.bufferData(glc.ARRAY_BUFFER, data.col, glc.STATIC_DRAW);
      return { pos: pb, col: cb, count: data.pos.length / 3 };
    };

    const galaxy = makeLayer(buildGalaxy(9000));
    const dust = makeLayer(buildDust(1600));
    if (!galaxy || !dust) return;

    let dpr = Math.min(window.devicePixelRatio || 1, 2);
    let proj = perspective(0.92, 1, 0.1, 100);

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.max(1, Math.floor(canvas.clientWidth * dpr));
      const h = Math.max(1, Math.floor(canvas.clientHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      glc.viewport(0, 0, w, h);
      proj = perspective(0.92, w / h, 0.1, 100);
    };
    resize();

    // eased pointer parallax
    let tpx = 0, tpy = 0, px = 0, py = 0;
    const onPointer = (e: PointerEvent) => {
      tpx = e.clientX / window.innerWidth - 0.5;
      tpy = e.clientY / window.innerHeight - 0.5;
    };

    glc.disable(glc.DEPTH_TEST);
    glc.enable(glc.BLEND);
    glc.blendFunc(glc.SRC_ALPHA, glc.ONE); // additive: overlaps bloom

    const drawLayer = (layer: Layer, view: Float32Array, size: number) => {
      glc.bindBuffer(glc.ARRAY_BUFFER, layer.pos);
      glc.enableVertexAttribArray(aPos);
      glc.vertexAttribPointer(aPos, 3, glc.FLOAT, false, 0, 0);
      glc.bindBuffer(glc.ARRAY_BUFFER, layer.col);
      glc.enableVertexAttribArray(aColor);
      glc.vertexAttribPointer(aColor, 3, glc.FLOAT, false, 0, 0);
      glc.uniformMatrix4fv(uView, false, view);
      glc.uniform1f(uSize, size);
      glc.drawArrays(glc.POINTS, 0, layer.count);
    };

    let raf = 0;
    let running = true;
    let shown = false;
    const start = performance.now();
    const tilt = 1.02;

    const frame = (now: number) => {
      if (!running) return;
      const t = (now - start) / 1000;
      px += (tpx - px) * 0.05;
      py += (tpy - py) * 0.05;
      const angle = t * 0.05;
      const dist = 6.2 + Math.sin(t * 0.09) * 0.9;

      glc.useProgram(prog);
      glc.uniformMatrix4fv(uProj, false, proj);
      glc.clearColor(0, 0, 0, 0);
      glc.clear(glc.COLOR_BUFFER_BIT);

      const rx = rotX(tilt + py * 0.28);
      // Bias the core toward screen lower-right so the left type column keeps the
      // dark navy field, matching the poster + OG composition.
      const camT = translate(1.15 + px * 0.4, -0.5 - py * 0.25, -dist);
      const dustView = mul(mul(camT, rx), rotY(angle * 0.55));
      const galView = mul(mul(camT, rx), rotY(angle));

      drawLayer(dust, dustView, 1.8 * dpr);
      drawLayer(galaxy, galView, 3.2 * dpr);

      if (!shown && canvas.width > 1) {
        shown = true;
        canvas.style.opacity = "1";
      }
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(frame);
      }
    };

    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
      glc.deleteBuffer(galaxy.pos);
      glc.deleteBuffer(galaxy.col);
      glc.deleteBuffer(dust.pos);
      glc.deleteBuffer(dust.col);
      glc.deleteProgram(prog);
      glc.deleteShader(vs);
      glc.deleteShader(fs);
      const lose = glc.getExtension("WEBGL_lose_context");
      if (lose) lose.loseContext();
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
