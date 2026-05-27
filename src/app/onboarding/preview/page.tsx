"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import OnboardingForm from "@/components/OnboardingForm";

export default function OnboardingPreview() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{
        background:
          "radial-gradient(ellipse 140% 55% at 50% -5%, #1e1000 0%, #0a0700 55%)",
      }}
    >
      <Link
        href="/"
        className="text-yellow-400 font-extrabold text-xl mb-4 candle-flicker"
      >
        ✨ מביאים אור
      </Link>

      <p className="text-amber-200/40 text-xs mb-6">
        תצוגה מקדימה — שמירה לא תעבוד ללא התחברות
      </p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-3xl p-8"
        style={{
          background: "linear-gradient(135deg,#1e1200,#0d0800)",
          border: "1px solid rgba(251,191,36,0.3)",
          boxShadow: "0 0 60px rgba(251,191,36,0.12)",
        }}
      >
        <div className="text-center mb-7">
          <div className="text-5xl mb-3">👋</div>
          <h1 className="text-2xl font-extrabold text-white">ספר/י לנו עליך</h1>
          <p className="text-amber-200/50 text-sm mt-2">
            שאלון קצר לפני שמתחילים
          </p>
        </div>

        <OnboardingForm onComplete={() => alert("✓ אישור התקבל (preview)")} />
      </motion.div>
    </main>
  );
}
