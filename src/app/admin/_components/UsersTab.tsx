"use client";

import { useEffect, useState } from "react";
import { Card, fmtDate } from "./ui";

interface UserRow {
  id: string;
  display_name: string | null;
  full_name: string | null;
  gender: string | null;
  age: number | null;
  country: string | null;
  city: string | null;
  social_consent: boolean | null;
  age_confirmed_at: string | null;
  onboarded_at: string | null;
  created_at: string | null;
  email: string | null;
}

const GENDER: Record<string, string> = { male: "זכר", female: "נקבה" };

export default function UsersTab() {
  const [rows, setRows] = useState<UserRow[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => (d.error ? setError(d.error) : setRows(d.users)))
      .catch(() => setError("שגיאה בטעינה"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-amber-200/50">טוען…</p>;
  if (error) return <p className="text-red-400">{error}</p>;
  if (rows.length === 0) return <p className="text-amber-200/50">אין משתמשים עדיין.</p>;

  return (
    <Card className="overflow-x-auto" style={{ padding: 0 }}>
      <table className="w-full text-sm text-right border-collapse">
        <thead>
          <tr className="text-amber-200/50 text-xs">
            {["שם", "אימייל", "מין", "גיל", "עיר", "מדינה", "שיתוף", "אישור גיל", "נרשם"].map(
              (h) => (
                <th key={h} className="px-3 py-3 font-medium whitespace-nowrap">
                  {h}
                </th>
              )
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((u) => (
            <tr key={u.id} className="border-t border-amber-400/10">
              <td className="px-3 py-2.5 whitespace-nowrap">
                {u.full_name || u.display_name || "—"}
              </td>
              <td className="px-3 py-2.5 whitespace-nowrap text-amber-200/70">
                {u.email || "—"}
              </td>
              <td className="px-3 py-2.5">{u.gender ? GENDER[u.gender] ?? u.gender : "—"}</td>
              <td className="px-3 py-2.5">{u.age ?? "—"}</td>
              <td className="px-3 py-2.5 whitespace-nowrap">{u.city || "—"}</td>
              <td className="px-3 py-2.5 whitespace-nowrap">{u.country || "—"}</td>
              <td className="px-3 py-2.5">
                {u.social_consent ? (
                  <span className="text-green-400">✓</span>
                ) : (
                  <span className="text-red-400/60">✗</span>
                )}
              </td>
              <td className="px-3 py-2.5 whitespace-nowrap text-xs">
                {u.age_confirmed_at ? "✓" : "—"}
              </td>
              <td className="px-3 py-2.5 whitespace-nowrap text-xs">{fmtDate(u.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
