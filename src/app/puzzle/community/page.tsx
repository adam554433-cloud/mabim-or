"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { MOCK_SUBMISSIONS } from "@/lib/mockData";

type Comment = { id: string; name: string; text: string; ts: number };

const COMMENTS_KEY = "mabim-or:comments";

export default function CommunityPage() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [openId, setOpenId] = useState<string | null>(null);
  const [comments, setComments] = useState<Record<string, Comment[]>>({});
  const [draft, setDraft] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const stored = localStorage.getItem(COMMENTS_KEY);
    if (stored) {
      try {
        setComments(JSON.parse(stored));
      } catch {}
    }
  }, []);

  const displayName =
    user?.user_metadata?.display_name ?? user?.email?.split("@")[0] ?? "";

  function postComment(subId: string) {
    if (!draft.trim() || !user) return;
    const c: Comment = {
      id: crypto.randomUUID(),
      name: displayName || "אנונימי",
      text: draft.trim(),
      ts: Date.now(),
    };
    const next = { ...comments, [subId]: [...(comments[subId] ?? []), c] };
    setComments(next);
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(next));
    setDraft("");
  }

  if (user === null) {
    return (
      <main className="min-h-screen">
        <SiteNav />
        <div className="max-w-md mx-auto px-5 py-20 text-center">
          <div className="text-5xl mb-3">👥</div>
          <h1 className="text-2xl font-extrabold text-yellow-400 mb-3">
            רואים אחד את השני
          </h1>
          <p className="text-yellow-100/70 text-sm mb-6 leading-relaxed">
            הקהילה פתוחה רק לחברים רשומים.
            <br />
            הצטרף — וראה את האורות של אחרים, הגב, תן כוח.
          </p>
          <Link
            href="/login"
            className="inline-block bg-yellow-400 text-black font-bold px-6 py-3 rounded-full"
          >
            הצטרף להאיר
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <SiteNav />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">👥</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-yellow-400 mb-1">
            רואים אחד את השני
          </h1>
          <p className="text-amber-400/60 text-sm">
            הזרם של אחים ואחיות שמדליקים אור
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2">
          {MOCK_SUBMISSIONS.map((s, i) => (
            <motion.button
              key={s.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04 }}
              onClick={() => setOpenId(s.id)}
              className="aspect-square relative overflow-hidden rounded-lg border border-yellow-400/15 hover:border-yellow-400/50 transition-all group"
              style={{
                background:
                  "linear-gradient(135deg, rgba(251,191,36,0.15) 0%, rgba(10,7,0,0.6) 100%)",
              }}
            >
              {/* Lit dot overlay */}
              <div
                className="absolute inset-0 pointer-events-none opacity-50"
                style={{
                  background:
                    "radial-gradient(circle at 50% 40%, rgba(251,191,36,0.4) 0%, transparent 60%)",
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                <div className="text-2xl mb-1">✨</div>
                <div className="text-yellow-100 font-bold text-xs truncate w-full text-center">
                  {s.name}
                </div>
                <div className="text-amber-400/50 text-[10px] truncate w-full text-center mt-0.5">
                  {s.challenge_title}
                </div>
                {(comments[s.id]?.length ?? 0) > 0 && (
                  <div className="absolute top-1 left-1 text-[10px] bg-yellow-400/20 text-yellow-300 rounded-full px-1.5 py-0.5">
                    💬 {comments[s.id].length}
                  </div>
                )}
              </div>
            </motion.button>
          ))}
          <div className="aspect-square rounded-lg border border-dashed border-yellow-400/15 flex items-center justify-center text-amber-400/30 text-xs text-center p-3">
            עוד אורות
            <br />
            יתווספו...
          </div>
        </div>

        {/* Detail modal */}
        <AnimatePresence>
          {openId && (() => {
            const sub = MOCK_SUBMISSIONS.find((s) => s.id === openId);
            if (!sub) return null;
            const list = comments[sub.id] ?? [];
            return (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
              >
                <div
                  onClick={() => setOpenId(null)}
                  className="absolute inset-0 backdrop-blur-md"
                  style={{ background: "rgba(5,3,0,0.85)" }}
                />
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 40, opacity: 0 }}
                  className="relative w-full max-w-md max-h-[88vh] overflow-y-auto rounded-t-3xl sm:rounded-3xl border border-yellow-400/25 p-6"
                  style={{
                    background:
                      "linear-gradient(180deg, #1a1000 0%, #0a0700 70%)",
                  }}
                >
                  <button
                    onClick={() => setOpenId(null)}
                    className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/40 border border-yellow-400/20 text-yellow-400 flex items-center justify-center"
                  >
                    ✕
                  </button>
                  <div className="text-center mb-5">
                    <div className="text-4xl mb-2">✨</div>
                    <h3 className="text-yellow-400 font-bold text-lg">
                      {sub.name}
                    </h3>
                    <p className="text-amber-400/60 text-sm">
                      {sub.challenge_title}
                    </p>
                  </div>

                  {/* Comments */}
                  <div className="space-y-2 mb-4">
                    {list.length === 0 ? (
                      <p className="text-amber-400/40 text-xs text-center py-4">
                        עוד אין תגובות — היה הראשון לתת כוח
                      </p>
                    ) : (
                      list.map((c) => (
                        <div
                          key={c.id}
                          className="p-3 rounded-xl border border-yellow-400/10 bg-yellow-400/5"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-6 h-6 rounded-full bg-yellow-400/15 flex items-center justify-center text-xs">
                              💛
                            </div>
                            <span className="text-yellow-100 text-sm font-semibold">
                              {c.name}
                            </span>
                          </div>
                          <p className="text-yellow-100/85 text-sm">{c.text}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add comment */}
                  <div className="flex gap-2">
                    <input
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      placeholder="הגב באהבה..."
                      className="flex-1 bg-black/30 border border-yellow-400/15 rounded-full px-4 py-2 text-yellow-100 placeholder-amber-400/30 text-sm focus:outline-none focus:border-yellow-400/40"
                      onKeyDown={(e) => e.key === "Enter" && postComment(sub.id)}
                    />
                    <button
                      onClick={() => postComment(sub.id)}
                      disabled={!draft.trim()}
                      className="bg-yellow-400 text-black font-bold px-4 py-2 rounded-full text-sm disabled:opacity-40"
                    >
                      שלח
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            );
          })()}
        </AnimatePresence>
      </div>
    </main>
  );
}
