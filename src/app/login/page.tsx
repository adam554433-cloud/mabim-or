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
  const [error,   setError]   = useState("");

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
        🕯️ מביאים אור
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
            {step === "email" && "✉️"}
            {step === "otp"   && "🔢"}
            {step === "name"  && "👋"}
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            {step === "email" && "כניסה / הרשמה"}
            {step === "otp"   && "הזן קוד"}
            {step === "name"  && "מה השם שלך?"}
          </h1>
          <p className="text-amber-200/50 text-sm mt-2">
            {step === "email" && "נשלח לך קוד חד-פעמי למייל — ללא סיסמה"}
            {step === "otp"   && `שלחנו קוד אל ${email}`}
            {step === "name"  && "איך לקרוא לך בקהילה?"}
          </p>
        </div>

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
