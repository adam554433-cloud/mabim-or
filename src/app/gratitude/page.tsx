"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LightPage from "@/components/LightPage";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import Link from "next/link";

type Entry = {
  id: string;
  name: string;
  text: string;
  date: string;
};

const STORAGE_KEY = "mabim-or:gratitude";

const SEED: Entry[] = [
  {
    id: "g1",
    name: "מרים כהן",
    text: "אני אסירת תודה על שיחה ארוכה עם אמא שלי הבוקר. שמעתי את הקול שלה אחרי שבוע.",
    date: "2026-05-13",
  },
  {
    id: "g2",
    name: "יוסי לוי",
    text: "תודה על השמש. פשוט על השמש שזרחה היום.",
    date: "2026-05-13",
  },
  {
    id: "g3",
    name: "רחל שמש",
    text: "השכן שעזר לי להעלות סלים מהמכונית, בלי שאמרתי מילה.",
    date: "2026-05-12",
  },
];

// Palette
const INK = "#2A2A2A";
const INK_SOFT = "#5A5A5A";
const GOLD = "#FFD345";
const GOLD_DK = "#CAA928";
const GOLD_LT = "#FDE494";

export default function GratitudePage() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [entries, setEntries] = useState<Entry[]>(SEED);
  const [text, setText] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Entry[];
        setEntries([...parsed, ...SEED]);
      } catch {}
    }
  }, []);

  const displayName =
    user?.user_metadata?.display_name ?? user?.email?.split("@")[0] ?? "";

  function submit() {
    if (!text.trim() || !user) return;
    const entry: Entry = {
      id: crypto.randomUUID(),
      name: displayName || "אנונימי",
      text: text.trim(),
      date: new Date().toISOString().slice(0, 10),
    };
    const next = [entry, ...entries];
    setEntries(next);
    const stored = localStorage.getItem(STORAGE_KEY);
    const prev: Entry[] = stored ? JSON.parse(stored) : [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify([entry, ...prev]));
    setText("");
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 2500);
  }

  return (
    <LightPage>
      <div className="max-w-2xl mx-auto px-5 py-12">
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">🌅</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2" style={{ color: INK }}>
            הודיה
          </h1>
          <p className="text-base leading-relaxed" style={{ color: INK_SOFT }}>
            רגע אחד של תודה — משנה את היום.
            <br />
            מה הקטן והגדול שאת/ה אסיר/ת תודה עליו היום?
          </p>
        </div>

        {/* Form */}
        {user === undefined ? null : user ? (
          <div
            className="rounded-2xl p-5 mb-8"
            style={{
              background: "#FFFFFF",
              border: `1px solid ${GOLD_DK}33`,
              boxShadow: "0 10px 30px rgba(202,169,40,0.08), 0 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={280}
              rows={3}
              placeholder="היום אני אסיר/ה תודה על..."
              className="w-full rounded-xl p-3 resize-none text-right focus:outline-none"
              style={{
                background: "#FFFCF0",
                border: `1px solid ${GOLD_DK}22`,
                color: INK,
              }}
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs" style={{ color: GOLD_DK }}>
                {text.length}/280
              </span>
              <button
                onClick={submit}
                disabled={!text.trim()}
                className="font-bold px-5 py-2 rounded-full text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transition-all"
                style={{
                  background: INK,
                  color: GOLD,
                  boxShadow: `0 6px 16px ${INK}25`,
                }}
              >
                {submitted ? "נשלח ✓" : "פרסם הודיה"}
              </button>
            </div>
          </div>
        ) : (
          <div
            className="text-center mb-8 p-5 rounded-2xl"
            style={{
              background: "#FFFFFF",
              border: `1px solid ${GOLD_DK}33`,
              boxShadow: "0 6px 20px rgba(202,169,40,0.06)",
            }}
          >
            <p className="text-sm mb-3" style={{ color: INK_SOFT }}>
              כדי לפרסם הודיה — צריך להתחבר תחילה.
            </p>
            <Link
              href="/login"
              className="inline-block font-bold px-5 py-2 rounded-full text-sm"
              style={{ background: INK, color: GOLD }}
            >
              התחבר
            </Link>
          </div>
        )}

        {/* Feed */}
        <h2
          className="text-xs tracking-[0.25em] font-bold mb-3"
          style={{ color: GOLD_DK }}
        >
          הודיות הקהילה
        </h2>
        <div className="space-y-3">
          <AnimatePresence>
            {entries.map((e) => (
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl p-4"
                style={{
                  background: "#FFFFFF",
                  border: `1px solid ${GOLD_DK}22`,
                  boxShadow: "0 4px 14px rgba(202,169,40,0.05)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                    style={{ background: `${GOLD_LT}80` }}
                  >
                    💛
                  </div>
                  <span className="font-semibold text-sm" style={{ color: INK }}>
                    {e.name}
                  </span>
                  <span className="text-xs mr-auto" style={{ color: GOLD_DK }}>
                    {e.date}
                  </span>
                </div>
                <p className="text-sm leading-relaxed" style={{ color: INK_SOFT }}>
                  {e.text}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </LightPage>
  );
}
