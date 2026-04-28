"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { generateLitIndices, MOCK_SUBMISSIONS } from "@/lib/mockData";

const COLS = 250;
const ROWS = 200;
const TOTAL = COLS * ROWS;
const DOT   = 3;
const GAP   = 1;
const CELL  = DOT + GAP;

const CX = COLS / 2;
const CY = ROWS / 2;

const MIN_ZOOM = 1;
const MAX_ZOOM = 12;

interface Tooltip {
  x: number; y: number;
  name: string; challenge: string;
  visible: boolean;
}

interface PuzzleGridProps {
  newLitIndex?: number | null;
  litCount: number;
}

const submissionMap = new Map(
  MOCK_SUBMISSIONS.map((s) => [
    s.puzzle_index,
    { name: s.name, challenge: s.challenge_title ?? "" },
  ])
);

function dist(idx: number) {
  const col = idx % COLS;
  const row = Math.floor(idx / COLS);
  return Math.sqrt((col - CX) ** 2 + (row - CY) ** 2);
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

export default function PuzzleGrid({ newLitIndex, litCount }: PuzzleGridProps) {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const wrapRef    = useRef<HTMLDivElement>(null);
  const litRef     = useRef<Set<number>>(new Set());
  const animRef    = useRef<Map<number, number>>(new Map());
  const rafRef     = useRef<number>(0);
  const isMobRef   = useRef(false);

  // Zoom/pan state in refs for perf (avoid re-renders during drag)
  const zoomRef    = useRef(1);
  const panRef     = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart  = useRef({ x: 0, y: 0, px: 0, py: 0 });

  // Pinch state
  const pinchRef   = useRef<{ dist: number; cx: number; cy: number } | null>(null);

  const [tooltip, setTooltip] = useState<Tooltip>({
    x: 0, y: 0, name: "", challenge: "", visible: false,
  });
  const [tapLabel, setTapLabel] = useState<{ name: string; challenge: string; x: number; y: number } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // ── Clamp pan so canvas never drifts too far ────────────────────────
  function clampPan(zoom: number, px: number, py: number) {
    const canvas = canvasRef.current;
    const wrap   = wrapRef.current;
    if (!canvas || !wrap) return { x: px, y: py };
    const cw = canvas.width;
    const ch = canvas.height;
    const dw = wrap.clientWidth;
    const dh = wrap.clientHeight || (dw * ch / cw);
    const scaledW = cw * zoom;
    const scaledH = ch * zoom;
    const minX = Math.min(0, dw - scaledW);
    const minY = Math.min(0, dh - scaledH);
    return {
      x: clamp(px, minX, 0),
      y: clamp(py, minY, 0),
    };
  }

  // ── Draw ────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mob  = isMobRef.current;
    const zoom = zoomRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Unlit dots — warm amber tint
    ctx.fillStyle = "rgba(180,120,20,0.13)";
    for (let i = 0; i < TOTAL; i++) {
      if (!litRef.current.has(i)) {
        ctx.fillRect((i % COLS) * CELL, Math.floor(i / COLS) * CELL, DOT, DOT);
      }
    }

    // Lit dots
    let stillAnimating = false;
    for (const idx of litRef.current) {
      const col = idx % COLS;
      const row = Math.floor(idx / COLS);
      const x   = col * CELL;
      const y   = row * CELL;

      let alpha = animRef.current.get(idx) ?? 1;
      if (alpha < 1) {
        alpha = Math.min(1, alpha + 0.05);
        animRef.current.set(idx, alpha);
        stillAnimating = true;
      }

      if (!mob) {
        const blurAmount = Math.min(14, 5 + (zoom - 1) * 2) * alpha;
        ctx.shadowColor = `rgba(251,191,36,${alpha * 0.9})`;
        ctx.shadowBlur  = blurAmount;
      }
      ctx.fillStyle = `rgba(251,191,${Math.round(36 * alpha)},${alpha})`;
      ctx.fillRect(x, y, DOT, DOT);
      if (!mob) ctx.shadowBlur = 0;

      // At high zoom, draw name label if in submissionMap
      if (zoom >= 5 && submissionMap.has(idx)) {
        const info = submissionMap.get(idx)!;
        ctx.font = `${Math.round(DOT * 0.9)}px Assistant,Arial,sans-serif`;
        ctx.fillStyle = "rgba(251,230,150,0.9)";
        ctx.textAlign = "center";
        ctx.fillText(info.name, x + DOT / 2, y - 1.5);
      }
    }

    if (stillAnimating) rafRef.current = requestAnimationFrame(draw);
  }, []);

  // ── Apply zoom/pan transform to container ───────────────────────────
  const applyTransform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const zoom = zoomRef.current;
    const pan  = panRef.current;
    canvas.style.transform = `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`;
    canvas.style.transformOrigin = "0 0";
  }, []);

  // ── Wave animation on mount ─────────────────────────────────────────
  useEffect(() => {
    isMobRef.current = window.innerWidth < 768;

    const allLit = generateLitIndices(litCount);
    const sorted = [...allLit].sort((a, b) => dist(a) - dist(b));
    const maxDist = dist(sorted[sorted.length - 1] ?? 0);
    const WAVE_MS = 1600;
    const started = Date.now();

    function animateWave() {
      const progress  = Math.min((Date.now() - started) / WAVE_MS, 1);
      const eased     = 1 - (1 - progress) ** 3;
      const threshold = eased * maxDist;
      litRef.current = new Set(sorted.filter((idx) => dist(idx) <= threshold));
      draw();
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animateWave);
      } else {
        litRef.current = allLit;
        draw();
      }
    }

    rafRef.current = requestAnimationFrame(animateWave);
    return () => cancelAnimationFrame(rafRef.current);
  }, [litCount, draw]);

  // ── New submission dot ───────────────────────────────────────────────
  useEffect(() => {
    if (newLitIndex == null) return;
    litRef.current.add(newLitIndex);
    animRef.current.set(newLitIndex, 0);
    rafRef.current = requestAnimationFrame(draw);
  }, [newLitIndex, draw]);

  // ── Scroll-to-zoom (desktop) ────────────────────────────────────────
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    function onWheel(e: WheelEvent) {
      // Only zoom when Ctrl/Cmd held — otherwise let the page scroll normally
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const rect  = wrap!.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const prevZoom = zoomRef.current;
      const delta    = e.deltaY > 0 ? 0.85 : 1.18;
      const newZoom  = clamp(prevZoom * delta, MIN_ZOOM, MAX_ZOOM);
      const ratio    = newZoom / prevZoom;

      panRef.current = clampPan(newZoom,
        mouseX - ratio * (mouseX - panRef.current.x),
        mouseY - ratio * (mouseY - panRef.current.y),
      );
      zoomRef.current = newZoom;
      applyTransform();
      setZoomLevel(Math.round(newZoom * 10) / 10);
    }

    wrap.addEventListener("wheel", onWheel, { passive: false });
    return () => wrap.removeEventListener("wheel", onWheel);
  }, [applyTransform]);

  // ── Mouse drag (desktop pan) ────────────────────────────────────────
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoomRef.current <= 1) return;
    isDragging.current = true;
    dragStart.current = { x: e.clientX, y: e.clientY, px: panRef.current.x, py: panRef.current.y };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging.current) {
      const dx = e.clientX - dragStart.current.x;
      const dy = e.clientY - dragStart.current.y;
      panRef.current = clampPan(zoomRef.current,
        dragStart.current.px + dx,
        dragStart.current.py + dy,
      );
      applyTransform();
      return;
    }

    // Tooltip hit-test
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect  = canvas.getBoundingClientRect();
    const zoom  = zoomRef.current;
    const pan   = panRef.current;
    const relX  = (e.clientX - rect.left - pan.x) / zoom;
    const relY  = (e.clientY - rect.top  - pan.y) / zoom;
    const col   = Math.floor(relX / CELL);
    const row   = Math.floor(relY / CELL);
    const idx   = row * COLS + col;

    if (litRef.current.has(idx) && submissionMap.has(idx)) {
      const m = submissionMap.get(idx)!;
      setTooltip({ x: e.clientX, y: e.clientY, name: m.name, challenge: m.challenge, visible: true });
    } else {
      setTooltip((t) => ({ ...t, visible: false }));
    }
  }, [applyTransform]);

  const handleMouseUp = useCallback(() => { isDragging.current = false; }, []);

  // ── Touch gestures (mobile) ─────────────────────────────────────────
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const t0 = e.touches[0];
      const t1 = e.touches[1];
      const d  = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
      const cx = (t0.clientX + t1.clientX) / 2;
      const cy = (t0.clientY + t1.clientY) / 2;
      pinchRef.current = { dist: d, cx, cy };
    } else if (e.touches.length === 1 && zoomRef.current > 1) {
      const t = e.touches[0];
      isDragging.current = true;
      dragStart.current = { x: t.clientX, y: t.clientY, px: panRef.current.x, py: panRef.current.y };
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 2 && pinchRef.current) {
      const t0 = e.touches[0];
      const t1 = e.touches[1];
      const d  = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
      const cx = (t0.clientX + t1.clientX) / 2;
      const cy = (t0.clientY + t1.clientY) / 2;
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect = wrap.getBoundingClientRect();

      const scale   = d / pinchRef.current.dist;
      const prevZoom = zoomRef.current;
      const newZoom  = clamp(prevZoom * scale, MIN_ZOOM, MAX_ZOOM);
      const ratio    = newZoom / prevZoom;
      const localX   = cx - rect.left;
      const localY   = cy - rect.top;

      panRef.current = clampPan(newZoom,
        localX - ratio * (localX - panRef.current.x),
        localY - ratio * (localY - panRef.current.y),
      );
      zoomRef.current  = newZoom;
      pinchRef.current = { dist: d, cx, cy };
      applyTransform();
      setZoomLevel(Math.round(newZoom * 10) / 10);
    } else if (e.touches.length === 1 && isDragging.current) {
      const t  = e.touches[0];
      const dx = t.clientX - dragStart.current.x;
      const dy = t.clientY - dragStart.current.y;
      panRef.current = clampPan(zoomRef.current,
        dragStart.current.px + dx,
        dragStart.current.py + dy,
      );
      applyTransform();
    }
  }, [applyTransform]);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length < 2) pinchRef.current = null;
    if (e.touches.length === 0) isDragging.current = false;

    // Tap to show info (single tap, no drag)
    if (e.changedTouches.length === 1 && !isDragging.current) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const touch = e.changedTouches[0];
      const rect  = canvas.getBoundingClientRect();
      const zoom  = zoomRef.current;
      const pan   = panRef.current;
      const relX  = (touch.clientX - rect.left - pan.x) / zoom;
      const relY  = (touch.clientY - rect.top  - pan.y) / zoom;
      const col   = Math.floor(relX / CELL);
      const row   = Math.floor(relY / CELL);
      const idx   = row * COLS + col;

      if (litRef.current.has(idx) && submissionMap.has(idx)) {
        const m = submissionMap.get(idx)!;
        setTapLabel({ name: m.name, challenge: m.challenge, x: touch.clientX, y: touch.clientY });
        setTimeout(() => setTapLabel(null), 2500);
      }
    }
  }, []);

  // ── Reset zoom on double-click/double-tap ───────────────────────────
  const handleDoubleClick = useCallback(() => {
    zoomRef.current = 1;
    panRef.current  = { x: 0, y: 0 };
    applyTransform();
    setZoomLevel(1);
  }, [applyTransform]);

  return (
    <div className="relative flex flex-col items-center">
      {/* Zoom indicator */}
      {zoomLevel > 1.1 && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-black/70 text-yellow-400 text-xs px-3 py-1 rounded-full border border-yellow-400/20 pointer-events-none">
          ×{zoomLevel.toFixed(1)} — לחץ פעמיים לאיפוס | גרור להזזה
        </div>
      )}

      <div
        ref={wrapRef}
        className="relative w-full overflow-hidden select-none"
        style={{ cursor: zoomRef.current > 1 ? "grab" : "default" }}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => { handleMouseUp(); setTooltip((t) => ({ ...t, visible: false })); }}
      >
        <canvas
          ref={canvasRef}
          width={COLS * CELL}
          height={ROWS * CELL}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onDoubleClick={handleDoubleClick}
          className="w-full h-auto touch-manipulation"
          style={{ imageRendering: "pixelated", willChange: "transform", transition: "transform 0.05s linear" }}
        />
      </div>

      {/* Hint */}
      <p className="text-yellow-400/30 text-xs mt-2 select-none">
        {isMobRef.current ? "צבט להגדלה • לחץ על אור לפרטים" : "Ctrl + גלגלת להגדלה • לחץ פעמיים לאיפוס • לחץ על אור לפרטים"}
      </p>

      {/* Desktop tooltip */}
      {tooltip.visible && (
        <div
          className="fixed z-50 pointer-events-none hidden sm:block rounded-xl px-3 py-2 text-sm shadow-xl"
          style={{ left: tooltip.x + 14, top: tooltip.y - 44, background: "rgba(20,12,0,0.95)", border: "1px solid rgba(251,191,36,0.35)", boxShadow: "0 0 20px rgba(251,191,36,0.2)" }}
        >
          <div className="text-yellow-400 font-semibold">{tooltip.name}</div>
          <div className="text-amber-200/60 text-xs mt-0.5">{tooltip.challenge}</div>
        </div>
      )}

      {/* Mobile tap tooltip */}
      {tapLabel && (
        <div
          className="fixed z-50 pointer-events-none sm:hidden rounded-xl px-4 py-2.5 shadow-xl text-center"
          style={{
            left: Math.min(tapLabel.x - 60, (typeof window !== "undefined" ? window.innerWidth : 400) - 160),
            top: tapLabel.y - 70,
            background: "rgba(20,12,0,0.95)",
            border: "1px solid rgba(251,191,36,0.35)",
            boxShadow: "0 0 20px rgba(251,191,36,0.2)",
          }}
        >
          <div className="text-yellow-400 font-semibold text-sm">{tapLabel.name}</div>
          <div className="text-amber-200/60 text-xs mt-0.5">{tapLabel.challenge}</div>
        </div>
      )}
    </div>
  );
}
