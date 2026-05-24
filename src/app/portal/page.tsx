"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AVATARS, PRINCIPLES } from "@/lib/principles";
import AvatarSelect from "@/components/portal/AvatarSelect";
import SpiralMandala from "@/components/portal/SpiralMandala";
import PrincipleModal from "@/components/portal/PrincipleModal";
import SparkField from "@/components/fx/SparkField";

export default function PortalPage() {
  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [activeId, setActiveId] = useState<number | null>(null);

  const activePrinciple = activeId
    ? PRINCIPLES.find((p) => p.id === activeId) ?? null
    : null;

  const goNext = () => {
    if (activeId === null) return;
    const next = activeId >= PRINCIPLES.length ? 1 : activeId + 1;
    setActiveId(next);
  };
  const goPrev = () => {
    if (activeId === null) return;
    const prev = activeId <= 1 ? PRINCIPLES.length : activeId - 1;
    setActiveId(prev);
  };

  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav
        className="sticky top-0 z-40 flex items-center justify-between px-5 py-3.5 backdrop-blur-md border-b border-yellow-400/10"
        style={{ background: "rgba(10,7,0,0.85)" }}
      >
        <Link href="/" className="text-yellow-400 font-extrabold text-base sm:text-lg">
          ✨ ניצוצות
        </Link>
        <div className="flex items-center gap-3 text-sm">
          {avatar && (
            <button
              onClick={() => {
                setAvatar(null);
                setActiveId(null);
              }}
              className="text-gray-400 hover:text-yellow-400 transition-colors flex items-center gap-1.5"
            >
              <span>{AVATARS[avatar].emoji}</span>
              <span className="hidden sm:inline">החלף שער</span>
            </button>
          )}
          <Link
            href="/"
            className="text-gray-500 hover:text-yellow-400 transition-colors text-xs sm:text-sm"
          >
            חזרה לאתר
          </Link>
        </div>
      </nav>

      {/* Aurora / starry backdrop */}
      <div
        className="fixed inset-0 pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(ellipse 90% 50% at 50% 30%, rgba(251,191,36,0.07), transparent 60%), radial-gradient(circle at 80% 80%, rgba(168,85,247,0.06), transparent 50%), radial-gradient(circle at 15% 70%, rgba(14,165,233,0.05), transparent 50%)",
        }}
      />

      {/* Constellation field — hidden on small screens to keep perf snappy */}
      <div className="fixed inset-0 -z-10 hidden sm:block">
        <SparkField
          density={0.06}
          maxDistance={130}
          speed={0.15}
          fade={false}
          attractMouse
          className="absolute inset-0 w-full h-full opacity-50"
        />
      </div>

      <AnimatePresence mode="wait">
        {!avatar ? (
          <motion.div
            key="select"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AvatarSelect onSelect={setAvatar} />
          </motion.div>
        ) : (
          <motion.div
            key="mandala"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="px-4 sm:px-6 py-6 sm:py-10"
          >
            {/* Header for avatar */}
            <div className="max-w-3xl mx-auto text-center mb-6 sm:mb-8">
              <div
                className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs sm:text-sm font-semibold mb-3"
                style={{
                  color: AVATARS[avatar].color,
                  borderColor: `${AVATARS[avatar].color}40`,
                  background: `${AVATARS[avatar].color}10`,
                }}
              >
                <span>{AVATARS[avatar].emoji}</span>
                <span>שער ה{AVATARS[avatar].label}</span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-yellow-400 mb-2">
                ספירת ה־13 עקרונות
              </h1>
              <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
                לחץ על עיקרון בספירה כדי לפתוח שיעור, תרגול ומשחק שמותאמים אליך.
              </p>
            </div>

            {/* Mandala */}
            <SpiralMandala onSelect={setActiveId} />

            {/* Principle list (mobile-friendly fallback) */}
            <div className="max-w-4xl mx-auto mt-10 sm:mt-12">
              <h2 className="text-center text-yellow-400/70 text-xs sm:text-sm tracking-[0.3em] font-semibold mb-4">
                כל העקרונות
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {PRINCIPLES.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setActiveId(p.id)}
                    className="group flex items-center gap-3 text-right p-3 rounded-xl border border-yellow-400/10 bg-black/20 hover:border-yellow-400/40 hover:bg-yellow-400/5 transition-all"
                  >
                    <span
                      className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
                      style={{
                        background: `${p.color}20`,
                        color: p.color,
                        border: `1px solid ${p.ringColor}`,
                      }}
                    >
                      {p.id}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-yellow-100 truncate">
                        {p.title}
                      </div>
                      <div className="text-xs text-gray-500 truncate">{p.subtitle}</div>
                    </div>
                    <span className="text-yellow-400/40 group-hover:text-yellow-400 transition-colors">
                      ←
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal */}
      <PrincipleModal
        principle={activePrinciple}
        avatar={avatar ?? "teen"}
        onClose={() => setActiveId(null)}
        onNext={goNext}
        onPrev={goPrev}
      />
    </main>
  );
}
