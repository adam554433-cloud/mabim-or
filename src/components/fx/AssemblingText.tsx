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
  fontFamily = "Assistant, sans-serif",
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

    function build() {
      if (!canvas || !ctx) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      // Measure text
      ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      const metrics = ctx.measureText(text);
      const padX = fontSize * 0.6;
      const padY = fontSize * 0.4;
      const w = Math.ceil(metrics.width) + padX * 2;
      const h = Math.ceil(fontSize * 1.5) + padY * 2;

      sizeRef.current = { w, h };
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Offscreen mask
      const mask = document.createElement("canvas");
      mask.width = w;
      mask.height = h;
      const mctx = mask.getContext("2d", { willReadFrequently: true });
      if (!mctx) return;
      mctx.fillStyle = "#fff";
      mctx.textBaseline = "middle";
      mctx.textAlign = "center";
      mctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
      // RTL letter-spacing tricky — keep simple
      mctx.fillText(text, w / 2, h / 2);
      if (letterSpacing > 0) {
        // optional second pass to thicken (faux letter spacing)
      }

      const data = mctx.getImageData(0, 0, w, h).data;
      const pts: Particle[] = [];
      for (let y = 0; y < h; y += density) {
        for (let x = 0; x < w; x += density) {
          const idx = (y * w + x) * 4 + 3; // alpha
          if (data[idx] > 128) {
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
        ctx.shadowColor = color;
        ctx.shadowBlur = 6 * breath;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r * breath, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      if (!allSettled) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // After settling, keep a gentle twinkle going
        rafRef.current = requestAnimationFrame(twinkleLoop);
      }
    }

    function twinkleLoop() {
      if (!canvas || !ctx) return;
      const { w, h } = sizeRef.current;
      ctx.clearRect(0, 0, w, h);
      const ps = particlesRef.current;
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        p.twinkle += 0.04;
        const breath = 0.7 + 0.3 * (0.5 + 0.5 * Math.sin(p.twinkle + i * 0.1));
        ctx.shadowColor = color;
        ctx.shadowBlur = 4 * breath;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 1.2 * breath, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      rafRef.current = requestAnimationFrame(twinkleLoop);
    }

    build();
    startRef.current = 0;
    rafRef.current = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(rafRef.current);
  }, [text, fontSize, fontWeight, letterSpacing, color, density, duration, fontFamily]);

  return (
    <canvas
      ref={canvasRef}
      className={`block mx-auto ${className}`}
      aria-label={text}
    />
  );
}
