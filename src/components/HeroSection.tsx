"use client";

import { motion } from "framer-motion";
import { useMemo, useState, useEffect, useRef } from "react";
import SparkField from "./fx/SparkField";
import Sparkle from "./fx/Sparkle";
import OnePulse from "./fx/OnePulse";
import ParticlesBg from "./fx/ParticlesBg";

interface HeroSectionProps {
  litCount: number;
  ctaHref?: string;
  /** Optional short line rendered directly beneath the CTA button. */
  ctaNote?: string;
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

export default function HeroSection({ litCount, ctaHref = "#challenge", ctaNote }: HeroSectionProps) {
  const percentage = ((litCount / 50000) * 100).toFixed(1);
  const stars = useMemo(() => makeStars(90), []);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Fire OnePulse only when litCount changes after mount (not on initial render)
  const prevCountRef = useRef(litCount);
  const [pulseAt, setPulseAt] = useState<number | null>(null);
  useEffect(() => {
    if (prevCountRef.current !== litCount) {
      setPulseAt(Date.now());
      prevCountRef.current = litCount;
    }
  }, [litCount]);

  return (
    <section className="relative text-center px-5 py-10 md:py-20 overflow-hidden">

      {/* ── Particles network ── */}
      <ParticlesBg />

      {/* ── Ambient warm blobs ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="aurora-glow absolute top-[-10%] left-1/2 -translate-x-1/2 w-[min(900px,150vw)] h-80 bg-yellow-400/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-orange-500/6 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-amber-400/6 rounded-full blur-3xl" />
      </div>

      {/* ── Constellation field — lighter on mobile ── */}
      <div className="absolute inset-0">
        <SparkField
          density={isMobile ? 0.04 : 0.08}
          maxDistance={isMobile ? 90 : 120}
          speed={0.18}
          fade={false}
          attractMouse={!isMobile}
          className="absolute inset-0 w-full h-full opacity-60"
        />
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

      {/* ── Sparkle ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative mb-3 inline-flex items-center justify-center"
      >
        <Sparkle size={isMobile ? 72 : 96} />
      </motion.div>

      {/* ── Title ── */}
      <motion.h1
        initial={{ opacity: 0, y: 14, letterSpacing: "0.4em" }}
        animate={{ opacity: 1, y: 0, letterSpacing: "0em" }}
        transition={{ duration: 1.2, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="relative text-5xl sm:text-6xl md:text-7xl font-extrabold mb-1 leading-tight tracking-tight text-yellow-400"
        style={{
          textShadow:
            "0 0 24px rgba(251,191,36,0.6), 0 0 60px rgba(251,191,36,0.3)",
        }}
      >
        הפאזל
      </motion.h1>

      {/* ── Brand tagline ── */}
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.35 }}
        className="text-sm sm:text-base md:text-lg font-medium tracking-[0.25em] mb-5"
        style={{ color: "#FDE494", opacity: 0.85 }}
      >
        ניצוצות אור בפעולה
      </motion.p>

      {/* ── Hero subtitle (kept) ── */}
      <motion.p
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.45 }}
        className="text-base sm:text-lg md:text-xl text-gray-200 mb-8 max-w-sm sm:max-w-xl mx-auto leading-relaxed"
      >
        ביחד מאירים.ות את העולם.
        <br className="hidden sm:block" />
        {" "}כל מעשה טוב - אור נוסף בפאזל.
      </motion.p>

