"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AVATARS, Principle } from "@/lib/principles";

type Tab = "lesson" | "exercise" | "game";

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "lesson", label: "השיעור", emoji: "📜" },
  { id: "exercise", label: "תרגול", emoji: "🌱" },
  { id: "game", label: "משחק", emoji: "🎲" },
];

type Props = {
  principle: Principle | null;
  avatar: Avatar;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
};

export default function PrincipleModal({ principle, avatar, onClose, onNext, onPrev }: Props) {
  const [tab, setTab] = useState<Tab>("lesson");

  useEffect(() => {
    setTab("lesson");
  }, [principle?.id]);

  useEffect(() => {
    if (!principle) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onNext();
      if (e.key === "ArrowRight") onPrev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [principle, onClose, onNext, onPrev]);

  return (
    <AnimatePresence>
      {principle && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 backdrop-blur-md"
            style={{ background: "rgba(5,3,0,0.85)" }}
          />

          {/* Modal */}
          <motion.div
            initial={{ y: 60, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 60, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", damping: 30, stiffness: 280 }}
            className="relative w-full max-w-3xl max-h-[92vh] sm:max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-yellow-400/25 bg-gradient-to-b from-[#1a1000] to-[#0a0700]"
            style={{
              boxShadow: `0 -20px 80px ${principle.ringColor}, 0 0 100px rgba(251,191,36,0.1)`,
            }}
          >
            {/* Header glow */}
            <div
              className="absolute inset-x-0 top-0 h-40 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse at top, ${principle.color}30, transparent 70%)`,
              }}
            />

            {/* Close */}
            <button
              onClick={onClose}
              className="absolute top-4 left-4 sm:top-5 sm:left-5 z-10 w-9 h-9 rounded-full bg-black/40 border border-yellow-400/20 text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400/50 transition-all flex items-center justify-center"
              aria-label="סגור"
            >
              ✕
            </button>

            {/* Prev/Next */}
            <button
              onClick={onPrev}
              className="absolute top-4 right-14 sm:top-5 sm:right-16 z-10 w-9 h-9 rounded-full bg-black/40 border border-yellow-400/20 text-yellow-400 hover:bg-yellow-400/10 transition-all flex items-center justify-center"
              aria-label="הקודם"
            >
              →
            </button>
            <button
              onClick={onNext}
              className="absolute top-4 right-4 sm:top-5 sm:right-5 z-10 w-9 h-9 rounded-full bg-black/40 border border-yellow-400/20 text-yellow-400 hover:bg-yellow-400/10 transition-all flex items-center justify-center"
              aria-label="הבא"
            >
              ←
            </button>

            <div className="relative px-6 sm:px-10 pt-14 sm:pt-12 pb-8">
              {/* Avatar pill + principle number */}
              <div className="flex items-center gap-3 mb-4">
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border"
                  style={{
                    color: AVATARS[avatar].color,
                    borderColor: `${AVATARS[avatar].color}50`,
                    background: `${AVATARS[avatar].color}15`,
                  }}
                >
                  {AVATARS[avatar].emoji} {AVATARS[avatar].label}
                </span>
                <span
                  className="text-xs tracking-[0.25em] font-bold"
                  style={{ color: principle.color }}
                >
                  עיקרון {principle.id} מתוך 13
                </span>
              </div>

              <h2
                className="text-3xl sm:text-4xl font-extrabold mb-2 leading-tight"
                style={{ color: principle.color }}
              >
                {principle.title}
              </h2>
              <p className="text-gray-400 text-base sm:text-lg mb-6">{principle.subtitle}</p>

              {/* Quote */}
              <blockquote
                className="border-r-2 pr-4 py-2 my-6 rounded-l-md"
                style={{
                  borderColor: principle.color,
                  background: `${principle.color}10`,
                }}
              >
                <p className="text-lg sm:text-xl font-medium text-yellow-100 leading-relaxed">
                  ״{principle.quote}״
                </p>
                <cite className="text-xs text-gray-500 not-italic block mt-1">
                  — {principle.quoteSource}
                </cite>
              </blockquote>

              {/* Essence */}
              <p className="text-gray-300 leading-relaxed mb-6 text-base sm:text-lg">
                {principle.essence}
              </p>

              {/* Tabs */}
              <div className="flex gap-2 border-b border-yellow-400/15 mb-5">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTab(t.id)}
                    className={`px-4 py-2.5 text-sm sm:text-base font-semibold transition-all border-b-2 -mb-px ${
                      tab === t.id
                        ? "border-current"
                        : "border-transparent text-gray-500 hover:text-gray-300"
                    }`}
                    style={tab === t.id ? { color: principle.color } : {}}
                  >
                    <span className="ml-1">{t.emoji}</span>
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="rounded-xl p-5 sm:p-6 border border-yellow-400/10 bg-black/20"
                >
                  <p className="text-gray-200 text-base sm:text-lg leading-loose whitespace-pre-line">
                    {principle.content[avatar][tab]}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Footer nav */}
              <div className="mt-8 flex items-center justify-between gap-3 text-sm">
                <button
                  onClick={onPrev}
                  className="px-4 py-2 rounded-full border border-yellow-400/20 text-gray-400 hover:text-yellow-400 hover:border-yellow-400/50 transition-all"
                >
                  → עיקרון קודם
                </button>
                <span className="text-xs text-gray-600 tracking-widest">{principle.id} / 13</span>
                <button
                  onClick={onNext}
                  className="px-4 py-2 rounded-full bg-yellow-400/10 border border-yellow-400/40 text-yellow-400 hover:bg-yellow-400/20 transition-all"
                >
                  עיקרון הבא ←
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
