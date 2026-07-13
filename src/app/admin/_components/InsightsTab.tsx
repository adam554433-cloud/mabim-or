"use client";

import { useEffect, useState } from "react";
import { Insight } from "@/types";
import { Btn, Card, fmtDate, inputStyle } from "./ui";

const EMPTY = { id: "", insight_date: "", text: "", source: "" };

/** Parse bulk lines: "YYYY-MM-DD | text | source" (source optional). */
function parseBulk(raw: string) {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const parts = line.split("|").map((p) => p.trim());
      return { insight_date: parts[0], text: parts[1] ?? "", source: parts[2] ?? "" };
    })
    .filter((r) => /^\d{4}-\d{2}-\d{2}$/.test(r.insight_date) && r.text.length > 0);
}

export default function InsightsTab() {
  const [rows, setRows] = useState<Insight[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<typeof EMPTY>(EMPTY);
  const [bulk, setBulk] = useState("");
  const [msg, setMsg] = useState("");

  async function load() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/insights");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setRows(data.insights);
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

  async function saveSingle(e: React.FormEvent) {
    e.preventDefault();
    if (!form.insight_date || !form.text.trim()) {
      setError("תאריך וטקסט הם חובה");
      return;
    }
    setError("");
    const res = await fetch("/api/admin/insights", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "שגיאה");
      return;
    }
    setForm(EMPTY);
    load();
  }

  async function saveBulk() {
    const parsed = parseBulk(bulk);
    if (parsed.length === 0) {
      setError("לא נמצאו שורות תקינות. פורמט: תאריך | טקסט | מקור");
      return;
    }
    setError("");
    setMsg("");
    const res = await fetch("/api/admin/insights", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bulk: parsed }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error || "שגיאה");
      return;
    }
    setMsg(`נשמרו ${data.inserted} תובנות`);
    setBulk("");
    load();
  }

  async function remove(i: Insight) {
    if (!confirm(`למחוק את התובנה של ${fmtDate(i.insight_date)}?`)) return;
    await fetch("/api/admin/insights", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: i.id }),
    });
    load();
  }

  return (
    <div className="space-y-6">
      {/* Bulk upload */}
      <Card>
        <h3 className="font-bold mb-1">הדבקה מרוכזת</h3>
        <p className="text-amber-200/50 text-xs mb-3">
          שורה לכל תובנה, בפורמט: <span dir="ltr">YYYY-MM-DD | הטקסט | המקור</span> (המקור
          אופציונלי). תאריך קיים יתעדכן.
        </p>
        <textarea
          value={bulk}
          onChange={(e) => setBulk(e.target.value)}
          rows={5}
          dir="ltr"
          placeholder={"2026-06-10 | מעט מן האור דוחה הרבה מן החושך | התניא\n2026-06-11 | אסור להתייאש | רבי נחמן"}
          className="w-full rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none text-sm font-mono"
          style={inputStyle}
        />
        <div className="flex items-center gap-3 mt-3">
          <Btn onClick={saveBulk} disabled={!bulk.trim()}>
            שמור הכל
          </Btn>
          {msg && <span className="text-green-400 text-sm">{msg}</span>}
        </div>
      </Card>

      {/* Single add / edit */}
      <Card>
        <h3 className="font-bold mb-3">{editing ? "עריכת תובנה" : "הוספת תובנה בודדת"}</h3>
        <form onSubmit={saveSingle} className="space-y-3">
          <input
            type="date"
            value={form.insight_date}
            onChange={(e) => setForm({ ...form, insight_date: e.target.value })}
            className="w-full rounded-xl px-4 py-2.5 text-white focus:outline-none text-sm"
            style={{ ...inputStyle, colorScheme: "dark" }}
          />
          <textarea
            value={form.text}
            onChange={(e) => setForm({ ...form, text: e.target.value })}
            placeholder="טקסט התובנה"
            rows={2}
            className="w-full rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none text-sm"
            style={inputStyle}
          />
          <input
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            placeholder="מקור (אופציונלי)"
            className="w-full rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none text-sm"
            style={inputStyle}
          />
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <div className="flex gap-2">
            <Btn type="submit">{editing ? "עדכן" : "הוסף"}</Btn>
            {editing && (
              <Btn variant="ghost" onClick={() => setForm(EMPTY)}>
                ביטול
              </Btn>
            )}
          </div>
        </form>
      </Card>

      {/* List */}
      {loading ? (
        <p className="text-amber-200/50">טוען…</p>
      ) : rows.length === 0 ? (
        <p className="text-amber-200/50">אין תובנות במאגר עדיין.</p>
      ) : (
        <div className="space-y-3">
          {rows.map((i) => (
            <Card key={i.id} className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-amber-300/70 text-xs mb-0.5">{fmtDate(i.insight_date)}</div>
                <div className="text-sm truncate">{i.text}</div>
                {i.source && <div className="text-amber-200/40 text-xs">{i.source}</div>}
              </div>
              <div className="flex gap-2 shrink-0">
                <Btn
                  variant="ghost"
                  onClick={() =>
                    setForm({
                      id: i.id,
                      insight_date: (i.insight_date ?? "").slice(0, 10),
                      text: i.text,
                      source: i.source ?? "",
                    })
                  }
                >
                  ערוך
                </Btn>
                <Btn variant="danger" onClick={() => remove(i)}>
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
