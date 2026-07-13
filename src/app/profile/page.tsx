"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteNav from "@/components/SiteNav";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { MOCK_SUBMISSIONS, CURRENT_CHALLENGE } from "@/lib/mockData";
import PulseDot from "@/components/fx/PulseDot";
import ProgressConstellation, { ConstellationStep } from "@/components/fx/ProgressConstellation";

const GOLD = "#fbbf24";
const GOLD_DK = "#CAA928";

const PAGE_BG =
  "radial-gradient(ellipse 140% 55% at 50% -5%, #1e1000 0%, #0a0700 55%)";
const CARD_BG = "linear-gradient(135deg,#1e1200,#0d0800)";
const CARD_BORDER = "1px solid rgba(251,191,36,0.22)";
const CARD_SHADOW = "0 0 30px rgba(251,191,36,0.06)";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const [signingOut, setSigningOut] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  async function signOut() {
    setSigningOut(true);
    await supabase.auth.signOut();
    router.push("/");
  }

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      const u = data.user ?? null;
      setUser(u);
      if (u) {
        setAvatarUrl((u.user_metadata?.avatar_url as string) || undefined);
        setDisplayName(
          (u.user_metadata?.display_name as string) ||
            u.email?.split("@")[0] ||
            ""
        );
      }
    });
  }, []);

  function onPickFile() {
    fileRef.current?.click();
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatarUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  async function save() {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: {
        display_name: displayName,
        avatar_url: avatarUrl,
      },
    });
    setSaving(false);
    if (!error) {
      setSavedFlash(true);
      setTimeout(() => setSavedFlash(false), 2000);
    }
  }

  if (user === undefined) {
    return (
      <main className="min-h-screen" style={{ background: PAGE_BG }}>
        <SiteNav />
        <div className="text-center pt-20 text-amber-300/70">טוען...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen" style={{ background: PAGE_BG }}>
        <SiteNav />
        <div className="max-w-md mx-auto px-5 py-20 text-center">
          <div className="text-5xl mb-3">✨</div>
          <h1 className="text-2xl font-extrabold mb-3 text-white">
            הפרופיל האישי שלי
          </h1>
          <p className="text-sm mb-6 text-amber-200/60">
            כדי לראות את הפרופיל — צריך להיות חבר בקהילה.
          </p>
          <Link
            href="/login"
            className="inline-block font-bold px-6 py-3 rounded-full"
            style={{ background: GOLD, color: "#000" }}
          >
            הצטרף
          </Link>
        </div>
      </main>
    );
  }

  const myHistory = MOCK_SUBMISSIONS.filter((s) => s.name === displayName);
  const totalLights = myHistory.length;

  const journey: ConstellationStep[] = [
    { label: "הצטרפת לקהילה", sub: user.email ?? "", done: true },
    {
      label: "האור הראשון שלך",
      sub: totalLights > 0 ? "הדלקת את הנר הראשון" : "ממתין למעשה הראשון",
      done: totalLights > 0,
      active: totalLights === 0,
    },
    {
      label: "שבוע ברצף",
      sub: "5 ימים נוספים והנה — תג ראשון",
      done: false,
      active: totalLights > 0,
    },
    { label: "חבר/ה מאיר/ה", sub: "10 אורות סך הכל", done: false },
    { label: "מאיר/ת קהילה", sub: "מעורב גם בהודיה ובתגובות", done: false },
  ];

  const card = {
    background: CARD_BG,
    border: CARD_BORDER,
    boxShadow: CARD_SHADOW,
  };

  return (
    <main className="min-h-screen" style={{ background: PAGE_BG }}>
      <SiteNav />
      <div className="max-w-2xl mx-auto px-5 py-12">
        <div className="text-center mb-8">
          {/* Avatar with pulse rings */}
          <div
            className="relative inline-flex items-center justify-center mb-4"
            style={{ width: 130, height: 130 }}
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <PulseDot size={104} rings={2} speed={2.8} color={GOLD} />
            </div>
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={displayName}
                className="relative w-24 h-24 rounded-full object-cover border-2"
                style={{
                  borderColor: GOLD,
                  boxShadow: `0 0 30px ${GOLD}66`,
                }}
              />
            ) : (
              <div
                className="relative w-24 h-24 rounded-full border-2 flex items-center justify-center text-5xl"
                style={{
                  borderColor: GOLD,
                  background: "rgba(251,191,36,0.08)",
                  boxShadow: `0 0 30px ${GOLD}44`,
                }}
              >
                ✨
              </div>
            )}
            <button
              onClick={onPickFile}
              className="absolute bottom-2 left-2 w-9 h-9 rounded-full flex items-center justify-center font-bold hover:scale-110 transition-all z-10"
              style={{ background: GOLD, color: "#000" }}
              title="העלה תמונה"
            >
              📷
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={onFile}
            />
          </div>

          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="text-center text-2xl sm:text-3xl font-extrabold bg-transparent border-b focus:outline-none px-2 py-1 max-w-xs text-white"
            style={{
              borderColor: "rgba(251,191,36,0.35)",
            }}
          />
          <p className="text-sm mt-2 text-amber-200/60">{user.email}</p>

          <button
            onClick={save}
            disabled={saving}
            className="mt-4 font-semibold px-5 py-2 rounded-full text-sm transition-all disabled:opacity-50"
            style={{
              background: "rgba(251,191,36,0.08)",
              color: GOLD,
              border: "1px solid rgba(251,191,36,0.35)",
            }}
          >
            {saving ? "שומר..." : savedFlash ? "נשמר ✓" : "שמור שינויים"}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { n: totalLights, l: "אורות שלי" },
            { n: 7, l: "ימים ברצף" },
            { n: 1, l: "תגים" },
          ].map((s) => (
            <div key={s.l} className="rounded-xl p-4 text-center" style={card}>
              <div className="text-3xl font-extrabold" style={{ color: GOLD }}>
                {s.n}
              </div>
              <div className="text-xs mt-1 text-amber-200/60">{s.l}</div>
            </div>
          ))}
        </div>

        {/* Journey */}
        <div className="rounded-2xl p-5 mb-8" style={card}>
          <ProgressConstellation steps={journey} title="המסע שלך" />
        </div>

        {/* History */}
        <h2
          className="text-xs tracking-[0.25em] font-bold mb-3"
          style={{ color: GOLD_DK }}
        >
          מה עשיתי עד כה
        </h2>
        {myHistory.length === 0 ? (
          <div className="rounded-2xl p-6 text-center" style={card}>
            <p className="text-sm mb-3 text-amber-100/70">
              עוד לא הדלקת אור באתגר.
              <br />
              האתגר הנוכחי:{" "}
              <span className="font-bold" style={{ color: GOLD }}>
                {CURRENT_CHALLENGE.title}
              </span>
            </p>
            <Link
              href="/puzzle"
              className="inline-block font-bold px-5 py-2 rounded-full text-sm"
              style={{ background: GOLD, color: "#000" }}
            >
              להתחיל
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {myHistory.map((s) => (
              <motion.div
                key={s.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-3 rounded-xl p-3"
                style={card}
              >
                <div className="text-xl">✨</div>
                <div className="flex-1 text-right">
                  <div className="text-sm font-semibold text-white">
                    {s.challenge_title}
                  </div>
                  <div className="text-xs" style={{ color: GOLD_DK }}>
                    {new Date(s.created_at).toLocaleDateString("he-IL")}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Sign out */}
        <div
          className="mt-12 pt-6 border-t text-center"
          style={{ borderColor: "rgba(251,191,36,0.15)" }}
        >
          <button
            onClick={signOut}
            disabled={signingOut}
            className="text-sm font-medium px-5 py-2 rounded-full transition-all hover:opacity-80 disabled:opacity-50"
            style={{
              background: "transparent",
              color: "rgba(251,191,36,0.7)",
              border: "1px solid rgba(251,191,36,0.25)",
            }}
          >
            {signingOut ? "מתנתק..." : "התנתק מהחשבון"}
          </button>
        </div>
      </div>
    </main>
  );
}