      {/* ── Counter card ── */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="w-full max-w-sm sm:max-w-md mx-auto rounded-2xl px-6 py-5 mb-8"
        style={{
          background: "linear-gradient(135deg, rgba(30,18,0,0.9) 0%, rgba(15,10,0,0.85) 100%)",
          border: "1px solid rgba(255,211,69,0.35)",
          boxShadow: "0 0 40px rgba(255,211,69,0.14), inset 0 1px 0 rgba(255,211,69,0.12)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Count centered, label below */}
        <div className="flex flex-col items-center gap-1">
          <span className="relative inline-block">
            <motion.span
              key={litCount}
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.18, 0.96, 1.08, 1] }}
              transition={{ duration: 0.9, times: [0, 0.18, 0.4, 0.7, 1], ease: "easeOut" }}
              className="block text-5xl sm:text-6xl font-extrabold tabular-nums leading-none"
              style={{ color: "#FFD345", textShadow: "0 0 30px rgba(255,211,69,.85)" }}
            >
              {litCount.toLocaleString("he-IL")}
            </motion.span>
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <OnePulse trigger={pulseAt} size={32} rings={3} duration={1.6} />
            </span>
          </span>
          <span className="text-base sm:text-lg font-medium text-amber-100/90 leading-none mt-1">
            אורות דולקים
          </span>
        </div>

        {/* Goal line — smaller, below */}
        <div className="text-center text-amber-200/55 text-xs sm:text-sm mt-1.5 tracking-wide">
          היעד הראשון: 50,000
        </div>

        {/* Progress bar — bolder, more visible */}
        <div className="relative mt-4">
          <div
            className="w-full h-3 rounded-full overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.06)",
              boxShadow: "inset 0 1px 3px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,211,69,0.18)",
            }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{
                background: "linear-gradient(90deg,#FDE494 0%,#FFD345 50%,#CAA928 100%)",
                boxShadow: "0 0 12px rgba(255,211,69,0.9), 0 0 24px rgba(255,211,69,0.45)",
              }}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1.6, delay: 0.7, ease: "easeOut" }}
            />
          </div>
          <span
            className="absolute -top-5 left-0 text-[11px] font-semibold tabular-nums"
            style={{ color: "#FFD345" }}
          >
            {percentage}%
          </span>
        </div>
      </motion.div>

      {/* ── CTA ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.6 }}
        className="relative z-10 inline-flex w-full max-w-xs sm:w-auto justify-center"
      >
        {/* Pulsing aura behind the button */}
        <motion.span
          aria-hidden
          className="absolute inset-0 rounded-full bg-yellow-400/30 blur-xl pointer-events-none"
          animate={{ opacity: [0.25, 0.45, 0.25], scale: [0.98, 1.05, 0.98] }}
          transition={{ duration: 3.2, ease: "easeInOut", repeat: Infinity }}
        />

        {/* Continuously emanating rings (חישוקים) — fade in & out, no pop */}
        {[0, 1].map((i) => (
          <motion.span
            key={i}
            aria-hidden
            className="absolute inset-0 rounded-full border border-yellow-300/70 pointer-events-none"
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: [0, 0.35, 0], scale: [1, 1.45] }}
            transition={{
              duration: 3.2,
              ease: "easeInOut",
              repeat: Infinity,
              delay: i * 1.6,
            }}
          />
        ))}

        <motion.a
          href={ctaHref}
          className="group relative z-10 inline-flex w-full justify-center overflow-hidden bg-yellow-400 active:bg-yellow-500 text-black font-bold px-8 py-4 rounded-full text-lg transition-transform hover:scale-105 select-none cursor-pointer"
          animate={{
            boxShadow: [
              "0 0 20px rgba(251,191,36,0.3)",
              "0 0 32px rgba(251,191,36,0.5)",
              "0 0 20px rgba(251,191,36,0.3)",
            ],
          }}
          transition={{ duration: 3.2, ease: "easeInOut", repeat: Infinity }}
        >
          <span className="relative">הצטרפו להאיר ←</span>
        </motion.a>
      </motion.div>

      {/* ── Note directly beneath the CTA ── */}
      {ctaNote && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="relative z-10 mt-4 mx-auto max-w-xs text-sm leading-relaxed"
          style={{ color: "#FDE494", opacity: 0.8 }}
        >
          {ctaNote}
        </motion.p>
      )}
    </section>
  );
}
