"use client";

import { useEffect, useRef } from "react";

type Props = {
  text: string;
  fontSize?: number;        // px
  fontWeight?: number | string;
  letterSpacing?: number;
  color?: string;           // particle color
  density?: number;         // 1 = every pixel, 4 = every 4 px (less = denser)
  duration?: number;        // assemble time (ms)
  hold?: boolean;           // hold after assembling (default true)
  className?: string;
  fontFamily?: string;
};

type Particle = {
  // target position
  tx: number;
  ty: number;
  // current
  x: number;
  y: number;
  // initial scatter
  sx: number;
  sy: number;
  delay: number;
  twinkle: number;
};

export default function AssemblingText({
  text,
  fontSize = 64,
  fontWeight = 800,
  letterSpacing = 0,
  color = "#fbbf24",
  density = 4,
  duration = 1600,
  className = "",
  fontFamily = "Heebo, Arial, sans-serif",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const startRef = useRef<number>(0);
  const rafRef = useRef(0);
  const particlesRef = useRef<Particle[]>([]);
  const sizeRef = useRef({ w: 0, h: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let cancelled = false;

    function build() {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      // Use textAlign:center for symmetric anchoring (works for RTL & LTR).
      // Measure with actual visual bounding box — logical width is unreliable
      // for Hebrew and can leave stray dots / off-center placement.
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      const metrics = ctx.measureText(text);
      const left = metrics.actualBoundingBoxLeft ?? metrics.width / 2;
      const right = metrics.actualBoundingBoxRight ?? metrics.width / 2;
      const ascent = metrics.actualBoundingBoxAscent ?? fontSize * 0.7;
      const descent = metrics.actualBoundingBoxDescent ?? fontSize * 0.3;
      const textW = left + right;
      const textH = ascent + descent;

      const padX = fontSize * 0.4;
      const padY = fontSize * 0.4;
      const w = Math.ceil(textW + padX * 2);
      const h = Math.ceil(textH + padY * 2);

      sizeRef.current = { w, h };
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Mask: draw at exact visual center accounting for L/R asymmetry
      const mask = document.createElement("canvas");
      mask.width = w;
      mask.height = h;
      const mctx = mask.getContext("2d", { willReadFrequently: true });
      if (!mctx) return;
      mctx.fillStyle = "#fff";
      mctx.textAlign = "center";
      mctx.textBaseline = "middle";
      mctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      // shift anchor by (right - left)/2 so the visual centroid lands at w/2
      const anchorX = w / 2 + (left - right) / 2;
      const anchorY = h / 2 + (ascent - descent) / 2;
      mctx.fillText(text, anchorX, anchorY);

      const data = mctx.getImageData(0, 0, w, h).data;
      const pts: Particle[] = [];
      // Lower alpha threshold so we catch anti-aliased edges and don't lose
      // thin vertical strokes inside Hebrew glyphs (מ, ב, ם, etc.)
      for (let y = 0; y < h; y += density) {
        for (let x = 0; x < w; x += density) {
          const idx = (y * w + x) * 4 + 3; // alpha
          if (data[idx] > 40) {
            // scatter starting position from outside
            const angle = Math.random() * Math.PI * 2;
            const dist = Math.max(w, h) * (0.6 + Math.random() * 0.6);
            pts.push({
              tx: x,
              ty: y,
              x: w / 2 + Math.cos(angle) * dist,
              y: h / 2 + Math.sin(angle) * dist,
              sx: w / 2 + Math.cos(angle) * dist,
              sy: h / 2 + Math.sin(angle) * dist,
              delay: Math.random() * 400,
              twinkle: Math.random() * Math.PI * 2,
            });
          }
        }
      }
      particlesRef.current = pts;
    }

    function easeOut(t: number) {
      return 1 - Math.pow(1 - t, 3);
    }

    function tick(ts: number) {
      if (!canvas || !ctx) return;
      if (!startRef.current) startRef.current = ts;
      const elapsed = ts - startRef.current;
      const { w, h } = sizeRef.current;
      ctx.clearRect(0, 0, w, h);

      const ps = particlesRef.current;
      let allSettled = true;
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        const t = Math.min(1, Math.max(0, (elapsed - p.delay) / duration));
        const e = easeOut(t);
        p.x = p.sx + (p.tx - p.sx) * e;
        p.y = p.sy + (p.ty - p.sy) * e;
        p.twinkle += 0.07;
        if (t < 1) allSettled = false;

        const breath = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(p.twinkle));
        const r = (1 - t) * 1.6 + 1.1;
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.7 + 0.3 * breath;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * breath, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (!allSettled) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // After settling, keep a gentle twinkle going
        rafRef.current = requestAnimationFrame(twinkleLoop);
      }
    }

    let visible = true;
    let settledFrame = 0;
    function twinkleLoop() {
      if (!canvas || !ctx) return;
      if (!visible) {
        // pause loop while offscreen; will be restarted by the observer
        return;
      }
      const { w, h } = sizeRef.current;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = color;
      settledFrame++;
      const phase = settledFrame * 0.04;
      const ps = particlesRef.current;
      // Settled look: all dots full brightness, constant radius. Only ~6% of
      // dots flicker at a time — picked by a slow phase, so the shape of the
      // word stays rock-steady and you just see occasional sparkles.
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        // deterministic per-particle offset so each twinkles on its own clock
        const personal = (i * 12.9898) % 6.2831853;
        const s = Math.sin(phase + personal);
        // only the top crests of the sine flicker; rest stays at base alpha
        const flicker = s > 0.85 ? (s - 0.85) / 0.15 : 0;
        ctx.globalAlpha = 0.85 + 0.15 * flicker;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.1, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(twinkleLoop);
    }

    const io =
      typeof IntersectionObserver !== "undefined"
        ? new IntersectionObserver(
            (entries) => {
              const wasVisible = visible;
              visible = entries[0]?.isIntersecting ?? true;
              if (visible && !wasVisible) {
                rafRef.current = requestAnimationFrame(twinkleLoop);
              }
            },
            { threshold: 0.01 }
          )
        : null;
    if (io && canvas) io.observe(canvas);

    function start() {
      if (cancelled) return;
      build();
      startRef.current = 0;
      rafRef.current = requestAnimationFrame(tick);
    }

    // Explicitly load the exact font we'll draw with, so canvas doesn't fall
    // back to a generic sans-serif (which renders Hebrew differently).
    const fontSpec = `${fontWeight} ${fontSize}px ${fontFamily}`;
    if (typeof document !== "undefined" && document.fonts?.load) {
      document.fonts.load(fontSpec, text).then(start).catch(start);
    } else {
      start();
    }

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafRef.current);
      io?.disconnect();
    };
  }, [text, fontSize, fontWeight, letterSpacing, color, density, duration, fontFamily]);

  return (
    <canvas
      ref={canvasRef}
      className={`block mx-auto ${className}`}
      aria-label={text}
      style={{
        // Tight halo around each dot — soft enough to feel warm, narrow
        // enough that individual sparks stay distinguishable.
        filter: `drop-shadow(0 0 2px ${color}) drop-shadow(0 0 5px ${color})`,
      }}
    />
  );
}
