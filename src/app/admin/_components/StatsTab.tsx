"use client";

import { useEffect, useState } from "react";
import { Btn, Card } from "./ui";

interface Stats {
  submissions: number;
  submissionsHidden: number;
  users: number;
  onboarded: number;
  consents: number;
  challenges: number;
}

const CARDS: { key: keyof Stats; label: string }[] = [
  { key: "submissions", label: "הגשות" },
  { key: "submissionsHidden", label: "הגשות מוסתרות" },
  { key: "users", label: "משתמשים רשומים" },
  { key: "onboarded", label: "השלימו הרשמה" },
  { key: "consents", label: "אישרו שיתוף" },
  { key: "challenges", label: "אתגרים" },
];

export default function StatsTab() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.json())
      .then((d) => (d.error ? setError(d.error) : setStats(d)))
      .catch(() => setError("שגיאה בטעינה"));
  }, []);

  if (error) return <p className="text-red-400">{error}</p>;
  if (!stats) return <p className="text-amber-200/50">טוען…</p>;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {CARDS.map((c) => (
          <Card key={c.key} className="text-center">
            <div className="text-3xl font-bold text-yellow-400">
              {stats[c.key].toLocaleString("he-IL")}
            </div>
            <div className="text-amber-200/50 text-xs mt-1">{c.label}</div>
          </Card>
        ))}
      </div>

      <Card>
        <h3 className="font-bold mb-3">ייצוא נתונים</h3>
        <div className="flex gap-3 flex-wrap">
          <a href="/api/admin/export?type=submissions" download>
            <Btn variant="ghost">ייצוא הגשות (CSV)</Btn>
          </a>
          <a href="/api/admin/export?type=users" download>
            <Btn variant="ghost">ייצוא משתמשים (CSV)</Btn>
          </a>
        </div>
      </Card>
    </div>
  );
}
