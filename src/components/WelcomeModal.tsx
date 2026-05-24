"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const STORAGE_KEY = "mabim-or:welcomed";

type Props = {
  name: string;
};

export default function WelcomeModal({ name }: Props) {
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
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 backdrop-blur-md"
            style={{ background: "rgba(5,3,0,0.85)" }}
          />
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.96 }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="relative max-w-md w-full rounded-3xl border border-yellow-400/30 p-8 text-center"
            style={{
              background:
                "radial-gradient(ellipse at top, #2a1700 0%, #100900 70%)",
              boxShadow: "0 0 80px rgba(251,191,36,0.2)",
            }}
          >
            <div className="text-6xl mb-4 candle-flicker">✨</div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-yellow-400 mb-3">
              שלום לך{name ? ` ${name}` : ""}
            </h2>
            <p className="text-yellow-100/85 text-base leading-relaxed mb-6">
              ברוך הבא ל<span className="text-yellow-400 font-bold">ניצוצות</span>.
              <br />
              כאן אנחנו עושים מעשה קטן אחד בשבוע — וכל אור משלים נקודה אחת מתוך 50,000 בפאזל של עם ישראל.
            </p>
            <div className="text-right space-y-2.5 mb-7">
              {[
                { e: "📜", t: "אתגר שבועי — משימה אחת לכל הקהילה" },
                { e: "✨", t: "האור שלך נדלק בפאזל המרכזי" },
                { e: "🌅", t: "הודיה ותובנה יומית — לרוממות הנפש" },
                { e: "👥", t: "רואים אחד את השני — קהילה אמיתית" },
              ].map((row) => (
                <div
                  key={row.t}
                  className="flex items-center gap-3 p-3 rounded-xl border border-yellow-400/10 bg-yellow-400/5"
                >
                  <span className="text-xl">{row.e}</span>
                  <span className="text-yellow-100/90 text-sm">{row.t}</span>
                </div>
              ))}
            </div>
            <button
              onClick={close}
              className="w-full bg-yellow-400 text-black font-bold py-3.5 rounded-full text-base hover:scale-[1.02] transition-all"
              style={{ boxShadow: "0 0 24px rgba(251,191,36,0.4)" }}
            >
              קח אותי להתחיל ←
            </button>
            <p className="text-amber-400/40 text-xs mt-3">
              תוכל לחזור לכאן דרך תפריט ׳אודות׳
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
