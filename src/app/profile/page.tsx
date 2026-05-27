"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import LightPage from "@/components/LightPage";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { MOCK_SUBMISSIONS, CURRENT_CHALLENGE } from "@/lib/mockData";
import PulseDot from "@/components/fx/PulseDot";
import ProgressConstellation, { ConstellationStep } from "@/components/fx/ProgressConstellation";

const INK = "#2A2A2A";
const INK_SOFT = "#5A5A5A";
const GOLD = "#FFD345";
const GOLD_DK = "#CAA928";
const GOLD_LT = "#FDE494";

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
      <LightPage>
        <div className="text-center pt-20" style={{ color: GOLD_DK }}>
          טוען...
        </div>
      </LightPage>
    );
  }

  if (!user) {
    return (
      <LightPage>
        <div className="max-w-md mx-auto px-5 py-20 text-center">
          <div className="text-5xl mb-3">💛</div>
          <h1 className="text-2xl font-extrabold mb-3" style={{ color: INK }}>
            הפרופיל האישי שלי
          </h1>
          <p className="text-sm mb-6" style={{ color: INK_SOFT }}>
            כדי לראות את הפרופיל — צריך להיות חבר בקהילה.
          </p>
          <Link
            href="/login"
            className="inline-block font-bold px-6 py-3 rounded-full"
            style={{ background: INK, color: GOLD }}
          >
            הצטרף
          </Link>
        </div>
      </LightPage>
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
    background: "#FFFFFF",
    border: `1px solid ${GOLD_DK}22`,
    boxShadow: "0 6px 18px rgba(202,169,40,0.07)",
  };

  return (
    <LightPage>
      <div className="max-w-2xl mx-auto px-5 py-12">
        <div className="text-center mb-8">
          {/* Avatar with pulse rings */}
          <div
            className="relative inline-flex items-center justify-center mb-4"
            style={{ width: 130, height: 130 }}
          >
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <PulseDot size={104} rings={2} speed={2.8} color={GOLD_DK} />
            </div>
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={displayName}
                className="relative w-24 h-24 rounded-full object-cover border-2"
                style={{
                  borderColor: GOLD_DK,
                  boxShadow: `0 0 30px ${GOLD}55`,
                }}
              />
            ) : (
              <div
                className="relative w-24 h-24 rounded-full border-2 flex items-center justify-center text-5xl"
                style={{
                  borderColor: GOLD_DK,
                  background: `${GOLD_LT}40`,
                  boxShadow: `0 0 30px ${GOLD}33`,
                }}
              >
                💛
              </div>
            )}
            <button
              onClick={onPickFile}
              className="absolute bottom-2 left-2 w-9 h-9 rounded-full flex items-center justify-center font-bold hover:scale-110 transition-all z-10"
              style={{ background: INK, color: GOLD }}
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
            className="text-center text-2xl sm:text-3xl font-extrabold bg-transparent border-b focus:outline-none px-2 py-1 max-w-xs"
            style={{
              color: INK,
              borderColor: `${GOLD_DK}55`,
            }}
          />
          <p className="text-sm mt-2" style={{ color: GOLD_DK }}>
            {user.email}
          </p>

          <button
            onClick={save}
            disabled={saving}
            className="mt-4 font-semibold px-5 py-2 rounded-full text-sm transition-all disabled:opacity-50"
            style={{
              background: "#FFFFFF",
              color: INK,
              border: `1px solid ${GOLD_DK}55`,
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
              <div className="text-3xl font-extrabold" style={{ color: GOLD_DK }}>
                {s.n}
              </div>
              <div className="text-xs mt-1" style={{ color: INK_SOFT }}>
                {s.l}
              </div>
            </div>
          ))}
        </div>

        {/* Journey */}
        <div className="rounded-2xl p-5 mb-8" style={card}>
          <ProgressConstellation steps={journey} title="המסע שלך" />
        </div>

        {/* History */}
        <h2 className="text-xs tracking-[0.25em] font-bold mb-3" style={{ color: GOLD_DK }}>
          מה עשיתי עד כה
        </h2>
        {myHistory.length === 0 ? (
          <div className="rounded-2xl p-6 text-center" style={card}>
            <p className="text-sm mb-3" style={{ color: INK_SOFT }}>
              עוד לא הדלקת אור באתגר.
              <br />
              האתגר הנוכחי:{" "}
              <span className="font-bold" style={{ color: GOLD_DK }}>
                {CURRENT_CHALLENGE.title}
              </span>
            </p>
            <Link
              href="/"
              className="inline-block font-bold px-5 py-2 rounded-full text-sm"
              style={{ background: INK, color: GOLD }}
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
                  <div className="text-sm font-semibold" style={{ color: INK }}>
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
        <div className="mt-12 pt-6 border-t text-center" style={{ borderColor: `${GOLD_DK}22` }}>
          <button
            onClick={signOut}
            disabled={signingOut}
            className="text-sm font-medium px-5 py-2 rounded-full transition-all hover:opacity-80 disabled:opacity-50"
            style={{
              background: "transparent",
              color: INK_SOFT,
              border: `1px solid ${GOLD_DK}33`,
            }}
          >
            {signingOut ? "מתנתק..." : "התנתק מהחשבון"}
          </button>
        </div>
      </div>
    </LightPage>
  );
}
