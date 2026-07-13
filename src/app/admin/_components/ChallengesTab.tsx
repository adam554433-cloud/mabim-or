"use client";

import { useEffect, useState } from "react";
import { Challenge } from "@/types";
import { Btn, Card, fmtDate, inputStyle } from "./ui";

const EMPTY = { id: "", title: "", description: "", start_date: "", end_date: "" };

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function isActive(c: Challenge): boolean {
  const t = todayISO();
  const start = (c.start_date ?? c.week_start ?? "").slice(0, 10);
  const end = (c.end_date ?? "").slice(0, 10);
  return (!start || start <= t) && (!end || end >= t);
}

export default function ChallengesTab() {
  const [rows, setRows] = useState<Challenge[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/challenges");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRows(data.challenges);
    } catch (e) {
      setError(e instanceof Error ? e.message : "שגיאה");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const editing = form.id !== "";

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim() || !form.start_date) {
      setError("כותרת ותאריך התחלה הם חובה");
      return;
    }
    if (form.end_date && form.end_date < form.start_date) {
      setError("תאריך הסיום חייב להיות אחרי תאריך ההתחלה");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/challenges", {
        method: editing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setForm(EMPTY);
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "שגיאה");
    } finally {
      setSaving(false);
    }
  }

  async function remove(c: Challenge) {
    if (!confirm(`למחוק את האתגר "${c.title}"?`)) return;
    const res = await fetch("/api/admin/challenges", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: c.id }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "שגיאה במחיקה");
      return;
    }
    load();
  }

  return (
    <div className="space-y-6">
      <Card>
        <h3 className="font-bold mb-3">{editing ? "עריכת אתגר" : "אתגר חדש"}</h3>
        <form onSubmit={save} className="space-y-3">
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="כותרת האתגר"
            className="w-full rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none text-sm"
            style={inputStyle}
          />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="תיאור"
            rows={2}
            className="w-full rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none text-sm"
            style={inputStyle}
          />
          <div className="grid grid-cols-2 gap-3">
            <label className="text-xs text-amber-200/60">
              עולה לאתר
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                className="mt-1 w-full rounded-xl px-3 py-2.5 text-white focus:outline-none text-sm"
                style={{ ...inputStyle, colorScheme: "dark" }}
              />
            </label>
            <label className="text-xs text-amber-200/60">
              יורד מהאתר (אופציונלי)
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                className="mt-1 w-full rounded-xl px-3 py-2.5 text-white focus:outline-none text-sm"
                style={{ ...inputStyle, colorScheme: "dark" }}
              />
            </label>
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-2">
            <Btn type="submit" disabled={saving}>
              {saving ? "שומר…" : editing ? "עדכן" : "הוסף"}
            </Btn>
            {editing && (
              <Btn variant="ghost" onClick={() => setForm(EMPTY)}>
                ביטול
              </Btn>
            )}
          </div>
        </form>
      </Card>

      {loading ? (
        <p className="text-amber-200/50">טוען…</p>
      ) : (
        <div className="space-y-3">
          {rows.map((c) => (
            <Card key={c.id} className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold">{c.title}</span>
                  {isActive(c) && (
                    <span className="text-[10px] bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded">
                      פעיל עכשיו
                    </span>
                  )}
                </div>
                <div className="text-amber-200/50 text-xs truncate">{c.description}</div>
                <div className="text-amber-300/40 text-xs mt-0.5">
                  {fmtDate(c.start_date ?? c.week_start)} ←{" "}
                  {c.end_date ? fmtDate(c.end_date) : "ללא תאריך סיום"}
                </div>
              </div>
              <div className="flex gap-2 shrink-0">
                <Btn
                  variant="ghost"
                  onClick={() =>
                    setForm({
                      id: c.id,
                      title: c.title,
                      description: c.description ?? "",
                      start_date: (c.start_date ?? c.week_start ?? "").slice(0, 10),
                      end_date: (c.end_date ?? "").slice(0, 10),
                    })
                  }
                >
                  ערוך
                </Btn>
                <Btn variant="danger" onClick={() => remove(c)}>
                  מחק
                </Btn>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
