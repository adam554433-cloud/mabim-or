"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
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

// 3 demo dots — in the top portion of the grid (rows 20-85) so they're always visible
const DEMO_DOTS = [
  { idx: 20 * 250 + 55,  name: "יוסי לוי",  challenge: "קנה לשכן קניות היום"   }, // row 20, col 55
  { idx: 45 * 250 + 180, name: "מרים כהן",  challenge: "תגיד מילה טובה לאדם זר" }, // row 45, col 180
  { idx: 75 * 250 + 110, name: "דוד אברהם", challenge: "עזור למישהו שצריך עזרה" }, // row 75, col 110
];

interface DemoPopup {
  screenX: number;
  screenY: number;
  name: string;
  challenge: string;
}

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
  const demoRingRef  = useRef<{ idx: number; rings: number[] } | null>(null);
  const demoReadyRef = useRef(false); // wave done?
  const demoRanRef   = useRef(false); // demo already played?

  const zoomRef    = useRef(1);
  const panRef     = useRef({ x: 0, y: 0 });
  const isDragging = useRef(false);
  const dragStart  = useRef({ x: 0, y: 0, px: 0, py: 0 });
  const pinchRef   = useRef<{ dist: number; cx: number; cy: number } | null>(null);

  const [tooltip, setTooltip] = useState<Tooltip>({ x: 0, y: 0, name: "", challenge: "", visible: false });
  const [tapLabel, setTapLabel] = useState<{ name: string; challenge: string; x: number; y: number } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [demoPopup, setDemoPopup] = useState<DemoPopup | null>(null);
  const [showHint, setShowHint] = useState(false);

  // ── clampPan ──────────────────────────────────────────────────────────
  function clampPan(zoom: number, px: number, py: number) {
    const canvas = canvasRef.current;
    const wrap   = wrapRef.current;
    if (!canvas || !wrap) return { x: px, y: py };
    const dw = wrap.clientWidth;
    const dh = wrap.clientHeight || (dw * canvas.height / canvas.width);
    return {
      x: clamp(px, Math.min(0, dw - canvas.width * zoom), 0),
      y: clamp(py, Math.min(0, dh - canvas.height * zoom), 0),
    };
  }

  // ── Draw ──────────────────────────────────────────────────────────────
  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const mob = isMobRef.current;

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
        alpha = Math.min(1, alpha + 0.03);
        animRef.current.set(idx, alpha);
        stillAnimating = true;
      }

      ctx.shadowColor = `rgba(251,191,36,${alpha * (mob ? 0.5 : 0.9)})`;
      ctx.shadowBlur  = mob
        ? 5 * alpha
        : Math.min(14, 5 + (zoomRef.current - 1) * 2) * alpha;
      ctx.fillStyle = `rgba(251,191,${Math.round(36 * alpha)},${alpha})`;
      ctx.fillRect(x, y, DOT, DOT);
      ctx.shadowBlur = 0;

      // Name labels at high zoom
      if (zoomRef.current >= 5 && submissionMap.has(idx)) {
        const info = submissionMap.get(idx)!;
        ctx.font = `${Math.round(DOT * 0.9)}px Assistant,Arial,sans-serif`;
        ctx.fillStyle = "rgba(251,230,150,0.9)";
        ctx.textAlign = "center";
        ctx.fillText(info.name, x + DOT / 2, y - 1.5);
      }
    }

    // Demo pulsing rings — multiple concentric ripples
    if (demoRingRef.current) {
      const { idx, rings } = demoRingRef.current;
      const col = idx % COLS;
      const row = Math.floor(idx / COLS);
      const cx  = col * CELL + DOT / 2;
      const cy  = row * CELL + DOT / 2;

      for (const p of rings) {
        const r     = 4 + p * 22;
        const alpha = (1 - p) * 0.7;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(251,191,36,${alpha})`;
        ctx.lineWidth   = 1.2 + (1 - p) * 1;
        ctx.stroke();
      }
      // Bright glowing center dot
      ctx.shadowColor = "rgba(251,191,36,1)";
      ctx.shadowBlur  = 14;
      ctx.fillStyle   = "#fbbf24";
      ctx.fillRect(col * CELL, row * CELL, DOT, DOT);
      ctx.shadowBlur  = 0;

      // Advance each ring, spawn new one every 0.35 cycle
      demoRingRef.current.rings = rings
        .map(p => p + 0.012)
        .filter(p => p < 1);
      if (rings.length === 0 || rings[rings.length - 1] > 0.35)
        demoRingRef.current.rings.push(0);

      stillAnimating = true;
    }

    if (stillAnimating) rafRef.current = requestAnimationFrame(draw);
  }, []);

  // ── Convert canvas index → coords relative to wrapRef ───────────────
  const idxToLocal = useCallback((idx: number) => {
    const wrap = wrapRef.current;
    if (!wrap) return { x: 0, y: 0 };
    const scale = wrap.clientWidth / (COLS * CELL);
    const col   = idx % COLS;
    const row   = Math.floor(idx / COLS);
    return {
      x: col * CELL * scale,
      y: row * CELL * scale,
    };
  }, []);

  // ── Demo sequence after wave ──────────────────────────────────────────
  const runDemo = useCallback(() => {
    let step = 0;

    function showNext() {
      if (step >= DEMO_DOTS.length) {
        demoRingRef.current = null;
        setDemoPopup(null);
        setShowHint(true);
        setTimeout(() => setShowHint(false), 3000);
        return;
      }
      const dot = DEMO_DOTS[step];
      demoRingRef.current = { idx: dot.idx, rings: [0] };
      rafRef.current = requestAnimationFrame(draw);

      const pos = idxToLocal(dot.idx);
      setDemoPopup({ screenX: pos.x, screenY: pos.y, name: dot.name, challenge: dot.challenge });

      step++;
      setTimeout(() => {
        setDemoPopup(null);
        demoRingRef.current = null;
        setTimeout(showNext, 1200);
      }, 5000);
    }

    showNext();
  }, [draw, idxToLocal]);

  // ── Wave animation on mount ───────────────────────────────────────────
  useEffect(() => {
    isMobRef.current = window.innerWidth < 768;

    const allLit = generateLitIndices(litCount);
    // Add demo dots to lit set so they're visible
    DEMO_DOTS.forEach((d) => allLit.add(d.idx));

    const sorted = [...allLit].sort((a, b) => dist(a) - dist(b));
    const maxDist = dist(sorted[sorted.length - 1] ?? 0);
    const WAVE_MS = isMobRef.current ? 2800 : 1600;
    const started = Date.now();

    function animateWave() {
      const progress  = Math.min((Date.now() - started) / WAVE_MS, 1);
      const eased     = 1 - (1 - progress) ** 3;
      litRef.current  = new Set(sorted.filter((idx) => dist(idx) <= eased * maxDist));
      draw();
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animateWave);
      } else {
        litRef.current = allLit;
        draw();
        demoReadyRef.current = true;
        // If canvas already visible (e.g. navigated from another page), run demo now
        const canvas = canvasRef.current;
        if (canvas && !demoRanRef.current) {
          const rect = canvas.getBoundingClientRect();
          const visible = rect.top < window.innerHeight && rect.bottom > 0;
          if (visible) {
            demoRanRef.current = true;
            setTimeout(runDemo, 600);
          }
        }
      }
    }

    rafRef.current = requestAnimationFrame(animateWave);
    return () => cancelAnimationFrame(rafRef.current);
  }, [litCount, draw]);

  // ── Trigger demo when canvas scrolls into view ────────────────────
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && demoReadyRef.current && !demoRanRef.current) {
          demoRanRef.current = true;
          observer.disconnect();
          setTimeout(runDemo, 600);
        }
      },
      { threshold: 0.4 }
    );
    observer.observe(canvas);
    return () => observer.disconnect();
  }, [runDemo]);

  // ── New submission dot ────────────────────────────────────────────────
  useEffect(() => {
    if (newLitIndex == null) return;
    litRef.current.add(newLitIndex);
    animRef.current.set(newLitIndex, 0);
    rafRef.current = requestAnimationFrame(draw);
  }, [newLitIndex, draw]);

  // ── applyTransform ────────────────────────────────────────────────────
  const applyTransform = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.style.transform = `translate(${panRef.current.x}px, ${panRef.current.y}px) scale(${zoomRef.current})`;
    canvas.style.transformOrigin = "0 0";
  }, []);

  // ── Scroll-to-zoom (Ctrl+wheel) ───────────────────────────────────────
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    function onWheel(e: WheelEvent) {
      if (!e.ctrlKey && !e.metaKey) return;
      e.preventDefault();
      const rect   = wrap!.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      const prev   = zoomRef.current;
      const next   = clamp(prev * (e.deltaY > 0 ? 0.85 : 1.18), MIN_ZOOM, MAX_ZOOM);
      const ratio  = next / prev;
      panRef.current  = clampPan(next, mouseX - ratio * (mouseX - panRef.current.x), mouseY - ratio * (mouseY - panRef.current.y));
      zoomRef.current = next;
      applyTransform();
      setZoomLevel(Math.round(next * 10) / 10);
    }
    wrap.addEventListener("wheel", onWheel, { passive: false });
    return () => wrap.removeEventListener("wheel", onWheel);
  }, [applyTransform]);

  // ── Mouse drag ────────────────────────────────────────────────────────
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoomRef.current <= 1) return;
    isDragging.current = true;
    dragStart.current  = { x: e.clientX, y: e.clientY, px: panRef.current.x, py: panRef.current.y };
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isDragging.current) {
      panRef.current = clampPan(zoomRef.current,
        dragStart.current.px + e.clientX - dragStart.current.x,
        dragStart.current.py + e.clientY - dragStart.current.y,
      );
      applyTransform();
      return;
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scale = canvas.width / rect.width;
    const col  = Math.floor(((e.clientX - rect.left)) * scale / CELL);
    const row  = Math.floor(((e.clientY - rect.top))  * scale / CELL);
    const idx  = row * COLS + col;
    if (litRef.current.has(idx) && submissionMap.has(idx)) {
      const m = submissionMap.get(idx)!;
      setTooltip({ x: e.clientX, y: e.clientY, name: m.name, challenge: m.challenge, visible: true });
    } else {
      setTooltip((t) => ({ ...t, visible: false }));
    }
  }, [applyTransform]);

  const handleMouseUp = useCallback(() => { isDragging.current = false; }, []);

  // ── Touch gestures ────────────────────────────────────────────────────
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const t0 = e.touches[0], t1 = e.touches[1];
      pinchRef.current = {
        dist: Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY),
        cx: (t0.clientX + t1.clientX) / 2,
        cy: (t0.clientY + t1.clientY) / 2,
      };
    } else if (e.touches.length === 1 && zoomRef.current > 1) {
      isDragging.current = true;
      dragStart.current  = { x: e.touches[0].clientX, y: e.touches[0].clientY, px: panRef.current.x, py: panRef.current.y };
    }
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    if (e.touches.length === 2 && pinchRef.current) {
      const t0 = e.touches[0], t1 = e.touches[1];
      const d  = Math.hypot(t1.clientX - t0.clientX, t1.clientY - t0.clientY);
      const cx = (t0.clientX + t1.clientX) / 2;
      const cy = (t0.clientY + t1.clientY) / 2;
      const wrap = wrapRef.current;
      if (!wrap) return;
      const rect  = wrap.getBoundingClientRect();
      const prev  = zoomRef.current;
      const next  = clamp(prev * d / pinchRef.current.dist, MIN_ZOOM, MAX_ZOOM);
      const ratio = next / prev;
      const lx    = cx - rect.left;
      const ly    = cy - rect.top;
      panRef.current  = clampPan(next, lx - ratio * (lx - panRef.current.x), ly - ratio * (ly - panRef.current.y));
      zoomRef.current = next;
      pinchRef.current = { dist: d, cx, cy };
      applyTransform();
      setZoomLevel(Math.round(next * 10) / 10);
    } else if (e.touches.length === 1 && isDragging.current) {
      const t = e.touches[0];
      panRef.current = clampPan(zoomRef.current,
        dragStart.current.px + t.clientX - dragStart.current.x,
        dragStart.current.py + t.clientY - dragStart.current.y,
      );
      applyTransform();
    }
  }, [applyTransform]);

  const handleTouchEnd = useCallback((e: React.TouchEvent<HTMLCanvasElement>) => {
    if (e.touches.length < 2) pinchRef.current = null;
    if (e.touches.length === 0) isDragging.current = false;

    if (e.changedTouches.length === 1) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const touch = e.changedTouches[0];
      const rect  = canvas.getBoundingClientRect();
      const scale = canvas.width / rect.width;
      const col   = Math.floor((touch.clientX - rect.left) * scale / CELL);
      const row   = Math.floor((touch.clientY - rect.top)  * scale / CELL);
      const idx   = row * COLS + col;
      if (litRef.current.has(idx) && submissionMap.has(idx)) {
        const m = submissionMap.get(idx)!;
        setTapLabel({ name: m.name, challenge: m.challenge, x: touch.clientX, y: touch.clientY });
        setTimeout(() => setTapLabel(null), 2500);
      }
    }
  }, []);

  const handleDoubleClick = useCallback(() => {
    zoomRef.current = 1;
    panRef.current  = { x: 0, y: 0 };
    applyTransform();
    setZoomLevel(1);
  }, [applyTransform]);

  // ── Popup position relative to wrapRef ───────────────────────────────
  function popupStyle(localX: number, localY: number) {
    const mob  = isMobRef.current;
    const w    = mob ? 170 : 210;
    const wrapW = wrapRef.current?.clientWidth ?? 400;
    const wrapH = wrapRef.current?.clientHeight ?? 300;
    const left  = clamp(localX - w / 2, 8, wrapW - w - 8);
    const top   = localY > wrapH * 0.55 ? localY - (mob ? 105 : 122) : localY + 12;
    return { left, top, width: w, position: "absolute" as const };
  }

  return (
    <div className="relative flex flex-col items-center">
      {/* Zoom indicator */}
      {zoomLevel > 1.1 && (
        <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-black/70 text-yellow-400 text-xs px-3 py-1 rounded-full border border-yellow-400/20 pointer-events-none select-none">
          ×{zoomLevel.toFixed(1)} — לחץ פעמיים לאיפוס
        </div>
      )}

      <div
        ref={wrapRef}
        className="relative w-full overflow-visible select-none"
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

      {/* Hint line */}
      <p className="text-yellow-400/30 text-xs mt-2 select-none">
        {isMobRef.current
          ? "צבט להגדלה • לחץ על אור לפרטים"
          : "Ctrl + גלגלת להגדלה • לחץ פעמיים לאיפוס • לחץ על אור לפרטים"}
      </p>

      {/* ── Demo popup (absolute inside wrapRef so it scrolls with page) ── */}
      <AnimatePresence>
        {demoPopup && (
          <motion.div
            key={demoPopup.name}
            initial={{ opacity: 0, y: 8, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1    }}
            exit={{   opacity: 0, y: -6, scale: 0.92 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="z-50 pointer-events-none"
            style={popupStyle(demoPopup.screenX, demoPopup.screenY)}
          >
            <div
              className="rounded-xl px-3 py-2.5 shadow-2xl"
              style={{
                background: "linear-gradient(135deg, #1e1200 0%, #110b00 100%)",
                border: "1px solid rgba(251,191,36,0.5)",
                boxShadow: "0 0 28px rgba(251,191,36,0.22), 0 8px 24px rgba(0,0,0,0.7)",
              }}
            >
              {/* What they did */}
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="text-yellow-400 text-[10px] font-bold tracking-wide">הדליק אור ✨</span>
              </div>
              <div
                className="text-white font-semibold leading-snug mb-2"
                style={{ fontSize: isMobRef.current ? 12 : 13 }}
              >
                {demoPopup.challenge}
              </div>
              {/* Who */}
              <div className="flex items-center gap-1.5 pt-1.5" style={{ borderTop: "1px solid rgba(251,191,36,0.12)" }}>
                <div className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold flex-shrink-0" style={{ fontSize: 9 }}>
                  {demoPopup.name[0]}
                </div>
                <span className="text-amber-200/80 text-[11px] font-medium">{demoPopup.name}</span>
                <span className="text-yellow-400/50 text-[10px] mr-auto">הדליק אור ✨</span>
              </div>
            </div>
            {/* Arrow */}
            <div
              className="mx-auto mt-[-1px]"
              style={{
                width: 0, height: 0,
                borderLeft: "7px solid transparent",
                borderRight: "7px solid transparent",
                borderTop: "7px solid rgba(251,191,36,0.5)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* "לחץ על כל אור" hint after demo */}
      <AnimatePresence>
        {showHint && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{   opacity: 0, y: -4 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 pointer-events-none bg-black/80 text-yellow-400 text-sm px-5 py-2.5 rounded-full border border-yellow-400/25 shadow-xl select-none"
          >
            לחץ על כל אור לפרטים ✨
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop hover tooltip */}
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
