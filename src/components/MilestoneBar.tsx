"use client";

import { motion } from "framer-motion";

type Milestone = {
  target: number;
  label: string;
  reward: string;
};

const MILESTONES: Milestone[] = [
  { target: 1000, label: "1,000 אורות", reward: "ספר קהילתי דיגיטלי של מעשי האור הראשונים" },
  { target: 5000, label: "5,000 אורות", reward: "אירוע קהילתי ראשון — שיר משותף בירושלים" },
  { target: 10000, label: "10,000 אורות", reward: "תרומה משותפת לעמותה שהקהילה תבחר" },
  { target: 25000, label: "25,000 אורות", reward: "מצעד אורות ארצי בערב חנוכה" },
  { target: 50000, label: "50,000 אורות", reward: "הפאזל הושלם — חגיגה לעם ישראל" },
];

export default function MilestoneBar({ litCount }: { litCount: number }) {
  const next = MILESTONES.find((m) => m.target > litCount) ?? MILESTONES[MILESTONES.length - 1];
  const prev = [...MILESTONES].reverse().find((m) => m.target <= litCount);
  const from = prev?.target ?? 0;
  const span = next.target - from || 1;
  const pct = Math.min(100, Math.max(0, ((litCount - from) / span) * 100));
  const remaining = Math.max(0, next.target - litCount);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55 }}
      className="mx-auto max-w-2xl px-4 sm:px-6 py-4 rounded-2xl border border-yellow-400/15"
      style={{
        background:
          "linear-gradient(135deg, rgba(40,25,0,0.6) 0%, rgba(10,7,0,0.4) 100%)",
      }}
    >
      <div className="flex items-baseline justify-between gap-3 mb-2.5">
        <div className="text-xs text-amber-400/60 font-semibold tracking-wide">
          האבן הבאה לקהילה
        </div>
        <div className="text-xs text-amber-400/40">
          {litCount.toLocaleString("he-IL")} / {next.target.toLocaleString("he-IL")}
        </div>
      </div>

      <div className="text-right mb-3">
        <div className="text-yellow-100 font-bold text-sm sm:text-base">
          🎁 {next.reward}
        </div>
        <div className="text-amber-400/60 text-xs mt-0.5">
          עוד {remaining.toLocaleString("he-IL")} אורות עד {next.label}
        </div>
      </div>

      <div className="h-2.5 rounded-full overflow-hidden bg-yellow-400/10 relative">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg,#fbbf24,#fde68a)",
            boxShadow: "0 0 12px rgba(251,191,36,0.5)",
          }}
        />
      </div>
    </motion.div>
  );
}
