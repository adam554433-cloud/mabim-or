"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence } from "framer-motion";
import HeroSection from "@/components/HeroSection";
import WeeklyChallenge from "@/components/WeeklyChallenge";
import SubmissionForm from "@/components/SubmissionForm";
import CommunityFeed from "@/components/CommunityFeed";
import AuthModal from "@/components/AuthModal";
import { CURRENT_CHALLENGE, MOCK_SUBMISSIONS, INITIAL_LIT_COUNT } from "@/lib/mockData";
import { Submission } from "@/types";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import type { User } from "@supabase/supabase-js";

const PuzzleGrid = dynamic(() => import("@/components/PuzzleGrid"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[5/4] flex items-center justify-center" style={{ background: "#060300" }}>
      <div className="text-yellow-400/40 text-sm animate-pulse">טוען את הפאזל...</div>
    </div>
  ),
});

export default function HomePage() {
  const [litCount, setLitCount]   = useState(INITIAL_LIT_COUNT);
  const [newLitIdx, setNewLitIdx] = useState<number | null>(null);
  const [subs, setSubs]           = useState<Submission[]>([...MOCK_SUBMISSIONS].reverse());
  const [user, setUser]           = useState<User | null>(null);
  const [showAuth, setShowAuth]   = useState(false);
  const formRef = useRef<HTMLElement | null>(null);

  // Listen to auth state
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  function scrollToForm() {
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  function handleSubmit(name: string, challengeId: string, newIndex: number) {
    setNewLitIdx(newIndex);
    setLitCount((c) => c + 1);
    setSubs((prev) => [
      {
        id: crypto.randomUUID(),
        name,
        challenge_id: challengeId,
        challenge_title: CURRENT_CHALLENGE.title,
        video_url: null,
        puzzle_index: newIndex,
        created_at: new Date().toISOString(),
      },
      ...prev,
    ]);
    setTimeout(() => {
      document.getElementById("puzzle")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 350);
  }

  useEffect(() => {
    if (newLitIdx !== null) {
      const t = setTimeout(() => setNewLitIdx(null), 3200);
      return () => clearTimeout(t);
    }
  }, [newLitIdx]);

  const displayName = user?.user_metadata?.display_name ?? user?.email?.split("@")[0] ?? "";

  return (
    <main className="min-h-screen">

      {/* ── Sticky nav ── */}
      <nav className="sticky top-0 z-40 flex items-center justify-between px-5 py-3.5 backdrop-blur-md border-b border-yellow-400/10" style={{ background: "rgba(10,7,0,0.85)" }}>
        <span className="text-yellow-400 font-extrabold text-base sm:text-lg">
          🕯️ מביאים אור
        </span>
        <div className="flex items-center gap-2 text-sm">
          <Link href="/presentation" className="text-gray-400 hover:text-yellow-400 transition-colors px-1 hidden sm:block">
            איך זה עובד?
          </Link>
          {user ? (
            <Link
              href={`/my-light?name=${encodeURIComponent(displayName)}`}
              className="flex items-center gap-1.5 bg-yellow-400/10 border border-yellow-400/25 text-yellow-400 px-3 py-1.5 rounded-full font-medium transition-all hover:bg-yellow-400/20"
            >
              <span className="w-5 h-5 rounded-full bg-yellow-400 flex items-center justify-center text-black font-bold text-[10px]">
                {displayName[0]?.toUpperCase()}
              </span>
              <span>האור שלי</span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-amber-400/70 hover:text-yellow-400 transition-colors text-sm font-medium hidden sm:block"
              >
                כניסה
              </Link>
              <Link
                href="/login"
                className="bg-yellow-400 active:bg-yellow-500 text-black px-4 py-1.5 rounded-full font-bold transition-all hover:scale-105"
                style={{ boxShadow: "0 0 14px rgba(251,191,36,0.3)" }}
              >
                הצטרף
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* ── Hero ── */}
      <HeroSection litCount={litCount} />

      {/* ── Puzzle ── */}
      <section id="puzzle" className="pb-6">
        <div className="text-center mb-3 px-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-300">הפאזל של עם ישראל</h2>
          <p className="text-gray-600 text-xs sm:text-sm mt-1">
            {litCount.toLocaleString("he-IL")} אורות דולקים
            <span className="hidden sm:inline"> — העבר עם העכבר לראות מי הדליק</span>
            <span className="sm:hidden"> — לחץ על אור לפרטים</span>
          </p>
        </div>
        <div className="border-y border-yellow-400/10 py-3 relative" style={{ background: "linear-gradient(180deg,#080500,#050300)" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%,rgba(251,191,36,0.04) 0%,transparent 70%)" }} />
          <div className="sm:max-h-[420px] sm:overflow-hidden">
            <PuzzleGrid newLitIndex={newLitIdx} litCount={litCount} />
          </div>
        </div>
      </section>

      {/* ── Challenge ── */}
      <WeeklyChallenge challenge={CURRENT_CHALLENGE} onScrollToForm={scrollToForm} />

      {/* ── Form ── */}
      <SubmissionForm challenge={CURRENT_CHALLENGE} onSubmit={handleSubmit} formRef={formRef} />

      {/* ── Community ── */}
      <CommunityFeed submissions={subs} />

      {/* ── Footer ── */}
      <footer className="text-center py-10 text-gray-600 text-sm border-t border-yellow-400/10 px-4">
        <p>מביאים אור — ביחד אנחנו מאירים את העולם 🕯️</p>
        <Link href="/presentation" className="text-yellow-400/40 hover:text-yellow-400 transition-colors mt-2 inline-block">
          איך זה עובד?
        </Link>
      </footer>

      {/* ── Auth Modal ── */}
      <AnimatePresence>
        {showAuth && (
          <AuthModal
            onClose={() => setShowAuth(false)}
            onSuccess={() => setShowAuth(false)}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
