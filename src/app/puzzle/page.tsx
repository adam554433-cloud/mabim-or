"use client";

import dynamic from "next/dynamic";
import SiteNav from "@/components/SiteNav";
import MilestoneBar from "@/components/MilestoneBar";
import CoreOrb from "@/components/fx/CoreOrb";
import { INITIAL_LIT_COUNT } from "@/lib/mockData";

const PuzzleGrid = dynamic(() => import("@/components/PuzzleGrid"), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[5/4] flex items-center justify-center" style={{ background: "#060300" }}>
      <div className="text-yellow-400/40 text-sm animate-pulse">טוען את הפאזל...</div>
    </div>
  ),
});

export default function PuzzlePage() {
  const litCount = INITIAL_LIT_COUNT;

  return (
    <main className="min-h-screen">
      <SiteNav />

      <section id="puzzle" className="pt-8 pb-6">
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
          <PuzzleGrid newLitIndex={null} litCount={litCount} />
        </div>
        <div className="mt-6 px-4">
          <MilestoneBar litCount={litCount} />
        </div>
      </section>
    </main>
  );
}
