"use client";

import { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import OnboardingForm from "@/components/OnboardingForm";

function OnboardingContent() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/my-light";

  const [ready, setReady] = useState(false);
  const [initialName, setInitialName] = useState("");

  useEffect(() => {
    // onAuthStateChange fires INITIAL_SESSION only after the client has finished
    // initializing — which includes exchanging the ?code= from an OAuth (Google)
    // redirect for a session. Using it instead of a one-shot getUser() avoids the
    // race where getUser() runs before the code exchange and wrongly bounces the
    // user to /login.
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user;
      if (!user) {
        router.replace(`/login?redirect=${encodeURIComponent(next)}`);
        return;
      }
      if (user.user_metadata?.onboarded) {
        router.replace(next);
        return;
      }
      const meta = user.user_metadata ?? {};
      setInitialName(
        (meta.full_name as string) ||
          (meta.display_name as string) ||
          (meta.name as string) ||
          ""
      );
      setReady(true);
    });
    return () => subscription.unsubscribe();
  }, [router, next]);

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4 py-10"
      style={{
        background:
          "radial-gradient(ellipse 140% 55% at 50% -5%, #1e1000 0%, #0a0700 55%)",
      }}
    >
      <Link
        href="/"
        className="text-yellow-400 font-extrabold text-xl mb-8 candle-flicker"
      >
        ✨ מביאים אור
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-3xl p-8"
        style={{
          background: "linear-gradient(135deg,#1e1200,#0d0800)",
          border: "1px solid rgba(251,191,36,0.3)",
          boxShadow: "0 0 60px rgba(251,191,36,0.12)",
        }}
      >
        <div className="text-center mb-7">
          <div className="text-5xl mb-3">👋</div>
          <h1 className="text-2xl font-extrabold text-white">ספר/י לנו עליך</h1>
          <p className="text-amber-200/50 text-sm mt-2">
            שאלון קצר לפני שמתחילים
          </p>
        </div>

        {ready ? (
          <OnboardingForm
            initialFullName={initialName}
            onComplete={() => router.push(next)}
          />
        ) : (
          <p className="text-center text-amber-200/40 py-10">טוען...</p>
        )}
      </motion.div>
    </main>
  );
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0700]" />}>
      <OnboardingContent />
    </Suspense>
  );
}
