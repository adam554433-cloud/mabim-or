"use client";

import { useState } from "react";
import type { SVGProps } from "react";
import {
  HomeIcon,
  PuzzleIcon,
  FilmIcon,
  LightbulbIcon,
  SunriseIcon,
} from "@/components/icons";

type Tab = {
  Icon: (p: SVGProps<SVGSVGElement> & { size?: number }) => React.ReactElement;
  label: string;
};

const TABS: Tab[] = [
  { Icon: HomeIcon, label: "בית" },
  { Icon: PuzzleIcon, label: "פאזל" },
  { Icon: FilmIcon, label: "סרטונים" },
  { Icon: LightbulbIcon, label: "תובנה" },
  { Icon: SunriseIcon, label: "הודיה" },
];

type Variant = {
  key: string;
  title: string;
  desc: string;
  height: number; // px
  icon: number; // px
  text: number; // px
  gap: number; // px between icon and label
};

const VARIANTS: Variant[] = [
  {
    key: "current",
    title: "נוכחי",
    desc: "גובה 56 · אייקון 22 · טקסט 10",
    height: 56,
    icon: 22,
    text: 10,
    gap: 2,
  },
  {
    key: "recommended",
    title: "מומלץ (מבט קל)",
    desc: "גובה 64 · אייקון 24 · טקסט 11",
    height: 64,
    icon: 24,
    text: 11,
    gap: 3,
  },
  {
    key: "large",
    title: "גדול",
    desc: "גובה 72 · אייקון 26 · טקסט 12",
    height: 72,
    icon: 26,
    text: 12,
    gap: 4,
  },
];

function NavMock({ v, activeIdx }: { v: Variant; activeIdx: number }) {
  return (
    <nav
      className="w-full backdrop-blur-md rounded-xl overflow-hidden"
      style={{
        background: "rgba(10,7,0,0.92)",
        borderTop: "1px solid rgba(251,191,36,0.12)",
        border: "1px solid rgba(251,191,36,0.12)",
      }}
      aria-label="ניווט לדוגמה"
    >
      <ul className="flex items-stretch">
        {TABS.map((tab, i) => {
          const active = i === activeIdx;
          return (
            <li key={tab.label} className="flex-1">
              <div
                className="flex flex-col items-center justify-center transition-opacity"
                style={{
                  height: v.height,
                  gap: v.gap,
                  color: active ? "#fbbf24" : "rgba(253,228,148,0.55)",
                  opacity: active ? 1 : 0.9,
                }}
              >
                <tab.Icon size={v.icon} />
                <span
                  className="font-medium leading-none"
                  style={{ fontSize: v.text }}
                >
                  {tab.label}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export default function NavbarPreviewPage() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <main
      className="min-h-screen px-4 py-10"
      dir="rtl"
      style={{ background: "linear-gradient(180deg,#0a0700,#050300)" }}
    >
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-yellow-400 mb-1 text-center">
          השוואת גודל ה־nav התחתון
        </h1>
        <p className="text-amber-400/60 text-sm text-center mb-2">
          לחצו על טאב כדי לראות איך נראה מצב פעיל בכל גודל
        </p>

        {/* tab selector */}
        <div className="flex justify-center gap-2 mb-8">
          {TABS.map((t, i) => (
            <button
              key={t.label}
              onClick={() => setActiveIdx(i)}
              className="text-xs px-2.5 py-1 rounded-full transition-all"
              style={{
                background:
                  i === activeIdx ? "rgba(251,191,36,0.2)" : "transparent",
                color:
                  i === activeIdx ? "#fbbf24" : "rgba(253,228,148,0.5)",
                border: "1px solid rgba(251,191,36,0.2)",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="space-y-8">
          {VARIANTS.map((v) => (
            <div key={v.key}>
              <div className="flex items-baseline justify-between mb-2">
                <h2 className="text-yellow-400 font-bold text-base">
                  {v.title}
                </h2>
                <span className="text-amber-400/50 text-xs">{v.desc}</span>
              </div>
              <NavMock v={v} activeIdx={activeIdx} />
            </div>
          ))}
        </div>

        <p className="text-amber-400/40 text-xs text-center mt-10 leading-relaxed">
          הצגה במובייל מדמה את הרוחב האמיתי. ה־nav האמיתי מופיע רק במסכי מובייל
          (md:hidden) — לכן הקטינו את חלון הדפדפן כדי לדמות נייד.
        </p>
      </div>
    </main>
  );
}
