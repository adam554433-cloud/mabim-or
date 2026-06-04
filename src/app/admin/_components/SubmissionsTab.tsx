"use client";

import { useEffect, useState } from "react";
import { Submission } from "@/types";
import { Btn, Card, fmtDate } from "./ui";

type Row = Submission & { hidden?: boolean };

export default function SubmissionsTab() {
  const [rows, setRows] = useState<Row[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/submissions");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRows(data.submissions);
    } catch (e) {
      setError(e instanceof Error ? e.message : "שגיאה");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function toggleHide(row: Row) {
    const next = !row.hidden;
    setRows((rs) => rs.map((r) => (r.id === row.id ? { ...r, hidden: next } : r)));
    await fetch("/api/admin/submissions", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: row.id, hidden: next }),
    });
  }

  async function remove(row: Row) {
    if (!confirm(`למחוק לצמיתות את ההגשה של ${row.name}?`)) return;
    setRows((rs) => rs.filter((r) => r.id !== row.id));
    await fetch("/api/admin/submissions", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: row.id }),
    });
  }

  if (loading) return <p className="text-amber-200/50">טוען…</p>;
  if (error) return <p className="text-red-400">{error}</p>;
  if (rows.length === 0) return <p className="text-amber-200/50">אין הגשות עדיין.</p>;

  return (
    <div className="space-y-3">
      {rows.map((row) => (
        <Card
          key={row.id}
          className="flex items-center justify-between gap-4"
          style={row.hidden ? { opacity: 0.5 } : undefined}
        >
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-bold">{row.name}</span>
              <span className="text-amber-300/40 text-xs">#{row.puzzle_index + 1}</span>
              {row.hidden && (
                <span className="text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.5 rounded">
                  מוסתר
                </span>
              )}
            </div>
            <div className="text-amber-200/50 text-xs truncate">
              {row.challenge_title || "—"} · {fmtDate(row.created_at)}
            </div>
            <div className="flex gap-3 mt-1 text-xs">
              {row.media_url && (
                <a
                  href={row.media_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-400/70 hover:text-yellow-400"
                >
                  מדיה
                </a>
              )}
              {row.instagram_url && (
                <a
                  href={row.instagram_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-yellow-400/70 hover:text-yellow-400"
                >
                  אינסטגרם
                </a>
              )}
            </div>
          </div>
          <div className="flex gap-2 shrink-0">
            <Btn variant="ghost" onClick={() => toggleHide(row)}>
              {row.hidden ? "הצג" : "הסתר"}
            </Btn>
            <Btn variant="danger" onClick={() => remove(row)}>
              מחק
            </Btn>
          </div>
        </Card>
      ))}
    </div>
  );
}
