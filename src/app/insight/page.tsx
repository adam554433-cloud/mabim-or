"use client";

import { motion } from "framer-motion";
import SiteNav from "@/components/SiteNav";

const INSIGHTS = [
  {
    text: "מי שמאיר לאחרים — מאיר גם לעצמו, אפילו אם איש לא רואה.",
    source: "מהקהילה",
  },
  {
    text: "המעשה הקטן ביותר עוצמתי יותר מהכוונה הגדולה ביותר.",
    source: "אבי גולן",
  },
  {
    text: "כשנותנים מבלי לצפות — מקבלים יותר מכפי שדמיינו.",
    source: "תמר פרץ",
  },
  {
    text: "השמש לא בוחרת על מי לזרוח. גם אנחנו יכולים.",
    source: "יוסי לוי",
  },
  {
    text: "הקושי של היום הוא המורה של המחר.",
    source: "מהקהילה",
  },
  {
    text: "אם לא נדליק אנחנו — מי כן?",
    source: "מרים כהן",
  },
  {
    text: "אהבה היא לא רגש — היא בחירה יומיומית.",
    source: "רחל שמש",
  },
];

function todaysInsight() {
  const start = new Date("2026-01-01").getTime();
  const today = new Date().setHours(0, 0, 0, 0);
  const daysSince = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  return INSIGHTS[((daysSince % INSIGHTS.length) + INSIGHTS.length) % INSIGHTS.length];
}

export default function InsightPage() {
  const insight = todaysInsight();
  const today = new Date().toLocaleDateString("he-IL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <main className="min-h-screen">
      <SiteNav />
      <div className="max-w-2xl mx-auto px-5 py-10 sm:py-16">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">✨</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-yellow-400 mb-1">
            תובנה יומית
          </h1>
          <p className="text-amber-400/50 text-sm">{today}</p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl p-8 sm:p-10 text-center border border-yellow-400/30"
          style={{
            background:
              "radial-gradient(ellipse at top, rgba(60,38,0,0.7) 0%, rgba(15,9,0,0.7) 70%)",
            boxShadow: "0 0 80px rgba(251,191,36,0.15)",
          }}
        >
          <div className="text-yellow-400/30 text-5xl leading-none mb-3 select-none">
            ״
          </div>
          <p className="text-yellow-100 text-xl sm:text-2xl leading-relaxed font-medium">
            {insight.text}
          </p>
          <div className="text-yellow-400/40 text-5xl leading-none mt-1 select-none">
            ״
          </div>
          <p className="text-amber-400/60 text-sm mt-5">— {insight.source}</p>
        </motion.div>

        <div className="text-center mt-10 text-amber-400/40 text-xs">
          תובנה חדשה כל בוקר. שתף בקהילה רעיון שעלה אצלך.
        </div>
      </div>
    </main>
  );
}
