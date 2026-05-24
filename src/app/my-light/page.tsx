"use client";

import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, Suspense } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";

// ── Mini Puzzle Canvas ───────────────────────────────────────────────
const COLS = 250;
const DOT  = 3;
const GAP  = 1;
const CELL = DOT + GAP;

function MiniPuzzle({ myIndex }: { myIndex: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef    = useRef<number>(0);
  const pulseRef  = useRef(0);

  // Show a 40×32 window around the user's dot
  const WIN_COLS = 40;
  const WIN_ROWS = 32;
  const myCol = myIndex % COLS;
  const myRow = Math.floor(myIndex / COLS);
  const startCol = Math.max(0, myCol - WIN_COLS / 2);
  const startRow = Math.max(0, myRow - WIN_ROWS / 2);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Generate some lit dots around the user's dot for context
    const litSet = new Set<number>();
    let seed = 99;
    for (let i = 0; i < 120; i++) {
      seed = (seed * 1664525 + 1013904223) & 0xffffffff;
      const col = startCol + (Math.abs(seed) % WIN_COLS);
      const row = startRow + (Math.abs(seed >> 10) % WIN_ROWS);
      litSet.add(row * COLS + col);
    }
    litSet.add(myIndex);

    function draw() {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let r = 0; r < WIN_ROWS; r++) {
        for (let c = 0; c < WIN_COLS; c++) {
          const idx = (startRow + r) * COLS + (startCol + c);
          const x   = c * CELL;
          const y   = r * CELL;
          if (litSet.has(idx)) {
            const isMe = idx === myIndex;
            if (isMe) {
              // Pulsing ring
              const pulse = pulseRef.current;
              const ringR = 5 + pulse * 8;
              const ringA = (1 - pulse) * 0.9;
              ctx.beginPath();
              ctx.arc(x + DOT / 2, y + DOT / 2, ringR, 0, Math.PI * 2);
              ctx.strokeStyle = `rgba(251,191,36,${ringA})`;
              ctx.lineWidth   = 1.5;
              ctx.stroke();
              ctx.shadowColor = "rgba(251,191,36,1)";
              ctx.shadowBlur  = 12;
              ctx.fillStyle   = "#fbbf24";
            } else {
              ctx.shadowColor = "rgba(251,191,36,0.5)";
              ctx.shadowBlur  = 4;
              ctx.fillStyle   = "rgba(251,191,36,0.75)";
            }
            ctx.fillRect(x, y, DOT, DOT);
            ctx.shadowBlur = 0;
          } else {
            ctx.fillStyle = "rgba(180,120,20,0.12)";
            ctx.fillRect(x, y, DOT, DOT);
          }
        }
      }

      pulseRef.current = (pulseRef.current + 0.02) % 1;
      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [myIndex, startCol, startRow]);

  return (
    <canvas
      ref={canvasRef}
      width={WIN_COLS * CELL}
      height={WIN_ROWS * CELL}
      className="w-full h-auto rounded-xl"
      style={{ imageRendering: "pixelated", maxWidth: 260 }}
    />
  );
}

// ── Reactions ────────────────────────────────────────────────────────
const REACTIONS = [
  { from: "מרים כהן",   avatar: "מ", color: "bg-orange-400", text: "כל הכבוד! זה מרגש מאוד 💛",     delay: 0.1 },
  { from: "יוסי לוי",   avatar: "י", color: "bg-yellow-400", text: "אתה מאיר את העולם, תודה! ✨",  delay: 0.3 },
  { from: "רחל שמש",    avatar: "ר", color: "bg-amber-500",  text: "השכן שלך בטח שמח מאוד ❤️",     delay: 0.5 },
];

const BADGES = [
  { icon: "🔥", label: "מאיר שבוע ראשון", unlocked: true  },
  { icon: "⭐", label: "מאיר חודש",        unlocked: false },
  { icon: "💎", label: "מאיר שנה",         unlocked: false },
];

