"use client";

import { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

type Step = "email" | "otp" | "name";

function LoginContent() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get("redirect") ?? "/my-light";

  const [step,    setStep]    = useState<Step>("email");
  const [email,   setEmail]   = useState("");
  const [otp,     setOtp]     = useState("");
  const [name,    setName]    = useState("");
  const [loading, setLoading] = useState(false);
  const [gLoading, setGLoading] = useState(false);
  const [error,   setError]   = useState("");

  async function signInWithGoogle() {
    setGLoading(true);
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}${redirect}` },
    });
  }

  async function sendOtp() {
    if (!email.trim()) return;
    setLoading(true); setError("");
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: { shouldCreateUser: true },
    });
    setLoading(false);
    if (error) { setError("שגיאה בשליחת קוד. נסה שוב."); return; }
    setStep("otp");
  }

  async function verifyOtp() {
    if (otp.length < 6) return;
    setLoading(true); setError("");
    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim(),
      token: otp.trim(),
      type: "email",
    });
    setLoading(false);
    if (error) { setError("קוד לא נכון. נסה שוב."); return; }
    if (!data.user?.user_metadata?.display_name) {
      setStep("name");
    } else {
      router.push(redirect);
    }
  }

  async function saveName() {
    if (!name.trim()) return;
    setLoading(true);
    await supabase.auth.updateUser({ data: { display_name: name.trim() } });
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("profiles").upsert({ id: user.id, display_name: name.trim() });
    }
    setLoading(false);
    router.push(redirect);
  }

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ background: "radial-gradient(ellipse 140% 55% at 50% -5%, #1e1000 0%, #0a0700 55%)" }}
    >
      <Link href="/" className="text-yellow-400 font-extrabold text-xl mb-10 candle-flicker">
        ✨ מביאים אור
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-sm rounded-3xl p-8"
        style={{
          background: "linear-gradient(135deg,#1e1200,#0d0800)",
          border: "1px solid rgba(251,191,36,0.3)",
          boxShadow: "0 0 60px rgba(251,191,36,0.12)",
        }}
      >
        <div className="text-center mb-7">
          <div className="text-5xl mb-3">
            {step === "email" && "✨"}
            {step === "otp"   && "🔢"}
            {step === "name"  && "👋"}
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            {step === "email" && "כניסה / הרשמה"}
            {step === "otp"   && "הזן קוד"}
            {step === "name"  && "מה השם שלך?"}
          </h1>
          <p className="text-amber-200/50 text-sm mt-2">
            {step === "email" && "הצטרף לקהילה שמאירה את העולם"}
            {step === "otp"   && `שלחנו קוד אל ${email}`}
            {step === "name"  && "איך לקרוא לך בקהילה?"}
          </p>
        </div>

        {/* Google sign-in — only on email step */}
        {step === "email" && (
          <div className="mb-5">
            <button
              onClick={signInWithGoogle}
              disabled={gLoading}
              className="w-full flex items-center justify-center gap-3 py-3.5 rounded-full font-bold text-base transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
              style={{ background: "#fff", color: "#1f1f1f", boxShadow: "0 2px 12px rgba(0,0,0,0.3)" }}
            >
              {gLoading ? (
                <span className="w-5 h-5 border-2 border-gray-300 border-t-gray-700 rounded-full animate-spin" />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
              )}
              {gLoading ? "מחבר..." : "המשך עם Google"}
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px" style={{ background: "rgba(251,191,36,0.15)" }} />
              <span className="text-amber-400/30 text-xs">או עם מייל</span>
              <div className="flex-1 h-px" style={{ background: "rgba(251,191,36,0.15)" }} />
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === "email" && (
            <motion.div key="email" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendOtp()}
                placeholder="your@email.com"
                autoFocus
                dir="ltr"
                className="w-full rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none text-base text-left"
                style={{ background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.2)" }}
              />
              {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              <button
                onClick={sendOtp}
                disabled={loading || !email.trim()}
                className="w-full font-bold py-4 rounded-full text-lg disabled:opacity-40 transition-all hover:scale-[1.02] active:scale-[0.98]"
                style={{ background: "#fbbf24", color: "#000", boxShadow: "0 0 24px rgba(251,191,36,0.35)" }}
              >
                {loading ? "שולח..." : "שלח קוד ←"}
              </button>
            </motion.div>
          )}

          {step === "otp" && (
            <motion.div key="otp" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-3">
              <input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 8))}
                onKeyDown={e => e.key === "Enter" && verifyOtp()}
                placeholder="12345678"
                autoFocus
                dir="ltr"
                className="w-full rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none text-2xl font-bold text-center tracking-[0.5em]"
                style={{ background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.2)" }}
              />
              {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              <button
                onClick={verifyOtp}
                disabled={loading || otp.length < 6}
                className="w-full font-bold py-4 rounded-full text-lg disabled:opacity-40 transition-all hover:scale-[1.02]"
                style={{ background: "#fbbf24", color: "#000", boxShadow: "0 0 24px rgba(251,191,36,0.35)" }}
              >
                {loading ? "מאמת..." : "כניסה ✨"}
              </button>
              <button onClick={() => { setStep("email"); setOtp(""); setError(""); }} className="w-full text-amber-400/40 hover:text-amber-400 text-sm py-1 transition-colors">
                שנה מייל
              </button>
            </motion.div>
          )}

          {step === "name" && (
            <motion.div key="name" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-3">
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && saveName()}
                placeholder="יוסי לוי"
                autoFocus
                className="w-full rounded-xl px-4 py-3.5 text-white placeholder-gray-600 focus:outline-none text-base"
                style={{ background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.2)" }}
              />
              <button
                onClick={saveName}
                disabled={loading || !name.trim()}
                className="w-full font-bold py-4 rounded-full text-lg disabled:opacity-40 transition-all hover:scale-[1.02]"
                style={{ background: "#fbbf24", color: "#000", boxShadow: "0 0 24px rgba(251,191,36,0.35)" }}
              >
                {loading ? "שומר..." : "בוא נתחיל! →"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <p className="text-gray-700 text-xs mt-6">
        בלחיצה על "שלח קוד" אתה מסכים לתנאי השימוש
      </p>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0a0700]" />}>
      <LoginContent />
    </Suspense>
  );
}
