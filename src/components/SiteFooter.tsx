"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteFooter() {
  const pathname = usePathname();

  // The root is the Cod26 portal hub — it carries its own footer.
  if (pathname === "/") return null;

  return (
    <footer
      className="mt-16 py-6 px-5 text-center text-xs"
      style={{
        background: "rgba(0,0,0,0.4)",
        borderTop: "1px solid rgba(255,211,69,0.12)",
        color: "rgba(253,228,148,0.7)",
      }}
    >
      <nav className="flex items-center justify-center gap-2 flex-wrap mb-2">
        <Link href="/terms" className="hover:text-yellow-300 underline-offset-2 hover:underline">
          תקנון
        </Link>
        <span aria-hidden className="opacity-40">·</span>
        <Link href="/accessibility" className="hover:text-yellow-300 underline-offset-2 hover:underline">
          הצהרת נגישות
        </Link>
        <span aria-hidden className="opacity-40">·</span>
        <Link href="/about" className="hover:text-yellow-300 underline-offset-2 hover:underline">
          אודות
        </Link>
      </nav>
      <p className="opacity-60">
        © {new Date().getFullYear()} ניצוצות — אור בפעולה
      </p>
    </footer>
  );
}
