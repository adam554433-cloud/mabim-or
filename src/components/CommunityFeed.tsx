"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Submission } from "@/types";

interface CommunityFeedProps {
  submissions: Submission[];
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60)    return "לפני רגע";
  if (diff < 3600)  return `לפני ${Math.floor(diff / 60)} דק'`;
  if (diff < 86400) return `לפני ${Math.floor(diff / 3600)} שע'`;
  return `לפני ${Math.floor(diff / 86400)} ימים`;
}

const GRADIENTS = [
  "from-yellow-500/20 to-orange-500/10",
  "from-amber-500/20 to-yellow-600/10",
  "from-orange-400/20 to-amber-500/10",
  "from-yellow-400/20 to-amber-400/10",
  "from-amber-600/20 to-orange-600/10",
];
const AVATAR_BG  = ["bg-yellow-400", "bg-orange-400", "bg-amber-500", "bg-yellow-500", "bg-orange-500"];

function SubmissionCard({ s, i }: { s: Submission; i: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: Math.min(i * 0.07, 0.4) }}
      className="flex-shrink-0 w-[76vw] max-w-[300px] sm:w-auto sm:max-w-none snap-start"
    >
      <div className="h-full rounded-2xl overflow-hidden transition-all group" style={{ background: "linear-gradient(135deg, #160f00 0%, #0d0800 100%)", border: "1px solid rgba(251,191,36,0.12)" }}
        onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.borderColor = "rgba(251,191,36,0.3)")}
        onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor = "rgba(251,191,36,0.12)")}>

        {/* Media area */}
        <div className={`relative bg-gradient-to-br ${GRADIENTS[i % GRADIENTS.length]} aspect-[4/3] flex flex-col items-center justify-center overflow-hidden`}>
          {s.video_url ? (
            <video src={s.video_url} className="w-full h-full object-cover" controls />
          ) : (
            <>
              {/* AI-generated heart image as placeholder */}
              <div className="absolute inset-0 opacity-30">
                <Image src="/icons/heart.png" alt="" fill className="object-cover" quality={60} />
              </div>
              <span className="relative text-5xl candle-flicker z-10" style={{ animationDelay: `${i * 0.4}s` }}>
                🕯️
              </span>
              <span className="relative text-white/50 text-xs mt-2 z-10">אור נדלק</span>
            </>
          )}

          {/* Light badge */}
          <div className="absolute top-3 start-3 flex items-center gap-1.5 bg-black/50 backdrop-blur rounded-full px-2.5 py-1">
            <div className="relative w-1.5 h-1.5">
              <div className="absolute inset-0 rounded-full bg-yellow-400 ping-gold" />
              <div className="absolute inset-0 rounded-full bg-yellow-400" />
            </div>
            <span className="text-yellow-400 text-xs font-medium">#{s.puzzle_index + 1}</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-full ${AVATAR_BG[i % AVATAR_BG.length]} flex items-center justify-center text-black font-bold text-sm flex-shrink-0`}>
              {s.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-white text-sm truncate">{s.name}</p>
              <p className="text-gray-500 text-xs truncate">{s.challenge_title}</p>
            </div>
            <span className="text-gray-600 text-xs flex-shrink-0">{timeAgo(s.created_at)}</span>
          </div>

          <button className="mt-3 w-full text-center text-xs text-yellow-400/60 hover:text-yellow-400 active:text-yellow-300 py-2 border border-yellow-400/10 hover:border-yellow-400/25 rounded-xl transition-all">
            כתוב לי מילה ✉️
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function CommunityFeed({ submissions }: CommunityFeedProps) {
  return (
    <section className="py-12 overflow-hidden">
      {/* Header with AI community image */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col items-center mb-6 px-4 gap-3"
      >
        <div className="relative w-16 h-16">
          <Image
            src="/icons/community.png"
            alt="קהילה"
            fill
            className="object-cover rounded-full"
            style={{ boxShadow: "0 0 20px rgba(251,191,36,0.3)" }}
            quality={85}
          />
        </div>
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl font-bold">הקהילה שלנו</h2>
          <p className="text-gray-400 text-sm mt-1">כל אחד מוסיף את האור שלו</p>
        </div>
      </motion.div>

      {/* Mobile: horizontal scroll */}
      <div className="sm:hidden">
        <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory feed-scroll px-4 pb-4">
          {submissions.map((s, i) => <SubmissionCard key={s.id} s={s} i={i} />)}
        </div>
        <p className="text-center text-gray-600 text-xs mt-2">← החלק לראות עוד</p>
      </div>

      {/* Desktop: grid */}
      <div className="hidden sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto px-6">
        {submissions.map((s, i) => <SubmissionCard key={s.id} s={s} i={i} />)}
      </div>
    </section>
  );
}
