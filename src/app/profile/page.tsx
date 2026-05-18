"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import SiteNav from "@/components/SiteNav";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import { MOCK_SUBMISSIONS, CURRENT_CHALLENGE } from "@/lib/mockData";

const HISTORY_KEY = "mabim-or:my-history";

export default function ProfilePage() {
  const [user, setUser] = useState<User | null | undefined>(undefined);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>();
  const [displayName, setDisplayName] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedFlash, setSavedFlash] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

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
      <main className="min-h-screen">
        <SiteNav />
        <div className="text-center text-amber-400/40 pt-20">טוען...</div>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="min-h-screen">
        <SiteNav />
        <div className="max-w-md mx-auto px-5 py-20 text-center">
          <div className="text-5xl mb-3">💛</div>
          <h1 className="text-2xl font-extrabold text-yellow-400 mb-3">
            הפרופיל האישי שלי
          </h1>
          <p className="text-yellow-100/70 text-sm mb-6">
            כדי לראות את הפרופיל — צריך להיות חבר בקהילה.
          </p>
          <Link
            href="/login"
            className="inline-block bg-yellow-400 text-black font-bold px-6 py-3 rounded-full"
          >
            הצטרף
          </Link>
        </div>
      </main>
    );
  }

  // History from localStorage + mock data filtered to this user's name
  const myHistory = MOCK_SUBMISSIONS.filter((s) => s.name === displayName);
  const totalLights = myHistory.length;

  return (
    <main className="min-h-screen">
      <SiteNav />
      <div className="max-w-2xl mx-auto px-5 py-10">
        <div className="text-center mb-8">
          {/* Avatar */}
          <div className="relative inline-block mb-4">
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-24 h-24 rounded-full object-cover border-2 border-yellow-400/60 shadow-[0_0_30px_rgba(251,191,36,0.3)]"
              />
            ) : (
              <div
                className="w-24 h-24 rounded-full border-2 border-yellow-400/60 flex items-center justify-center text-5xl"
                style={{
                  background: "rgba(251,191,36,0.08)",
                  boxShadow: "0 0 30px rgba(251,191,36,0.2)",
                }}
              >
                💛
              </div>
            )}
            <button
              onClick={onPickFile}
              className="absolute -bottom-1 -left-1 w-9 h-9 rounded-full bg-yellow-400 text-black flex items-center justify-center font-bold hover:scale-110 transition-all"
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

          {/* Name */}
          <input
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="text-center text-2xl sm:text-3xl font-extrabold text-yellow-400 bg-transparent border-b border-yellow-400/20 focus:outline-none focus:border-yellow-400 px-2 py-1 max-w-xs"
          />
          <p className="text-amber-400/60 text-sm mt-2">{user.email}</p>

          <button
            onClick={save}
            disabled={saving}
            className="mt-4 bg-yellow-400/10 border border-yellow-400/40 text-yellow-400 font-semibold px-5 py-2 rounded-full text-sm hover:bg-yellow-400/20 transition-all disabled:opacity-50"
          >
            {saving ? "שומר..." : savedFlash ? "נשמר ✓" : "שמור שינויים"}
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div className="rounded-xl p-4 text-center border border-yellow-400/15 bg-yellow-400/5">
            <div className="text-3xl font-extrabold text-yellow-400">
              {totalLights}
            </div>
            <div className="text-amber-400/60 text-xs mt-1">אורות שלי</div>
          </div>
          <div className="rounded-xl p-4 text-center border border-yellow-400/15 bg-yellow-400/5">
            <div className="text-3xl font-extrabold text-yellow-400">7</div>
            <div className="text-amber-400/60 text-xs mt-1">ימים ברצף</div>
          </div>
          <div className="rounded-xl p-4 text-center border border-yellow-400/15 bg-yellow-400/5">
            <div className="text-3xl font-extrabold text-yellow-400">1</div>
            <div className="text-amber-400/60 text-xs mt-1">תגים</div>
          </div>
        </div>

        {/* History */}
        <h2 className="text-amber-400/60 text-xs tracking-[0.25em] font-semibold mb-3">
          מה עשיתי עד כה
        </h2>
        {myHistory.length === 0 ? (
          <div className="rounded-2xl border border-yellow-400/15 p-6 text-center">
            <p className="text-yellow-100/70 text-sm mb-3">
              עוד לא הדלקת אור באתגר.
              <br />
              האתגר הנוכחי: <span className="text-yellow-400">{CURRENT_CHALLENGE.title}</span>
            </p>
            <Link
              href="/"
              className="inline-block bg-yellow-400 text-black font-bold px-5 py-2 rounded-full text-sm"
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
                className="flex items-center gap-3 rounded-xl p-3 border border-yellow-400/10 bg-yellow-400/5"
              >
                <div className="text-xl">🕯️</div>
                <div className="flex-1 text-right">
                  <div className="text-yellow-100 text-sm font-semibold">
                    {s.challenge_title}
                  </div>
                  <div className="text-amber-400/40 text-xs">
                    {new Date(s.created_at).toLocaleDateString("he-IL")}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
