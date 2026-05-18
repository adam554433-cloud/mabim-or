"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { MENU } from "@/lib/menu";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

type Props = {
  open: boolean;
  onClose: () => void;
  user: User | null;
};

export default function MenuDrawer({ open, onClose, user }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const displayName =
    user?.user_metadata?.display_name ?? user?.email?.split("@")[0] ?? "";
  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;

  async function signOut() {
    await supabase.auth.signOut();
    onClose();
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 backdrop-blur-sm"
            style={{ background: "rgba(5,3,0,0.7)" }}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 320 }}
            className="fixed top-0 right-0 bottom-0 z-50 w-[88vw] max-w-sm overflow-y-auto"
            style={{
              background:
                "linear-gradient(180deg, #1a1000 0%, #0a0700 70%)",
              borderLeft: "1px solid rgba(251,191,36,0.15)",
              boxShadow: "-20px 0 80px rgba(251,191,36,0.08)",
            }}
          >
            <div className="px-5 py-5 flex items-center justify-between border-b border-yellow-400/10">
              <span className="text-yellow-400 font-extrabold text-base">
                🕯️ מביאים אור
              </span>
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-full bg-black/30 border border-yellow-400/15 text-yellow-400 hover:bg-yellow-400/10 transition-all flex items-center justify-center"
                aria-label="סגור תפריט"
              >
                ✕
              </button>
            </div>

            {/* Profile pill */}
            <div className="px-5 py-5">
              {user ? (
                <Link
                  href="/profile"
                  onClick={onClose}
                  className="flex items-center gap-3 p-3 rounded-2xl border border-yellow-400/20 bg-yellow-400/5 hover:bg-yellow-400/10 transition-all"
                >
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-12 h-12 rounded-full object-cover border border-yellow-400/40"
                    />
                  ) : (
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl border border-yellow-400/40"
                      style={{ background: "rgba(251,191,36,0.1)" }}
                    >
                      💛
                    </div>
                  )}
                  <div className="flex-1 text-right">
                    <div className="text-yellow-100 font-bold">{displayName}</div>
                    <div className="text-amber-400/50 text-xs">הפרופיל שלי ←</div>
                  </div>
                </Link>
              ) : (
                <Link
                  href="/login"
                  onClick={onClose}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-2xl bg-yellow-400 text-black font-bold hover:scale-[1.02] transition-all"
                  style={{ boxShadow: "0 0 24px rgba(251,191,36,0.35)" }}
                >
                  🕯️ הצטרף להאיר
                </Link>
              )}
            </div>

            {/* Menu items */}
            <nav className="px-3 pb-4">
              {MENU.map((item, i) => {
                const locked = item.requiresAuth && !user;
                return (
                  <motion.div
                    key={`${item.href}-${i}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.04 * i }}
                  >
                    <Link
                      href={locked ? "/login" : item.href}
                      onClick={onClose}
                      className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${
                        locked
                          ? "opacity-60 hover:opacity-90"
                          : "hover:bg-yellow-400/5"
                      }`}
                    >
                      <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                      <div className="flex-1 min-w-0 text-right">
                        <div className="text-yellow-100 font-semibold text-sm flex items-center justify-end gap-2">
                          {locked && <span className="text-amber-400/40 text-xs">🔒</span>}
                          {item.label}
                        </div>
                        <div className="text-gray-500 text-xs truncate">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </nav>

            {user && (
              <div className="px-5 pb-8">
                <button
                  onClick={signOut}
                  className="w-full text-sm text-amber-400/40 hover:text-yellow-400 py-2 transition-colors"
                >
                  התנתק
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