// ── Main Page ────────────────────────────────────────────────────────
function MyLightContent() {
  const params = useSearchParams();
  const idxStr = params.get("idx");
  const lightNum = params.get("num");

  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [copied, setCopied] = useState(false);
  const [showReactions, setShowReactions] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShowReactions(true), 600);
    return () => clearTimeout(t);
  }, []);

  const isGuest = user === null;
  const displayName = user?.user_metadata?.display_name ?? params.get("name");
  const name = isGuest ? "האור שלך" : (displayName ?? "חבר");
  const myIndex  = idxStr ? parseInt(idxStr) : 25125;
  const myNum    = lightNum ? parseInt(lightNum) : 1248;

  function share() {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <main
      className={`min-h-screen ${isGuest ? "pb-36" : "pb-16"}`}
      style={{ background: "radial-gradient(ellipse 140% 55% at 50% -5%, #1e1000 0%, #0a0700 55%)" }}
    >
      {/* Nav */}
      <nav className="flex items-center justify-between px-5 py-4 border-b border-yellow-400/10" style={{ background: "rgba(10,7,0,0.85)" }}>
        <Link href="/" className="text-gray-500 hover:text-yellow-400 transition-colors text-sm">
          → חזרה לדף הבית
        </Link>
        <span className="text-yellow-400 font-bold text-sm">✨ ניצוצות</span>
      </nav>

      <div className="max-w-md mx-auto px-5 pt-10 space-y-6">

        {/* ── Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <div className="text-5xl mb-3 candle-flicker">✨</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-1" style={{ textShadow: "0 0 40px rgba(251,191,36,.5)" }}>
            האור של {name}
          </h1>
          <p className="text-amber-200/60 text-sm">
            אור מספר{" "}
            <span className="text-yellow-400 font-bold">#{myNum.toLocaleString("he-IL")}</span>
            {" "}מתוך 50,000
          </p>
        </motion.div>

        {/* ── Mini Puzzle ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="rounded-2xl p-5 text-center"
          style={{ background: "linear-gradient(135deg,#160f00,#0d0800)", border: "1px solid rgba(251,191,36,0.2)", boxShadow: "0 0 40px rgba(251,191,36,0.07)" }}
        >
          <p className="text-xs text-amber-400/50 mb-3 font-semibold">הנקודה שלך בפאזל הגדול</p>
          <div className="flex justify-center">
            <MiniPuzzle myIndex={myIndex} />
          </div>
          <p className="text-xs text-amber-400/40 mt-3">הנקודה המסומנת היא שלך ✨</p>
        </motion.div>

        {/* ── Badges ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="rounded-2xl p-5"
          style={{ background: "linear-gradient(135deg,#160f00,#0d0800)", border: "1px solid rgba(251,191,36,0.2)" }}
        >
          <p className="text-xs text-amber-400/50 font-semibold mb-4">ההישגים שלך</p>
          <div className="flex gap-3">
            {BADGES.map((b, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1, type: "spring", stiffness: 260 }}
                className={`flex-1 rounded-xl p-3 text-center ${b.unlocked ? "border border-yellow-400/40" : "border border-white/5 opacity-35"}`}
                style={b.unlocked ? { background: "rgba(251,191,36,0.08)", boxShadow: "0 0 16px rgba(251,191,36,0.12)" } : { background: "rgba(255,255,255,0.03)" }}
              >
                <div className="text-2xl mb-1">{b.icon}</div>
                <div className={`text-[10px] leading-tight ${b.unlocked ? "text-yellow-400" : "text-gray-600"}`}>{b.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ── Streak ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="flex items-center gap-4 rounded-2xl px-5 py-4"
          style={{ background: "linear-gradient(135deg,#160f00,#0d0800)", border: "1px solid rgba(251,191,36,0.2)" }}
        >
          <div className="text-4xl">🔥</div>
          <div>
            <div className="text-white font-bold text-lg">7 ימים ברצף</div>
            <div className="text-amber-400/50 text-xs">שמור על האש — אתגר השבוע הבא מחכה</div>
          </div>
          <div className="mr-auto text-right">
            <div className="text-yellow-400 font-extrabold text-2xl">1</div>
            <div className="text-amber-400/40 text-xs">אתגרים</div>
          </div>
        </motion.div>

        {/* ── Reactions ── */}
        <div>
          <p className="text-xs text-amber-400/50 font-semibold mb-3 px-1">מה אמרו עליך 💬</p>
          <div className="space-y-2.5">
            <AnimatePresence>
              {showReactions && REACTIONS.map((r, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: r.delay, duration: 0.4 }}
                  className="flex items-start gap-3 rounded-2xl px-4 py-3"
                  style={{ background: "linear-gradient(135deg,#160f00,#0d0800)", border: "1px solid rgba(251,191,36,0.15)" }}
                >
                  <div className={`w-8 h-8 rounded-full ${r.color} flex-shrink-0 flex items-center justify-center text-black font-bold text-sm mt-0.5`}>
                    {r.avatar}
                  </div>
                  <div>
                    <span className="text-white text-sm font-medium">{r.from} </span>
                    <span className="text-amber-200/70 text-sm">{r.text}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Share (logged in only) ── */}
        {!isGuest && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-col gap-3 pt-2"
          >
            <button
              onClick={share}
              className="w-full font-bold py-4 rounded-full text-base transition-all hover:scale-105"
              style={{
                background: copied ? "rgba(251,191,36,0.2)" : "rgba(251,191,36,1)",
                color: copied ? "#fbbf24" : "#000",
                border: copied ? "1px solid rgba(251,191,36,0.4)" : "none",
                boxShadow: copied ? "none" : "0 0 24px rgba(251,191,36,0.4)",
              }}
            >
              {copied ? "הלינק הועתק ✓" : "שתף את האור שלי ✨"}
            </button>
            <Link
              href="/"
              className="w-full text-center text-amber-400/50 hover:text-yellow-400 transition-colors text-sm py-2"
            >
              → חזרה לדף הבית
            </Link>
          </motion.div>
        )}

      </div>

      {/* ── Guest sticky CTA ── */}
      {isGuest && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-4"
          style={{ background: "linear-gradient(to top, #0a0700 60%, transparent)" }}
        >
          <div
            className="max-w-md mx-auto rounded-2xl p-5 text-center"
            style={{ background: "linear-gradient(135deg,#1e1200,#0d0800)", border: "1px solid rgba(251,191,36,0.35)", boxShadow: "0 0 40px rgba(251,191,36,0.18)" }}
          >
            <p className="text-white font-bold text-base mb-1">רוצה לראות את האור <span className="text-yellow-400">האמיתי</span> שלך?</p>
            <p className="text-amber-200/50 text-xs mb-4">הצטרף לקהילה, השלם אתגר — וקבל נקודה משלך בפאזל</p>
            <div className="flex gap-3">
              <Link
                href="/login"
                className="flex-1 font-bold py-3 rounded-full text-base text-center transition-all hover:scale-105"
                style={{ background: "#fbbf24", color: "#000", boxShadow: "0 0 20px rgba(251,191,36,0.4)" }}
              >
                הדלק את האור שלי ✨
              </Link>
              <Link
                href="/"
                className="px-4 py-3 rounded-full text-amber-400/60 hover:text-yellow-400 transition-colors text-sm font-medium border border-yellow-400/15"
              >
                חזרה
              </Link>
            </div>
          </div>
        </motion.div>
      )}

    </main>
  );
}

export default function MyLightPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0700] flex items-center justify-center text-yellow-400/40">טוען...</div>}>
      <MyLightContent />
    </Suspense>
  );
}
