"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import MenuDrawer from "./MenuDrawer";

export default function SiteNav() {
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

  return (
    <>
      <nav
        className="sticky top-0 z-40 flex items-center justify-between px-5 py-3.5 backdrop-blur-md border-b border-yellow-400/10"
        style={{ background: "rgba(10,7,0,0.85)" }}
      >
        <Link
          href="/"
          className="text-yellow-400 font-extrabold text-base sm:text-lg"
        >
          🕯️ מביאים אור
        </Link>

        <div className="flex items-center gap-2 text-sm">
          {user ? (
            <Link
              href="/profile"
              className="flex items-center gap-1.5 bg-yellow-400/10 border border-yellow-400/25 text-yellow-400 px-2.5 py-1.5 rounded-full font-medium transition-all hover:bg-yellow-400/20"
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
              className="bg-yellow-400 active:bg-yellow-500 text-black px-3.5 py-1.5 rounded-full font-bold transition-all hover:scale-105 text-sm"
              style={{ boxShadow: "0 0 14px rgba(251,191,36,0.3)" }}
            >
              הצטרף
            </Link>
          )}

          <button
            onClick={() => setMenuOpen(true)}
            className="w-9 h-9 rounded-full bg-yellow-400/10 border border-yellow-400/25 text-yellow-400 hover:bg-yellow-400/20 transition-all flex items-center justify-center"
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
