"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { SVGProps } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@supabase/supabase-js";
import {
  HomeIcon,
  PuzzleIcon,
  GridIcon,
  LightbulbIcon,
  SunriseIcon,
  PlusIcon,
} from "./icons";

type Tab = { href: string; Icon: (p: SVGProps<SVGSVGElement> & { size?: number }) => React.ReactElement; label: string };

const TABS: Tab[] = [
  { href: "/puzzle", Icon: HomeIcon, label: "בית" },
  { href: "/puzzle/board", Icon: PuzzleIcon, label: "פאזל" },
  { href: "/puzzle/shorts", Icon: GridIcon, label: "ניצוצות" },
  { href: "/puzzle/insight", Icon: LightbulbIcon, label: "תובנה" },
  { href: "/puzzle/gratitude", Icon: SunriseIcon, label: "הודיה" },
];

// Theme — cream strip, purple active, dark-gray idle.
const CREAM = "rgba(251,248,236,0.97)";
const PURPLE = "#7C3AED";
const IDLE = "#3F3F46";

// Routes where the app shell (tab bar) should be hidden — focused flows.
const HIDDEN_PREFIXES = ["/login", "/onboarding", "/presentation", "/fx", "/preview", "/admin"];

export default function BottomTabBar() {
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [challengeCount, setChallengeCount] = useState(0);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    fetch("/api/challenges")
      .then((r) => r.json())
      .then((d) => Array.isArray(d.challenges) && setChallengeCount(d.challenges.length))
      .catch(() => {});
  }, []);

  // The root is the Cod26 portal hub — it stands outside the puzzle app shell.
  if (pathname === "/" || HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return null;
  }

  // The "+" routes to the submission form for members, or sign-up for guests.
  // There is always at least the active weekly challenge to act on.
  const plusHref = user ? "/puzzle#submit" : "/login";
  const openChallenges = challengeCount || 1;

  return (
    <>
      {/* Quick-add (+) — floats above the strip on the leading (right, RTL) side */}
      <Link
        href={plusHref}
        aria-label="להגיש אתגר / להדליק אור"
        className="fixed bottom-[88px] left-4 z-50 md:hidden w-14 h-14 rounded-full flex items-center justify-center transition-transform active:scale-95 hover:scale-105"
        style={{
          background: PURPLE,
          color: "#fff",
          boxShadow: "0 8px 24px rgba(124,58,237,0.45), 0 0 0 1px rgba(255,255,255,0.08)",
        }}
      >
        <PlusIcon size={26} />
        <span
          className="absolute -top-1 -left-1 min-w-[20px] h-5 px-1 rounded-full flex items-center justify-center text-[11px] font-extrabold tabular-nums"
          style={{ background: "#FFD345", color: "#000", boxShadow: "0 2px 6px rgba(0,0,0,0.3)" }}
          aria-label={`${openChallenges} אתגרים פעילים`}
        >
          {openChallenges}
        </span>
      </Link>

      <nav
        className="fixed bottom-3 left-1/2 -translate-x-1/2 z-40 md:hidden backdrop-blur-md rounded-2xl"
        style={{
          width: "min(440px, calc(100vw - 24px))",
          background: CREAM,
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.18)",
          paddingBottom: "env(safe-area-inset-bottom)",
        }}
        aria-label="ניווט ראשי"
      >
        <ul className="flex items-stretch">
          {TABS.map((tab) => {
            const active = pathname === tab.href;
            return (
              <li key={tab.href} className="flex-1 relative">
                {/* Purple indicator line — flush to the top edge of the strip */}
                {active && (
                  <span
                    aria-hidden
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-7 h-[3px] rounded-full"
                    style={{ background: PURPLE }}
                  />
                )}
                <Link
                  href={tab.href}
                  aria-current={active ? "page" : undefined}
                  className="flex flex-col items-center justify-center gap-1 h-16 transition-colors"
                  style={{ color: active ? PURPLE : IDLE }}
                >
                  <tab.Icon size={24} />
                  <span className="text-[11px] font-semibold leading-none">{tab.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
