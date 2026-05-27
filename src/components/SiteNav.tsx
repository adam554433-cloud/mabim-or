"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import MenuDrawer from "./MenuDrawer";
import NitzotzotLogo from "./fx/NitzotzotLogo";

type Props = {
  theme?: "dark" | "light";
};

export default function SiteNav({ theme = "dark" }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const displayName =
    user?.user_metadata?.display_name ?? user?.email?.split("@")[0] ?? "";
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;

  const isLight = theme === "light";

  // Theme tokens
  const navBg = isLight
    ? "rgba(252,250,234,0.92)"
    : "rgba(10,7,0,0.85)";
  const navBorder = isLight
    ? "1px solid rgba(202,169,40,0.20)"
    : "1px solid rgba(251,191,36,0.10)";
  const brandColor = isLight ? "#2A2A2A" : "#fbbf24";
  const pillBg = isLight ? "rgba(202,169,40,0.10)" : "rgba(251,191,36,0.10)";
  const pillBorder = isLight ? "1px solid rgba(202,169,40,0.30)" : "1px solid rgba(251,191,36,0.25)";
  const pillText = isLight ? "#CAA928" : "#fbbf24";
  const joinBg = isLight ? "#2A2A2A" : "#fbbf24";
  const joinText = isLight ? "#FFD345" : "#000000";

  return (
    <>
      <nav
        className="sticky top-0 z-40 flex items-center justify-between px-5 py-3.5 backdrop-blur-md"
        style={{ background: navBg, borderBottom: navBorder }}
      >
        <Link
          href="/"
          className="font-extrabold text-base sm:text-lg flex items-center gap-2 leading-none"
          style={{ color: brandColor }}
          aria-label="ניצוצות — אור בפעולה"
        >
          <NitzotzotLogo size="icon" pixelSize={26} />
          <span className="flex flex-col items-start">
            <span>ניצוצות</span>
            <span
              className="text-[10px] font-medium tracking-wider"
              style={{ color: isLight ? "#CAA928" : "#FDE494", opacity: 0.85 }}
            >
              אור בפעולה
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-2 text-sm">
          {user ? (
            <Link
              href="/profile"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full font-medium transition-all hover:opacity-80"
              style={{
                background: pillBg,
                border: pillBorder,
                color: pillText,
              }}
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="w-5 h-5 rounded-full object-cover"
                />
              ) : (
                <span className="text-base leading-none">💛</span>
              )}
              <span className="hidden sm:inline">{displayName || "האור שלי"}</span>
            </Link>
          ) : (
            <Link
              href="/login"
              className="px-3.5 py-1.5 rounded-full font-bold transition-all hover:scale-105 text-sm"
              style={{
                background: joinBg,
                color: joinText,
                boxShadow: isLight
                  ? "0 4px 12px rgba(42,42,42,0.18)"
                  : "0 0 14px rgba(251,191,36,0.3)",
              }}
            >
              הצטרפו
            </Link>
          )}

          <button
            onClick={() => setMenuOpen(true)}
            className="w-9 h-9 rounded-full transition-all flex items-center justify-center hover:opacity-80"
            style={{
              background: pillBg,
              border: pillBorder,
              color: pillText,
            }}
            aria-label="פתח תפריט"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.4"
              strokeLinecap="round"
            >
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="12" x2="20" y2="12" />
              <line x1="4" y1="17" x2="20" y2="17" />
            </svg>
          </button>
        </div>
      </nav>

      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} user={user} />
    </>
  );
}
