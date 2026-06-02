"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
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
  const formRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
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
  const isGuest = user === null;
  const isLoggedIn = !!user;

  // ─── Guest view: only the central light body + sticky inspiration CTA ───
  if (isGuest) {
    return (
      <main className="min-h-screen pb-32">
        <SiteNav />
        <BgMusic />
        <HeroSection litCount={litCount} ctaHref="/login" />

        {/* Challenge — visible to guests (read-only) */}
        <section id="challenge" className="pt-6 scroll-mt-20">
          <StepBadge n={1} label="האתגר השבועי" />
          <WeeklyChallenge
            challenge={CURRENT_CHALLENGE}
            onScrollToForm={() => {
              document
                .getElementById("guest-cta")
                ?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
          />
        </section>

        {/* Guest CTA — stands in for the form */}
        <section id="guest-cta" className="pt-8 px-5">
          <StepBadge n={2} label="הצטרפו לאתגר השבוע" />
          <div className="max-w-xl mx-auto">
            <div
              className="rounded-2xl p-6 sm:p-8 text-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(40,25,0,0.9), rgba(15,10,0,0.85))",
                border: "1px solid rgba(251,191,36,0.35)",
                boxShadow: "0 0 40px rgba(251,191,36,0.10)",
              }}
            >
              <div className="flex justify-center text-yellow-400 mb-3 candle-flicker"><SparkIcon size={40} /></div>
              <h3 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-2">
                כדי להשתתף — צריך להירשם
              </h3>
              <p className="text-yellow-100/70 text-sm sm:text-base mb-5 leading-relaxed">
                רישום קצר וחינם. עוזר לנו לדעת מי הדליק את האור — ונותן לכם
                נקודה משלכם בפאזל המרכזי.
              </p>
              <Link
                href="/login"
                className="inline-block bg-yellow-400 active:bg-yellow-500 text-black font-bold px-6 py-3 rounded-full hover:scale-105 transition-all"
                style={{ boxShadow: "0 0 24px rgba(251,191,36,0.35)" }}
              >
                הצטרפו לאתגר השבוע ←
              </Link>
            </div>
          </div>
        </section>

        <section id="puzzle" className="pt-10 pb-6">
          <div className="text-center mb-3 px-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-300">
              גוף האור המרכזי
            </h2>
            <p className="text-gray-600 text-xs sm:text-sm mt-1">
              {litCount.toLocaleString("he-IL")} אורות כבר דולקים
            </p>
          </div>
          <div className="flex items-center justify-center -mb-6 sm:-mb-10 relative z-10 pointer-events-none">
            <CoreOrb intensity={litCount / 50000} size={110} />
          </div>
          <div className="border-y border-yellow-400/10 py-3 relative" style={{ background: "linear-gradient(180deg,#080500,#050300)" }}>
            <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%,rgba(251,191,36,0.04) 0%,transparent 70%)" }} />
            <div className="sm:max-h-[420px] sm:overflow-hidden">
              <PuzzleGrid newLitIndex={null} litCount={litCount} />
            </div>
          </div>
          <div className="mt-6 px-4">
            <MilestoneBar litCount={litCount} />
          </div>
        </section>

        {/* Inspiration banner */}
        <div className="max-w-xl mx-auto px-5 mt-10 text-center">
          <div className="flex justify-center text-yellow-400 mb-3 candle-flicker"><SparkIcon size={40} /></div>
          <h3 className="text-2xl font-bold text-yellow-400 mb-3">
            רוצה להאיר נקודה משלך?
          </h3>
          <p className="text-yellow-100/70 leading-relaxed">
            כדי להשתתף באתגר השבועי, לראות אחרים, ולהדליק נקודה משלך בפאזל —
            צריך להירשם תחילה. רישום קצר, חינם.
          </p>
        </div>

        {/* Sticky CTA */}
        <motion.div
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="fixed bottom-16 md:bottom-0 left-0 right-0 z-30 px-4 pb-5 pt-6"
          style={{ background: "linear-gradient(to top, #0a0700 70%, transparent)" }}
        >
          <div
            className="max-w-md mx-auto rounded-2xl p-4 flex items-center gap-3"
            style={{
              background: "linear-gradient(135deg,#1e1200,#0d0800)",
              border: "1px solid rgba(251,191,36,0.4)",
              boxShadow: "0 0 40px rgba(251,191,36,0.18)",
            }}
          >
            <div className="text-yellow-400"><SparkIcon size={28} /></div>
            <div className="flex-1 text-right">
              <p className="text-yellow-100 font-bold text-sm">
                הצטרפו וקבלו נקודה משלכם
              </p>
              <p className="text-amber-400/60 text-xs">
                בחינם — שייכות אמיתית לקהילה
              </p>
            </div>
            <Link
              href="/login"
              className="bg-yellow-400 text-black font-bold px-4 py-2 rounded-full text-sm whitespace-nowrap"
            >
              הצטרפו
            </Link>
          </div>
        </motion.div>
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
        <WeeklyChallenge challenge={CURRENT_CHALLENGE} onScrollToForm={scrollToForm} />
      </section>

      {/* Step 2 — Submit */}
      <section className="pt-6">
        <StepBadge n={2} label="מימוש האתגר בפועל" />
        <SubmissionForm challenge={CURRENT_CHALLENGE} onSubmit={handleSubmit} formRef={formRef} />
      </section>

      {/* Step 3 — Light up the puzzle */}
      <section id="puzzle" className="pt-8">
        <StepBadge n={3} label="גוף האור המרכזי" />
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
        <div className="flex items-center justify-center -mb-6 sm:-mb-10 relative z-10 pointer-events-none">
          <CoreOrb intensity={litCount / 50000} size={120} pulseTrigger={newLitIdx} />
        </div>
        <div className="border-y border-yellow-400/10 py-3 relative" style={{ background: "linear-gradient(180deg,#080500,#050300)" }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 50%,rgba(251,191,36,0.04) 0%,transparent 70%)" }} />
          <div className="sm:max-h-[420px] sm:overflow-hidden relative">
            <PuzzleGrid newLitIndex={newLitIdx} litCount={litCount} />
            <FlySpark
              trigger={newLitIdx}
              targetXPct={newLitIdx !== null ? ((newLitIdx % 250) / 250) * 100 : 50}
              targetYPct={newLitIdx !== null ? (Math.floor(newLitIdx / 250) / 200) * 100 : 50}
            />
          </div>
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
            { href: "/insight", Icon: LightbulbIcon, title: "תובנה יומית", desc: "התובנה של היום" },
            { href: "/gratitude", Icon: SunriseIcon, title: "הודיה", desc: "על מה אתה אסיר תודה?" },
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
