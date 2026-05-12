"use client";

import { motion } from "framer-motion";
import { Avatar, AVATARS } from "@/lib/principles";

type Props = {
  onSelect: (a: Avatar) => void;
};

export default function AvatarSelect({ onSelect }: Props) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 py-12">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10 max-w-2xl"
      >
        <div className="inline-block px-3 py-1 rounded-full bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 text-xs tracking-[0.3em] mb-4">
          קוד 26 — פורטל החניכה
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-yellow-400 mb-3">
          איך אתה נכנס לפורטל?
        </h1>
        <p className="text-gray-400 text-base sm:text-lg leading-relaxed">
          לכל מסע יש שער משלו. בחר את שערך — והמסע יותאם עבורך:
          <br />
          שיעורים, תרגולים ומשחקים סביב <span className="text-yellow-400">13 העקרונות</span> של צופן חיים.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full max-w-5xl">
        {(Object.keys(AVATARS) as Avatar[]).map((key, i) => {
          const a = AVATARS[key];
          return (
            <motion.button
              key={key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.1, duration: 0.55 }}
              onClick={() => onSelect(key)}
              className="group relative overflow-hidden rounded-2xl border border-yellow-400/20 bg-gradient-to-b from-yellow-400/5 to-transparent p-7 text-right hover:border-yellow-400/60 transition-all hover:scale-[1.02]"
              style={{
                boxShadow: "0 0 30px rgba(251,191,36,0.05)",
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${a.color}30, transparent 60%)`,
                }}
              />
              <div className="relative">
                <div className="text-5xl mb-4">{a.emoji}</div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: a.color }}>
                  אני {a.label}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{a.description}</p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-yellow-400 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                  כניסה לשער
                  <span>←</span>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="mt-12 text-center max-w-xl text-gray-500 text-sm leading-relaxed"
      >
        <p>
          קוד 26 הוא צופן חיים של חיבור, אמת, אהבה, חירות ושלווה —
          <br />
          מבוסס על חכמת המקרא, החסידות והקבלה.
        </p>
      </motion.div>
    </div>
  );
}
