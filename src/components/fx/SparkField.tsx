"use client";

import { useEffect, useRef } from "react";

type Props = {
  density?: number;        // sparks per 10k px²
  maxDistance?: number;    // px — connect when closer
  speed?: number;          // base velocity
  color?: string;          // spark color
  lineColor?: string;      // line color (with alpha applied per distance)
  glow?: boolean;          // soft glow per dot
  attractMouse?: boolean;  // sparks tilt toward cursor
  className?: string;
  fade?: boolean;          // trailing fade (motion blur)
};

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;
  phase: number;
};

export default function SparkField({
  density = 0.08,
  maxDistance = 110,
  speed = 0.25,
  color = "rgba(251,191,36,0.85)",
  lineColor = "251,191,36",
  glow = true,
  attractMouse = true,
  className = "",
  fade = true,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);
  const rafRef = useRef(0);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });
  const sizeRef = useRef({ w: 0, h: 0, dpr: 1 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    function resize() {
      if (!canvas) return;
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      // Bail if parent has no size yet (e.g. hidden by media query)
      if (rect.width < 10 || rect.height < 10) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      sizeRef.current = { w: rect.width, h: rect.height, dpr };
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Cap sparks on mobile to keep frame rate high
      const cap = window.innerWidth < 768 ? 40 : 140;
      const count = Math.min(
        cap,
        Math.max(
          10,
          Math.round(((rect.width * rect.height) / 10000) * density)
        )
      );
      sparksRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * rect.width,
        y: Math.random() * rect.height,
        vx: (Math.random() - 0.5) * speed,
        vy: (Math.random() - 0.5) * speed,
        r: 0.7 + Math.random() * 1.6,
        phase: Math.random() * Math.PI * 2,
      }));
    }

    function onMove(e: MouseEvent) {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        active: true,
      };
    }
    function onLeave() {
      mouseRef.current.active = false;
    }

    function tick() {
      if (!canvas || !ctx) return;
      const { w, h } = sizeRef.current;
      if (fade) {
        ctx.fillStyle = "rgba(10,7,0,0.35)";
        ctx.fillRect(0, 0, w, h);
      } else {
        ctx.clearRect(0, 0, w, h);
      }

      const sparks = sparksRef.current;
      const mouse = mouseRef.current;

      for (let i = 0; i < sparks.length; i++) {
        const s = sparks[i];
        // Drift
        s.x += s.vx;
        s.y += s.vy;
        s.phase += 0.04;

        // Subtle attraction to mouse
        if (attractMouse && mouse.active) {
          const dx = mouse.x - s.x;
          const dy = mouse.y - s.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 160 * 160) {
            const f = 0.0008;
            s.vx += dx * f;
            s.vy += dy * f;
          }
        }

        // Friction + clamp velocity
        s.vx *= 0.985;
        s.vy *= 0.985;
        if (Math.abs(s.vx) < 0.04)
          s.vx += (Math.random() - 0.5) * 0.04;
        if (Math.abs(s.vy) < 0.04)
          s.vy += (Math.random() - 0.5) * 0.04;

        // Wrap edges
        if (s.x < -10) s.x = w + 10;
        else if (s.x > w + 10) s.x = -10;
        if (s.y < -10) s.y = h + 10;
        else if (s.y > h + 10) s.y = -10;

        // Draw spark with breath
        const breath = 0.55 + 0.45 * (0.5 + 0.5 * Math.sin(s.phase));
        if (glow) {
          ctx.shadowColor = color;
          ctx.shadowBlur = 8 * breath;
        }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * breath, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // Connecting lines
      for (let i = 0; i < sparks.length; i++) {
        for (let j = i + 1; j < sparks.length; j++) {
          const a = sparks[i];
          const b = sparks[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < maxDistance * maxDistance) {
            const d = Math.sqrt(d2);
            const alpha = (1 - d / maxDistance) * 0.5;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(${lineColor},${alpha.toFixed(3)})`;
            ctx.lineWidth = 0.7;
            ctx.stroke();
          }
        }
      }

      rafRef.current = requestAnimationFrame(tick);
    }

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseleave", onLeave);
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [density, maxDistance, speed, color, lineColor, glow, attractMouse, fade]);

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      aria-hidden
    />
  );
}
