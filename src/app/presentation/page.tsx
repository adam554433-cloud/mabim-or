"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";

// ── Slide visuals ────────────────────────────────────────────────────────

function WelcomeVisual() {
  return (
    <div className="flex items-center justify-center h-28 sm:h-44 gap-4">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.span
          key={i}
          className="candle-flicker"
          style={{ animationDelay: `${i * 0.5}s`, fontSize: `${2 + i * 0.4}rem` }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
        >
          🕯️
        </motion.span>
      ))}
    </div>
  );
}

function ChallengeVisual() {
  const challenges = [
    { icon: "🛒", text: "קנה לשכן קניות היום" },
    { icon: "💬", text: "תן מילה טובה לאדם זר" },
    { icon: "🤝", text: "עזור למישהו שצריך עזרה" },
    { icon: "📞", text: "התקשר להורים / לאח שלך" },
  ];
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % challenges.length), 2400);
    return () => clearInterval(t);
  }, [challenges.length]);

  return (
    <div className="flex items-center justify-center h-28 sm:h-44 overflow-hidden">
      <div className="bg-[#1c1c33] border border-yellow-400/25 rounded-2xl px-5 py-3 w-full max-w-xs text-center">
        <div className="text-xs text-yellow-400/60 font-semibold mb-2">✨ אתגר השבוע</div>
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <div className="text-2xl sm:text-4xl mb-1">{challenges[i].icon}</div>
            <div className="text-white font-bold text-sm sm:text-lg leading-snug">{challenges[i].text}</div>
          </motion.div>
        </AnimatePresence>
        <div className="mt-2 text-gray-500 text-xs">⏰ 4 ימים נותרו</div>
      </div>
    </div>
  );
}

function FilmVisual() {
  const steps = [
    { emoji: "📹", label: "מצלמים" },
    { emoji: "⬆️", label: "מעלים" },
    { emoji: "✍️", label: "שמים שם" },
    { emoji: "✨", label: "האור נדלק!" },
  ];
  const [active, setActive] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setActive((a) => (a + 1) % steps.length), 1800);
    return () => clearInterval(t);
  }, [steps.length]);

  return (
    <div className="flex items-center justify-center h-28 sm:h-44 gap-3 sm:gap-6 overflow-hidden">
      {steps.map((s, i) => (
        <div key={i} className="flex flex-col items-center gap-2">
          <motion.div
            animate={{ scale: active === i ? 1.25 : 0.85, opacity: active === i ? 1 : 0.3 }}
            transition={{ duration: 0.4 }}
            className="text-4xl"
          >
            {s.emoji}
          </motion.div>
          <div className={`text-xs text-center transition-colors ${active === i ? "text-yellow-400" : "text-gray-600"}`}>
            {s.label}
          </div>
        </div>
      ))}
    </div>
  );
}

