"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import HeroSection from "@/components/HeroSection";
import WeeklyChallenge from "@/components/WeeklyChallenge";
import SubmissionForm from "@/components/SubmissionForm";
import CommunityFeed from "@/components/CommunityFeed";
import SiteNav from "@/components/SiteNav";
import WelcomeModal from "@/components/WelcomeModal";
import BgMusic from "@/components/BgMusic";
import MilestoneBar from "@/components/MilestoneBar";
import FlySpark from "@/components/fx/FlySpark";
import CoreOrb from "@/components/fx/CoreOrb";
import { SparkIcon, SunriseIcon, HeartIcon, LightbulbIcon } from "@/components/icons";
import { CURRENT_CHALLENGE, MOCK_SUBMISSIONS, INITIAL_LIT_COUNT } from "@/lib/mockData";
import { Submission, Challenge } from "@/types";
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

function StepBadge({ label }: { n?: number; label: string }) {
  return (
    <div className="flex items-center justify-center mb-3">
      <span className="text-amber-400/80 text-base sm:text-lg tracking-[0.22em] font-semibold">
        {label}
      </span>
    </div>
  );
}

export default function HomePage() {
  const [litCount, setLitCount]   = useState(INITIAL_LIT_COUNT);
  const [newLitIdx, setNewLitIdx] = useState<number | null>(null);
  const [subs, setSubs]           = useState<Submission[]>([...MOCK_SUBMISSIONS].reverse());
  const [user, setUser]           = useState<User | null | undefined>(undefined);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const formRef = useRef<HTMLElement | null>(null);

  // Active challenge comes from the DB (admin-managed); fall back to mock data.
  const current = challenges[0] ?? CURRENT_CHALLENGE;

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetch("/api/challenges")
      .then((r) => r.json())
      .then((d) => Array.isArray(d.challenges) && setChallenges(d.challenges))
      .catch(() => {});
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
        challenge_title: current.title,
        video_url: null,
        media_url: null,
        media_type: null,
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
  const isGuest = user === null;
  const isLoggedIn = !!user;

  // ─── Guest view: only the central light body + sticky inspiration CTA ───
  if (isGuest) {
    return (
      <main className="min-h-screen pb-16">
        <SiteNav />
        <BgMusic />
        <HeroSection
          litCount={litCount}
          ctaHref="/login"
          ctaNote="רישום קצר וחינם — ונותן לכם נקודה משלכם בפאזל המרכזי."
        />

        {/* Challenge — visible to guests (read-only) */}
        <section id="challenge" className="pt-6 scroll-mt-20">
          <StepBadge n={1} label="האתגר השבועי" />
          <WeeklyChallenge
            challenge={current}
            onScrollToForm={() => {
              document
                .getElementById("join-end")
                ?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
          />
        </section>

        <section id="puzzle" className="pt-10 pb-6">
          {/* Animation above the title */}
          <div className="flex items-center justify-center mb-2 relative z-10 pointer-events-none">
            <CoreOrb intensity={litCount / 50000} size={110} />
          </div>
          <div className="text-center mb-3 px-4">
            <h2 className="text-lg sm:text-xl font-semibold text-amber-100/90">
              גוף האור המרכזי
            </h2>
            <p className="text-amber-200/50 text-xs sm:text-sm mt-1">
              {litCount.toLocaleString("he-IL")} אורות כבר דולקים
            </p>
          </div>
          <div className="border-y border-yellow-400/20 py-3 relative" style={{ background: "linear-gradient(180deg,#0d0900,#070400)" }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%,rgba(251,191,36,0.10) 0%,transparent 70%)" }} />
            <div className="sm:max-h-[420px] sm:overflow-hidden">
              <PuzzleGrid newLitIndex={null} litCount={litCount} />
            </div>
          </div>
          {/* The dots aren't individually linkable here — open the full puzzle */}
          <div className="flex justify-center mt-4">
            <Link
              href="/puzzle/board"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-yellow-400 hover:text-yellow-300 transition-colors px-4 py-2 rounded-full border border-yellow-400/25"
              style={{ background: "rgba(251,191,36,0.06)" }}
            >
              פתחו את הפאזל המלא ←
            </Link>
          </div>
          <div className="mt-6 px-4">
            <MilestoneBar litCount={litCount} />
          </div>
        </section>

        {/* Inspiration banner + join CTA at the end of the page */}
        <section id="join-end" className="max-w-xl mx-auto px-5 mt-10 mb-4 text-center scroll-mt-20">
          <div className="flex justify-center text-yellow-400 mb-3 candle-flicker"><SparkIcon size={40} /></div>
          <h3 className="text-2xl font-bold text-yellow-400 mb-3">
            רוצה להאיר נקודה משלך?
          </h3>
          <p className="text-yellow-100/70 leading-relaxed mb-6">
            כדי להשתתף באתגר השבועי, לראות אחרים, ולהדליק נקודה משלך בפאזל —
            צריך להירשם תחילה. רישום קצר, חינם.
          </p>
          <Link
            href="/login"
            className="inline-block bg-yellow-400 active:bg-yellow-500 text-black font-bold px-8 py-4 rounded-full text-lg hover:scale-105 transition-all"
            style={{ boxShadow: "0 0 24px rgba(251,191,36,0.4)" }}
          >
            הצטרפו להאיר ←
          </Link>
        </section>
      </main>
    );
  }

  // ─── Loading state ───
  if (user === undefined) {
    return (
      <main className="min-h-screen">
        <SiteNav />
        <div className="text-center text-amber-400/40 pt-32">טוען...</div>
      </main>
    );
  }

  // ─── Logged-in view: step-by-step structure ───
  return (
    <main className="min-h-screen">
      <SiteNav />
      <BgMusic />

      {/* First-time welcome */}
      {isLoggedIn && (
        <WelcomeModal
          name={displayName}
          gender={user?.user_metadata?.gender as "male" | "female" | undefined}
        />
      )}

      <HeroSection litCount={litCount} />

      {/* Step 1 — Challenge */}
      <section id="challenge" className="pt-6 scroll-mt-20">
        <StepBadge n={1} label="האתגר השבועי" />
        <WeeklyChallenge challenge={current} onScrollToForm={scrollToForm} />
      </section>

      {/* Step 2 — Submit */}
      <section id="submit" className="pt-6 scroll-mt-24">
        <StepBadge n={2} label="מימוש האתגר בפועל" />
        <SubmissionForm challenge={current} onSubmit={handleSubmit} formRef={formRef} userName={displayName} challenges={challenges} />
      </section>

      {/* Step 3 — Light up the puzzle */}
      <section id="puzzle" className="pt-8">
        {/* Animation above the title */}
        <div className="flex items-center justify-center mb-2 relative z-10 pointer-events-none">
          <CoreOrb intensity={litCount / 50000} size={120} pulseTrigger={newLitIdx} />
        </div>
        <StepBadge n={3} label="גוף האור המרכזי" />
        <div className="text-center mb-3 px-4">
          <h2 className="text-lg sm:text-xl font-semibold text-amber-100/90">
            הפאזל של עם ישראל
          </h2>
          <p className="text-amber-200/50 text-xs sm:text-sm mt-1">
            {litCount.toLocaleString("he-IL")} אורות דולקים
            <span className="hidden sm:inline"> — העבר עם העכבר לראות מי הדליק</span>
            <span className="sm:hidden"> — לחץ על אור לפרטים</span>
          </p>
        </div>
        <div className="border-y border-yellow-400/20 py-3 relative" style={{ background: "linear-gradient(180deg,#0d0900,#070400)" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%,rgba(251,191,36,0.10) 0%,transparent 70%)" }} />
          <div className="sm:max-h-[420px] sm:overflow-hidden relative">
            <PuzzleGrid newLitIndex={newLitIdx} litCount={litCount} />
            <FlySpark
              trigger={newLitIdx}
              targetXPct={newLitIdx !== null ? ((newLitIdx % 250) / 250) * 100 : 50}
              targetYPct={newLitIdx !== null ? (Math.floor(newLitIdx / 250) / 200) * 100 : 50}
            />
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <Link
            href="/puzzle/board"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-yellow-400 hover:text-yellow-300 transition-colors px-4 py-2 rounded-full border border-yellow-400/25"
            style={{ background: "rgba(251,191,36,0.06)" }}
          >
            פתחו את הפאזל המלא ←
          </Link>
        </div>
        <div className="mt-6 px-4">
          <MilestoneBar litCount={litCount} />
        </div>
      </section>

      {/* Step 4 — Next step (insight, gratitude, history) */}
      <section className="py-12 px-4">
        <StepBadge n={4} label="לשלב הבא" />
        <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: "/puzzle/insight", Icon: LightbulbIcon, title: "תובנה יומית", desc: "התובנה של היום" },
            { href: "/puzzle/gratitude", Icon: SunriseIcon, title: "הודיה", desc: "על מה אתה אסיר תודה?" },
            { href: "/profile", Icon: HeartIcon, title: "מה עשיתי עד כה", desc: "ההיסטוריה שלי" },
          ].map((c) => (
            <Link
              key={c.href}
              href={c.href}
              className="group rounded-2xl p-5 text-right border border-yellow-400/15 hover:border-yellow-400/40 transition-all hover:scale-[1.02]"
              style={{
                background:
                  "linear-gradient(135deg, rgba(40,25,0,0.6) 0%, rgba(10,7,0,0.4) 100%)",
              }}
            >
              <div className="text-yellow-400 mb-2"><c.Icon size={30} /></div>
              <h3 className="text-yellow-400 font-bold text-base mb-1">{c.title}</h3>
              <p className="text-amber-400/60 text-xs leading-relaxed">{c.desc}</p>
              <div className="mt-3 text-yellow-400/60 text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                כניסה ←
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Community feed */}
      <CommunityFeed submissions={subs} />

      <footer className="text-center py-10 text-gray-600 text-sm border-t border-yellow-400/10 px-4">
        <p className="inline-flex items-center justify-center gap-1.5">
          מביאים אור — ביחד אנחנו מאירים את העולם
          <span className="text-yellow-400/70"><SparkIcon size={15} /></span>
        </p>
        <Link href="/about" className="text-yellow-400/40 hover:text-yellow-400 transition-colors mt-2 inline-block">
          אודות הפרויקט
        </Link>
      </footer>
    </main>
  );
}
