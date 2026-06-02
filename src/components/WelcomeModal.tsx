"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Sparkle from "./fx/Sparkle";
import ParticlesBg from "./fx/ParticlesBg";
import { ScrollIcon, SunriseIcon, LightbulbIcon } from "./icons";

const STORAGE_KEY = "nitzotzot:welcomed";

type Gender = "male" | "female" | "";

type Props = {
  name: string;
  gender?: Gender;
};

function greetingFor(gender: Gender | undefined) {
  if (gender === "female") return { welcome: "ברוכה הבאה", cta: "קחי אותי להתחיל" };
  if (gender === "male") return { welcome: "ברוך הבא", cta: "קח אותי להתחיל" };
  return { welcome: "ברוכים הבאים", cta: "קח אותי להתחיל" };
}

export default function WelcomeModal({ name, gender }: Props) {
  const { welcome, cta } = greetingFor(gender);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      const t = setTimeout(() => setOpen(true), 500);
      return () => clearTimeout(t);
    }
  }, []);

  function close() {
    localStorage.setItem(STORAGE_KEY, "1");
    setOpen(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            style={{ background: "#060e1b" }}
          />
          <ParticlesBg />
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="relative max-w-md w-full max-h-[88vh] overflow-y-auto rounded-3xl border border-yellow-400/30 p-8 text-center"
            style={{
              background:
                "radial-gradient(ellipse at top, #2a1700 0%, #100900 70%)",
              boxShadow: "0 0 80px rgba(251,191,36,0.2)",
            }}
          >
            <div className="flex items-center justify-center -mt-2 mb-2">
              <Sparkle size={72} />
            </div>
            <h2
              className="mb-1 text-yellow-400 font-extrabold"
              style={{ fontSize: 34, fontFamily: "Assistant, sans-serif" }}
            >
              שלום לך{name ? ` ${name}` : ""}
            </h2>
            <p className="text-amber-300/80 text-sm font-medium tracking-[0.18em] mb-5">
              ניצוץ בפעולה
            </p>

            <p className="text-yellow-100/85 text-base leading-relaxed mb-2">
              {welcome} ל<span className="text-yellow-400 font-bold">פאזל ניצוצות</span>.
            </p>
            <p className="text-yellow-100/85 text-base leading-relaxed mb-6">
              כאן, כל מעשה שלך - מדליק עוד אור, ומשלים נקודה נוספת ליעד{" "}
              <span className="text-yellow-400 font-bold">600,000</span> ניצוצות בפאזל של עם ישראל.
            </p>

            {/* למה? */}
            <div className="text-right mb-6">
              <h3 className="text-yellow-400 font-bold text-lg mb-2">למה?</h3>
              <p className="text-yellow-200 font-bold text-sm leading-relaxed mb-2">
                אני חלק משמעותי משלם גדול אחד.
              </p>
              <p className="text-yellow-100/80 text-sm leading-relaxed mb-2">
                כל מעשה קטן שלי משפיע - מצמיח סגולות אמיתיות בתוכי, משתקף במציאות חיי,
                מהדהד ויוצר אדווה גדולה בעולם כולו. המעשה מדליק את הניצוץ הפנימי ומוסיף אור
                לפאזל הכולל.
              </p>
              <p className="text-yellow-100/80 text-sm leading-relaxed">
                כשמסה של אנשים ממוקדת מטרה - יכולת ההשפעה מתעצמת ונפתח שער לאינסוף
                הפוטנציאלים שממתינים לנו.
              </p>
            </div>

            {/* איך זה עובד? */}
            <div className="text-right mb-7">
              <h3 className="text-yellow-400 font-bold text-lg mb-3">איך זה עובד?</h3>
              <div className="space-y-2.5">
                {[
                  { Icon: ScrollIcon, t: "האתגר השבועי - איסוף ניצוצות לפאזל" },
                  { Icon: SunriseIcon, t: "הפצת ניצוצות והודיה - השראה אנושית לעולם" },
                  { Icon: LightbulbIcon, t: "תובנה יומית - להתבוננות פנימית" },
                ].map((row) => (
                  <div
                    key={row.t}
                    className="flex items-center gap-3 p-3 rounded-xl border border-yellow-400/10 bg-yellow-400/5"
                  >
                    <span className="text-yellow-400 shrink-0">
                      <row.Icon size={20} />
                    </span>
                    <span className="text-yellow-100/90 text-sm">{row.t}</span>
                  </div>
                ))}
              </div>
            </div>
            <button
              onClick={close}
              className="w-full bg-yellow-400 text-black font-bold py-3.5 rounded-full text-base hover:scale-[1.02] transition-all"
              style={{ boxShadow: "0 0 24px rgba(251,191,36,0.4)" }}
            >
              {cta} ←
            </button>
            <p className="text-amber-400/40 text-xs mt-3">
              {gender === "female" ? "תוכלי" : "תוכל"} לחזור לכאן דרך תפריט ׳אודות׳
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
