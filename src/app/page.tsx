"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import WeeklyChallenge from "@/components/WeeklyChallenge";
import SubmissionForm from "@/components/SubmissionForm";
import CommunityFeed from "@/components/CommunityFeed";
import { CURRENT_CHALLENGE, MOCK_SUBMISSIONS, INITIAL_LIT_COUNT } from "@/lib/mockData";
import { Submission } from "@/types";
import Link from "next/link";

const PuzzleGrid = dynamic(() => import("@/components/PuzzleGrid"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[5/4] bg-[#060610] flex items-center justify-center">
      <div className="text-yellow-400/40 text-sm animate-pulse">טוען את הפאזל...</div>
    </div>
  ),
});

export default function HomePage() {
  const [litCount, setLitCount]   = useState(INITIAL_LIT_COUNT);
  const [newLitIdx, setNewLitIdx] = useState<number | null>(null);
  const [subs, setSubs]           = useState<Submission[]>([...MOCK_SUBMISSIONS].reverse());
  const formRef = useRef<HTMLElement | null>(null);

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

  return (
    <main className="min-h-screen">

      {/* ── Sticky nav ──────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 flex items-center justify-between px-5 py-3.5 backdrop-blur-md border-b border-yellow-400/10" style={{ background: "rgba(10,7,0,0.85)" }}>
        <span className="text-yellow-400 font-extrabold text-base sm:text-lg">
          🕯️ מביאים אור
        </span>
        <div className="flex items-center gap-2 sm:gap-4 text-sm">
          <Link
            href="/presentation"
            className="text-gray-400 hover:text-yellow-400 transition-colors px-1 hidden sm:block"
          >
            איך זה עובד?
          </Link>
          <button
            onClick={scrollToForm}
            className="bg-yellow-400/10 active:bg-yellow-400/20 text-yellow-400 border border-yellow-400/25 px-4 py-1.5 rounded-full transition-all font-medium"
          >
            הצטרף
          </button>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <HeroSection litCount={litCount} />

      {/* ── Puzzle ─────────────────────────────────────────────────── */}
      <section id="puzzle" className="pb-6">
        <div className="text-center mb-3 px-4">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-300">
            הפאזל של עם ישראל
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm mt-1">
            {litCount.toLocaleString("he-IL")} אורות דולקים
            <span className="hidden sm:inline"> — העבר עם העכבר לראות מי הדליק</span>
            <span className="sm:hidden"> — לחץ על אור לפרטים</span>
          </p>
        </div>

        <div className="border-y border-yellow-400/10 py-3 relative" style={{ background: "linear-gradient(180deg, #080500 0%, #050300 100%)" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(251,191,36,0.04) 0%, transparent 70%)" }} />
          <PuzzleGrid newLitIndex={newLitIdx} litCount={litCount} />
        </div>
      </section>

      {/* ── Challenge ──────────────────────────────────────────────── */}
      <WeeklyChallenge challenge={CURRENT_CHALLENGE} onScrollToForm={scrollToForm} />

      {/* ── Form ───────────────────────────────────────────────────── */}
      <SubmissionForm
        challenge={CURRENT_CHALLENGE}
        onSubmit={handleSubmit}
        formRef={formRef}
      />

      {/* ── Community ──────────────────────────────────────────────── */}
      <CommunityFeed submissions={subs} />

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="text-center py-10 text-gray-600 text-sm border-t border-yellow-400/10 px-4">
        <p>מביאים אור — ביחד אנחנו מאירים את העולם 🕯️</p>
        <Link
          href="/presentation"
          className="text-yellow-400/40 hover:text-yellow-400 transition-colors mt-2 inline-block"
        >
          איך זה עובד?
        </Link>
      </footer>
    </main>
  );
}
