"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SVGProps } from "react";
import {
  HomeIcon,
  PuzzleIcon,
  FilmIcon,
  LightbulbIcon,
  SunriseIcon,
} from "./icons";

type Tab = { href: string; Icon: (p: SVGProps<SVGSVGElement> & { size?: number }) => React.ReactElement; label: string };

const TABS: Tab[] = [
  { href: "/", Icon: HomeIcon, label: "בית" },
  { href: "/puzzle", Icon: PuzzleIcon, label: "פאזל" },
  { href: "/shorts", Icon: FilmIcon, label: "סרטונים" },
  { href: "/insight", Icon: LightbulbIcon, label: "תובנה" },
  { href: "/gratitude", Icon: SunriseIcon, label: "הודיה" },
];

// Routes where the app shell (tab bar) should be hidden — focused flows.
const HIDDEN_PREFIXES = ["/login", "/onboarding", "/presentation", "/fx", "/preview", "/admin"];

export default function BottomTabBar() {
  const pathname = usePathname();

  if (HIDDEN_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return null;
  }

  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 md:hidden backdrop-blur-md"
      style={{
        background: "rgba(10,7,0,0.92)",
        borderTop: "1px solid rgba(251,191,36,0.12)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
      aria-label="ניווט ראשי"
    >
      <ul className="flex items-stretch">
        {TABS.map((tab) => {
          const active = pathname === tab.href;
          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={active ? "page" : undefined}
                className="flex flex-col items-center justify-center gap-0.5 h-14 transition-opacity"
                style={{
                  color: active ? "#fbbf24" : "rgba(253,228,148,0.55)",
                  opacity: active ? 1 : 0.9,
                }}
              >
                <tab.Icon size={22} />
                <span className="text-[10px] font-medium leading-none">{tab.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