function LightVisual() {
  const SIZE = 14;
  const [lit, setLit] = useState<Set<number>>(new Set([14, 27, 42, 55, 68, 84, 98]));
  useEffect(() => {
    const t = setInterval(() => {
      setLit((prev) => {
        const next = new Set(prev);
        let idx;
        do { idx = Math.floor(Math.random() * SIZE * SIZE); } while (next.has(idx));
        next.add(idx);
        return next;
      });
    }, 350);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex flex-col items-center gap-2 h-28 sm:h-44 justify-center overflow-hidden">
      <div className="grid gap-[3px]" style={{ gridTemplateColumns: `repeat(${SIZE}, 10px)` }}>
        {Array.from({ length: SIZE * SIZE }).map((_, i) => (
          <motion.div
            key={i}
            animate={{
              backgroundColor: lit.has(i) ? "#fbbf24" : "rgba(255,255,255,0.07)",
              boxShadow: lit.has(i) ? "0 0 5px rgba(251,191,36,.9)" : "none",
            }}
            transition={{ duration: 0.3 }}
            style={{ width: 10, height: 10, borderRadius: 2 }}
          />
        ))}
      </div>
      <div className="text-yellow-400 text-sm font-semibold">
        {lit.size} אורות מתוך 50,000
      </div>
    </div>
  );
}

function CommunityVisual() {
  const people = [
    { name: "יוסי", action: "הדליק אור ✨", color: "bg-yellow-400" },
    { name: "מרים", action: "כתבה: כל הכבוד! 🙏", color: "bg-orange-400" },
    { name: "דוד", action: "הדליק אור ✨", color: "bg-amber-500" },
    { name: "רחל", action: "כתבה: מרגש מאוד ❤️", color: "bg-yellow-500" },
  ];
  const [show, setShow] = useState(1);
  useEffect(() => {
    const t = setInterval(() => setShow((s) => Math.min(s + 1, people.length)), 900);
    return () => clearInterval(t);
  }, [people.length]);

  return (
    <div className="flex flex-col gap-2 h-28 sm:h-44 justify-center max-w-xs mx-auto w-full overflow-hidden">
      <AnimatePresence>
        {people.slice(0, show).map((p, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 bg-[#1c1c33] rounded-xl px-3 py-2.5"
          >
            <div className={`w-7 h-7 rounded-full ${p.color} flex items-center justify-center text-black font-bold text-xs`}>
              {p.name[0]}
            </div>
            <div>
              <span className="text-white text-sm font-medium">{p.name} </span>
              <span className="text-gray-400 text-xs">{p.action}</span>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function JoinVisual() {
  const [count, setCount] = useState(1200);
  useEffect(() => {
    const t = setInterval(() => {
      setCount((c) => {
        if (c >= 1247) { clearInterval(t); return 1247; }
        return c + 1;
      });
    }, 30);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="flex items-center justify-center h-28 sm:h-44">
      <div className="text-center">
        <motion.div
          animate={{ scale: [1, 1.04, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-6xl sm:text-7xl font-extrabold text-yellow-400"
          style={{ textShadow: "0 0 40px rgba(251,191,36,.6)" }}
        >
          {count.toLocaleString("he-IL")}
        </motion.div>
        <div className="text-gray-300 text-lg mt-2 font-medium">אורות כבר דולקים</div>
        <div className="text-gray-500 text-sm mt-1">וממשיכים להידלק בכל יום</div>
      </div>
    </div>
  );
}

// ── Slides config ────────────────────────────────────────────────────────

const SLIDES = [
  {
    badge: "ברוך הבא 👋",
    title: "מה זה מביאים אור?",
    body: "תנועה של אנשים שעושים מעשים טובים ומתחברים ביחד. כל מעשה — אור נוסף.",
    visual: <WelcomeVisual />,
  },
  {
    badge: "שלב 1 📋",
    title: "כל שבוע — אתגר אחד",
    body: "כל שבוע מתפרסם אתגר פשוט שאפשר לעשות היום. ממש עכשיו.",
    visual: <ChallengeVisual />,
  },
  {
    badge: "שלב 2 📹",
    title: "עושים ומצלמים",
    body: "עשית את האתגר? מצלמים את הרגע, מעלים לאתר ושמים את השם שלך.",
    visual: <FilmVisual />,
  },
  {
    badge: "שלב 3 ✨",
    title: "האור שלך נדלק בפאזל",
    body: "מיד לאחר ההעלאה — אור חדש נדלק בפאזל הענק שכולנו בונים ביחד.",
    visual: <LightVisual />,
  },
  {
    badge: "שלב 4 👥",
    title: "רואים אחד את השני",
    body: "כל הקהילה רואה מה עשית. אפשר לכתוב, להחמיא, ולעודד אחד את השני.",
    visual: <CommunityVisual />,
  },
  {
    badge: "בוא להצטרף 🕯️",
    title: "הצטרף עכשיו",
    body: "הצטרף לאלפי אנשים שכבר מאירים. האתגר השבוע מחכה לך.",
    visual: <JoinVisual />,
    isCta: true,
  },
] as const;

// ── Page ─────────────────────────────────────────────────────────────────

export default function HowItWorksPage() {
  const [cur, setCur] = useState(0);
  const slide = SLIDES[cur];
  const touchStart = useRef(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft"  || e.key === "ArrowDown")  setCur((c) => Math.min(c + 1, SLIDES.length - 1));
      if (e.key === "ArrowRight" || e.key === "ArrowUp")    setCur((c) => Math.max(c - 1, 0));
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  function onTouchStart(e: React.TouchEvent) { touchStart.current = e.touches[0].clientX; }
  function onTouchEnd(e: React.TouchEvent) {
    const dx = touchStart.current - e.changedTouches[0].clientX;
    if (dx >  50) setCur((c) => Math.min(c + 1, SLIDES.length - 1));
    if (dx < -50) setCur((c) => Math.max(c - 1, 0));
  }

  return (
    <div
      className="bg-[#0a0a14] flex flex-col select-none overflow-hidden"
      style={{ height: "100dvh" }}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Nav */}
      <div className="flex items-center justify-between px-5 py-3 flex-shrink-0">
        <Link href="/" className="text-gray-500 hover:text-white text-sm transition-colors">
          → חזרה
        </Link>
        <div className="flex gap-1.5">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCur(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === cur ? "w-6 bg-yellow-400" : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>
        <span className="text-gray-600 text-xs">{cur + 1} / {SLIDES.length}</span>
      </div>

      {/* Slide */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center px-6 py-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={cur}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -24 }}
            transition={{ duration: 0.4 }}
            className="max-w-md w-full text-center"
          >
            <div className="inline-block bg-yellow-400/10 text-yellow-400 text-xs font-bold px-4 py-1.5 rounded-full mb-3 border border-yellow-400/20">
              {slide.badge}
            </div>

            {slide.visual}

            <h2 className="text-xl sm:text-4xl font-extrabold mt-3 mb-2 leading-tight">
              {slide.title}
            </h2>
            <p className="text-gray-300 text-sm sm:text-lg leading-relaxed max-w-sm mx-auto">
              {slide.body}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 pb-6 px-6 flex-shrink-0">
        <button
          onClick={() => setCur((c) => Math.max(c - 1, 0))}
          disabled={cur === 0}
          className="text-gray-500 hover:text-white disabled:opacity-20 transition-all px-4 py-2 rounded-full hover:bg-white/5 text-sm"
        >
          → קודם
        </button>

        {"isCta" in slide && slide.isCta ? (
          <Link
            href="/"
            className="bg-yellow-400 active:bg-yellow-500 text-black font-bold px-8 py-3.5 rounded-full text-lg transition-all hover:scale-105 hover:shadow-[0_0_28px_rgba(251,191,36,.5)]"
          >
            הצטרף עכשיו ✨
          </Link>
        ) : (
          <button
            onClick={() => setCur((c) => Math.min(c + 1, SLIDES.length - 1))}
            className="bg-yellow-400 active:bg-yellow-500 text-black font-bold px-8 py-3.5 rounded-full text-lg transition-all hover:scale-105"
          >
            הבא ←
          </button>
        )}
      </div>

      <div className="text-center pb-3 text-gray-700 text-xs flex-shrink-0">החלק שמאלה / ימינה לניווט</div>
    </div>
  );
}
