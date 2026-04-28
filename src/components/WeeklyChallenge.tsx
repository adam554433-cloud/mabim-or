"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Challenge } from "@/types";

interface WeeklyChallengeProps {
  challenge: Challenge;
  onScrollToForm: () => void;
}

function getTimeLeft(weekStart: string) {
  const end  = new Date(weekStart);
  end.setDate(end.getDate() + 7);
  const diff = end.getTime() - Date.now();
  if (diff <= 0) return { days: 0, hours: 0 };
  return {
    days:  Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
  };
}

export default function WeeklyChallenge({ challenge, onScrollToForm }: WeeklyChallengeProps) {
  const [tl, setTl] = useState(getTimeLeft(challenge.week_start));

  useEffect(() => {
    const t = setInterval(() => setTl(getTimeLeft(challenge.week_start)), 60000);
    return () => clearInterval(t);
  }, [challenge.week_start]);

  return (
    <section id="challenge" className="px-4 sm:px-6 py-10 max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.65 }}
        className="relative rounded-3xl p-7 sm:p-9 text-center overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1a1000 0%, #0e0900 100%)", border: "1px solid rgba(251,191,36,0.28)", boxShadow: "0 0 60px rgba(251,191,36,0.08)" }}
      >
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-yellow-400/12 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-yellow-400/10 text-yellow-400 text-xs font-bold px-4 py-1.5 rounded-full mb-5 border border-yellow-400/20">
            <span className="candle-flicker text-sm">🕯️</span>
            אתגר השבוע
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold mb-3 text-white leading-snug">
            {challenge.title}
          </h2>

          <p className="text-gray-300 text-base sm:text-lg mb-6 leading-relaxed max-w-md mx-auto">
            {challenge.description}
          </p>

          <div className="flex items-center justify-center gap-3 mb-7">
            <div className="rounded-xl px-4 py-2 text-center min-w-[64px]" style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.15)" }}>
              <div className="text-2xl font-bold text-yellow-300">{tl.days}</div>
              <div className="text-amber-400/60 text-xs">ימים</div>
            </div>
            <div className="text-yellow-400/40 text-xl font-bold">:</div>
            <div className="rounded-xl px-4 py-2 text-center min-w-[64px]" style={{ background: "rgba(251,191,36,0.08)", border: "1px solid rgba(251,191,36,0.15)" }}>
              <div className="text-2xl font-bold text-yellow-300">{tl.hours}</div>
              <div className="text-amber-400/60 text-xs">שעות</div>
            </div>
          </div>

          <button
            onClick={onScrollToForm}
            className="w-full sm:w-auto bg-yellow-400 active:bg-yellow-500 text-black font-bold px-10 py-4 rounded-full text-lg transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(251,191,36,.5)] select-none"
          >
            הדלק את האור שלך ✨
          </button>
        </div>
      </motion.div>
    </section>
  );
}
