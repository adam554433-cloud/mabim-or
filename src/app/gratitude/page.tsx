"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SiteNav from "@/components/SiteNav";
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
    <main className="min-h-screen">
      <SiteNav />
      <div className="max-w-2xl mx-auto px-5 py-10">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌅</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-yellow-400 mb-2">
            הודיה
          </h1>
          <p className="text-yellow-100/70 text-base leading-relaxed">
            רגע אחד של תודה — משנה את היום.
            <br />
            מה הקטן והגדול שאתה אסיר תודה עליו היום?
          </p>
        </div>

        {/* Form */}
        {user === undefined ? null : user ? (
          <div
            className="rounded-2xl p-5 mb-8 border border-yellow-400/20"
            style={{ background: "linear-gradient(135deg,#1a1000,#0a0700)" }}
          >
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              maxLength={280}
              rows={3}
              placeholder="היום אני אסיר/ה תודה על..."
              className="w-full bg-black/30 border border-yellow-400/15 rounded-xl p-3 text-yellow-100 placeholder-amber-400/30 focus:outline-none focus:border-yellow-400/40 resize-none text-right"
            />
            <div className="flex items-center justify-between mt-3">
              <span className="text-amber-400/40 text-xs">
                {text.length}/280
              </span>
              <button
                onClick={submit}
                disabled={!text.trim()}
                className="bg-yellow-400 text-black font-bold px-5 py-2 rounded-full text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transition-all"
              >
                {submitted ? "נשלח ✓" : "פרסם הודיה"}
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center mb-8 p-5 rounded-2xl border border-yellow-400/20 bg-yellow-400/5">
            <p className="text-yellow-100/80 text-sm mb-3">
              כדי לפרסם הודיה — צריך להתחבר תחילה.
            </p>
            <Link
              href="/login"
              className="inline-block bg-yellow-400 text-black font-bold px-5 py-2 rounded-full text-sm"
            >
              התחבר
            </Link>
          </div>
        )}

        {/* Feed */}
        <h2 className="text-amber-400/60 text-xs tracking-[0.25em] font-semibold mb-3">
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
                className="rounded-2xl p-4 border border-yellow-400/10"
                style={{ background: "rgba(20,12,0,0.5)" }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                    style={{ background: "rgba(251,191,36,0.15)" }}
                  >
                    💛
                  </div>
                  <span className="text-yellow-100 font-semibold text-sm">
                    {e.name}
                  </span>
                  <span className="text-amber-400/30 text-xs mr-auto">
                    {e.date}
                  </span>
                </div>
                <p className="text-yellow-100/85 text-sm leading-relaxed">
                  {e.text}
                </p>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
