"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface HeroSectionProps {
  litCount: number;
}

function makeStars(n: number) {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    x:   (i * 137.508) % 100,
    y:   (i * 89.3)    % 100,
    size: [1, 1, 1, 2, 2, 2, 3][i % 7],
    delay: (i * 0.31) % 5,
    dur:   2.0 + (i % 5) * 0.5,
    opacity: [0.45, 0.65, 0.85, 0.55, 0.75, 0.5][i % 6],
    warm: i % 3 !== 0,
  }));
}

export default function HeroSection({ litCount }: HeroSectionProps) {
  const percentage = ((litCount / 50000) * 100).toFixed(1);
  const stars = useMemo(() => makeStars(90), []);

  return (
    <section className="relative text-center px-5 py-12 md:py-20 overflow-hidden">

      {/* ── Ambient warm blobs ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="aurora-glow absolute top-[-10%] left-1/2 -translate-x-1/2 w-[min(900px,150vw)] h-80 bg-yellow-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-orange-500/6 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-amber-400/6 rounded-full blur-3xl" />
      </div>

      {/* ── Starfield ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        {stars.map((s) => (
          <span
            key={s.id}
            className={`absolute rounded-full ${s.warm ? "bg-amber-200" : "bg-white"}`}
            style={{
              left:    `${s.x}%`,
              top:     `${s.y}%`,
              width:   s.size,
              height:  s.size,
              opacity: s.opacity,
              animation: `twinkle ${s.dur}s ${s.delay}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* ── Candle emoji ── */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9 }}
        className="text-6xl mb-5 candle-flicker"
      >
        🕯️
      </motion.div>

      {/* ── Title ── */}
      <motion.h1
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-3 leading-tight tracking-tight"
        style={{ textShadow: "0 0 80px rgba(251,191,36,.55), 0 0 30px rgba(251,191,36,.3)" }}
      >
מביאים אור
      </motion.h1>

      {/* ── Subtitle ── */}
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 max-w-sm sm:max-w-xl mx-auto leading-relaxed"
      >
        ביחד, אנחנו מאירים את העולם.
        <br className="hidden sm:block" />
        {" "}כל מעשה טוב — אור נוסף בפאזל.
      </motion.p>

      {/* ── Counter card ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="w-full max-w-xs sm:max-w-sm mx-auto rounded-2xl px-6 py-5 mb-8"
        style={{
          background: "linear-gradient(135deg, rgba(30,18,0,0.9) 0%, rgba(15,10,0,0.85) 100%)",
          border: "1px solid rgba(251,191,36,0.3)",
          boxShadow: "0 0 40px rgba(251,191,36,0.12), inset 0 1px 0 rgba(251,191,36,0.1)",
          backdropFilter: "blur(12px)",
        }}
      >
        <span
          className="block text-5xl sm:text-6xl font-extrabold text-yellow-400 tabular-nums"
          style={{ textShadow: "0 0 30px rgba(251,191,36,.8)" }}
        >
          {litCount.toLocaleString("he-IL")}
        </span>
        <span className="block text-amber-200/70 text-sm mt-1">
          אורות דולקים מתוך 50,000
        </span>
        <div className="w-full h-2 bg-white/8 rounded-full mt-4 overflow-hidden">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg,#f59e0b,#f97316)",
              filter: "drop-shadow(0 0 6px rgba(251,191,36,0.8))",
            }}
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 1.6, delay: 0.7, ease: "easeOut" }}
          />
        </div>
        <span className="block text-yellow-400/60 text-xs mt-1.5">{percentage}% הושלם</span>
      </motion.div>

      {/* ── CTA ── */}
      <motion.a
        href="#challenge"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="inline-block w-full max-w-xs sm:w-auto bg-yellow-400 active:bg-yellow-500 text-black font-bold px-8 py-4 rounded-full text-lg transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(251,191,36,.65)] select-none"
        style={{ boxShadow: "0 0 24px rgba(251,191,36,0.35)" }}
      >
        הצטרף לאתגר השבוע ←
      </motion.a>
    </section>
  );
}
