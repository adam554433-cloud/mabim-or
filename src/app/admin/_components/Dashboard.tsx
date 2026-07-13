"use client";

import { useState } from "react";
import StatsTab from "./StatsTab";
import SubmissionsTab from "./SubmissionsTab";
import ChallengesTab from "./ChallengesTab";
import InsightsTab from "./InsightsTab";
import UsersTab from "./UsersTab";
import AgreementsTab from "./AgreementsTab";

type TabKey = "stats" | "submissions" | "challenges" | "insights" | "users" | "agreements";

const TABS: { key: TabKey; label: string }[] = [
  { key: "stats", label: "סטטיסטיקה" },
  { key: "submissions", label: "הגשות" },
  { key: "challenges", label: "אתגרים" },
  { key: "insights", label: "תובנות יומיות" },
  { key: "users", label: "משתמשים" },
  { key: "agreements", label: "הסכמי משפיענים" },
];

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<TabKey>("stats");

  async function logout() {
    await fetch("/api/admin/auth/logout", { method: "POST" });
    onLogout();
  }

  return (
    <div className="min-h-screen px-4 sm:px-6 py-6 max-w-6xl mx-auto">
      <header className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">ניהול המערכת</h1>
          <p className="text-amber-200/40 text-xs mt-0.5">ניצוצות אור בפעולה</p>
        </div>
        <button
          onClick={logout}
          className="text-amber-300/60 hover:text-yellow-400 text-sm transition-colors"
        >
          התנתק
        </button>
      </header>

      <nav className="flex gap-2 flex-wrap mb-6">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className="rounded-full px-4 py-2 text-sm font-semibold transition-all"
            style={{
              background: tab === t.key ? "rgba(251,191,36,1)" : "rgba(251,191,36,0.07)",
              color: tab === t.key ? "#000" : "rgba(253,228,148,0.75)",
              border: "1px solid rgba(251,191,36,0.2)",
            }}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === "stats" && <StatsTab />}
      {tab === "submissions" && <SubmissionsTab />}
      {tab === "challenges" && <ChallengesTab />}
      {tab === "insights" && <InsightsTab />}
      {tab === "users" && <UsersTab />}
      {tab === "agreements" && <AgreementsTab />}
    </div>
  );
}
