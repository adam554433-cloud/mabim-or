"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";

interface Props {
  onComplete: () => void;
  initialFullName?: string;
}

const COUNTRIES = [
  "ישראל",
  "ארצות הברית",
  "קנדה",
  "אנגליה",
  "צרפת",
  "גרמניה",
  "אוסטרליה",
  "ארגנטינה",
  "ברזיל",
  "מקסיקו",
  "דרום אפריקה",
  "רוסיה",
  "אוקראינה",
  "אחר",
];

const HEBREW_MONTHS = [
  "ינואר",
  "פברואר",
  "מרץ",
  "אפריל",
  "מאי",
  "יוני",
  "יולי",
  "אוגוסט",
  "ספטמבר",
  "אוקטובר",
  "נובמבר",
  "דצמבר",
];

const CURRENT_YEAR = new Date().getFullYear();
const DAYS = Array.from({ length: 31 }, (_, i) => String(i + 1));
const YEARS = Array.from({ length: 100 }, (_, i) => String(CURRENT_YEAR - i));

export default function OnboardingForm({ onComplete, initialFullName = "" }: Props) {
  const [fullName, setFullName] = useState(initialFullName);
  const [gender, setGender] = useState<"male" | "female" | "">("");
  const [bDay, setBDay] = useState("");
  const [bMonth, setBMonth] = useState("");
  const [bYear, setBYear] = useState("");
  const birthDate =
    bDay && bMonth && bYear
      ? `${bYear}-${bMonth.padStart(2, "0")}-${bDay.padStart(2, "0")}`
      : "";
  const [country, setCountry] = useState("ישראל");
  const [city, setCity] = useState("");
  const [consent, setConsent] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const ready =
    fullName.trim().length > 1 &&
    gender !== "" &&
    birthDate !== "" &&
    country !== "" &&
    city.trim().length > 1 &&
    consent &&
    ageConfirmed;

  async function save() {
    if (!ready) return;
    setLoading(true);
    setError("");

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      setError("שגיאה — נסה להתחבר שוב");
      return;
    }

    const nowIso = new Date().toISOString();
    const profile = {
      id: user.id,
      display_name: fullName.trim(),
      full_name: fullName.trim(),
      gender,
      birth_date: birthDate,
      country,
      city: city.trim(),
      social_consent: consent,
      age_confirmed_at: nowIso,
      onboarded_at: nowIso,
    };

    const { error: pErr } = await supabase.from("profiles").upsert(profile);

    await supabase.auth.updateUser({
      data: {
        display_name: fullName.trim(),
        full_name: fullName.trim(),
        gender,
        onboarded: true,
      },
    });

    setLoading(false);
    if (pErr) {
      console.error("[onboarding] profile upsert failed:", pErr);
      setError(`שגיאה בשמירה: ${pErr.message}`);
      return;
    }
    onComplete();
  }

  const inputStyle = {
    background: "rgba(251,191,36,0.07)",
    border: "1px solid rgba(251,191,36,0.2)",
  } as const;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3"
    >
      {/* Full name */}
      <div>
        <label className="block text-amber-200/70 text-xs mb-1 mr-1">שם מלא</label>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="ישראל ישראלי"
          autoFocus
          className="w-full rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none text-base"
          style={inputStyle}
        />
      </div>

      {/* Gender */}
      <div>
        <label className="block text-amber-200/70 text-xs mb-1 mr-1">מין</label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { v: "male" as const, l: "זכר" },
            { v: "female" as const, l: "נקבה" },
          ].map((opt) => {
            const active = gender === opt.v;
            return (
              <button
                key={opt.v}
                type="button"
                onClick={() => setGender(opt.v)}
                className="py-3 rounded-xl font-semibold transition-all"
                style={{
                  background: active ? "#fbbf24" : "rgba(251,191,36,0.07)",
                  color: active ? "#000" : "#fff",
                  border: active
                    ? "1px solid #fbbf24"
                    : "1px solid rgba(251,191,36,0.2)",
                }}
              >
                {opt.l}
              </button>
            );
          })}
        </div>
      </div>

      {/* Birth date */}
      <div>
        <label className="block text-amber-200/70 text-xs mb-1 mr-1">תאריך לידה</label>
        <div className="grid grid-cols-3 gap-2">
          <select
            value={bDay}
            onChange={(e) => setBDay(e.target.value)}
            className="w-full rounded-xl px-3 py-3 text-white focus:outline-none text-base"
            style={inputStyle}
          >
            <option value="" style={{ background: "#1e1200", color: "#fff" }}>
              יום
            </option>
            {DAYS.map((d) => (
              <option key={d} value={d} style={{ background: "#1e1200", color: "#fff" }}>
                {d}
              </option>
            ))}
          </select>
          <select
            value={bMonth}
            onChange={(e) => setBMonth(e.target.value)}
            className="w-full rounded-xl px-3 py-3 text-white focus:outline-none text-base"
            style={inputStyle}
          >
            <option value="" style={{ background: "#1e1200", color: "#fff" }}>
              חודש
            </option>
            {HEBREW_MONTHS.map((m, i) => (
              <option
                key={m}
                value={String(i + 1)}
                style={{ background: "#1e1200", color: "#fff" }}
              >
                {m}
              </option>
            ))}
          </select>
          <select
            value={bYear}
            onChange={(e) => setBYear(e.target.value)}
            className="w-full rounded-xl px-3 py-3 text-white focus:outline-none text-base"
            style={inputStyle}
          >
            <option value="" style={{ background: "#1e1200", color: "#fff" }}>
              שנה
            </option>
            {YEARS.map((y) => (
              <option key={y} value={y} style={{ background: "#1e1200", color: "#fff" }}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Country */}
      <div>
        <label className="block text-amber-200/70 text-xs mb-1 mr-1">מדינה</label>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          className="w-full rounded-xl px-4 py-3 text-white focus:outline-none text-base"
          style={inputStyle}
        >
          {COUNTRIES.map((c) => (
            <option key={c} value={c} style={{ background: "#1e1200", color: "#fff" }}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* City */}
      <div>
        <label className="block text-amber-200/70 text-xs mb-1 mr-1">עיר</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="ירושלים"
          className="w-full rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none text-base"
          style={inputStyle}
        />
      </div>

      {/* Age confirmation 13+ */}
      <label
        className="flex items-start gap-3 rounded-xl p-3 cursor-pointer mt-4"
        style={{
          background: "rgba(255,211,69,0.05)",
          border: `1px solid ${ageConfirmed ? "#FFD345" : "rgba(255,211,69,0.2)"}`,
        }}
      >
        <input
          type="checkbox"
          checked={ageConfirmed}
          onChange={(e) => setAgeConfirmed(e.target.checked)}
          className="mt-1 w-5 h-5 accent-amber-400 shrink-0"
        />
        <span className="text-sm text-amber-100/80 leading-relaxed">
          אני מאשר/ת שאני בן/בת <strong>13 ומעלה</strong>, ושקראתי את ה
          <a
            href="/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-yellow-400 underline"
          >
            תקנון
          </a>
          .
        </span>
      </label>

      {/* Consent */}
      <label
        className="flex items-start gap-3 rounded-xl p-3 cursor-pointer"
        style={{
          background: "rgba(251,191,36,0.05)",
          border: `1px solid ${consent ? "#fbbf24" : "rgba(251,191,36,0.2)"}`,
        }}
      >
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 w-5 h-5 accent-amber-400 shrink-0"
        />
        <span className="text-sm text-amber-100/80 leading-relaxed">
          אני מאשר/ת שהתוכן שאעלה (סרטונים, תמונות וטקסטים) יוכל להופיע בכל
          ערוצי הסושיאל של הקהילה.
        </span>
      </label>

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <button
        onClick={save}
        disabled={loading || !ready}
        className="w-full font-bold py-4 rounded-full text-lg disabled:opacity-40 transition-all hover:scale-[1.02] active:scale-[0.98]"
        style={{
          background: "#fbbf24",
          color: "#000",
          boxShadow: "0 0 24px rgba(251,191,36,0.35)",
        }}
      >
        {loading ? "שומר..." : "אישור והמשך ✨"}
      </button>
    </motion.div>
  );
}
