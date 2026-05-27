"use client";

import { useEffect, useState } from "react";
import WelcomeModal from "@/components/WelcomeModal";

export default function WelcomePreviewPage() {
  const [name, setName] = useState("אדם");
  const [key, setKey] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    localStorage.removeItem("nitzotzot:welcomed");
    setMounted(true);
  }, []);

  function replay() {
    if (typeof window !== "undefined") {
      localStorage.removeItem("nitzotzot:welcomed");
    }
    setKey((k) => k + 1);
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen w-full flex flex-col items-center justify-center gap-6 p-8"
      style={{ background: "#050300" }}
    >
      <div className="fixed top-4 right-4 z-[60] flex flex-col gap-3 p-4 rounded-2xl border border-yellow-400/20 bg-black/60 backdrop-blur">
        <div className="text-yellow-300 text-sm font-bold">Preview · WelcomeModal</div>
        <label className="flex flex-col gap-1 text-xs text-yellow-100/80">
          שם המשתמש
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-black/60 border border-yellow-400/30 text-yellow-100 text-sm"
          />
        </label>
        <button
          onClick={replay}
          className="px-3 py-1.5 rounded-lg bg-yellow-400 text-black text-sm font-bold"
        >
          הפעל מחדש
        </button>
        <p className="text-amber-400/50 text-[10px] max-w-[200px] leading-tight">
          הדף הזה תמיד פותח את ה־popup, מנקה את ה־localStorage בכל replay
        </p>
      </div>

      {mounted && <WelcomeModal key={key} name={name} />}
    </div>
  );
}
