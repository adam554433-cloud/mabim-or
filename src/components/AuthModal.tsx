"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import OnboardingForm from "./OnboardingForm";

interface AuthModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

type Step = "email" | "otp" | "onboarding";

export default function AuthModal({ onClose, onSuccess }: AuthModalProps) {
  const [step,  setStep]  = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp,   setOtp]   = useState("");
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
      type:  "email",
    });
    setLoading(false);
    if (error) { setError("קוד לא נכון. נסה שוב."); return; }
    if (!data.user?.user_metadata?.onboarded) {
      setStep("onboarding");
    } else {
      onSuccess();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 16 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{   opacity: 0, scale: 0.92, y: 16  }}
        className={`relative w-full ${step === "onboarding" ? "max-w-md" : "max-w-sm"} rounded-3xl p-7 z-10 max-h-[92vh] overflow-y-auto`}
        style={{ background: "linear-gradient(135deg,#1e1200,#0d0800)", border: "1px solid rgba(251,191,36,0.3)", boxShadow: "0 0 60px rgba(251,191,36,0.15)" }}
      >
        <button onClick={onClose} className="absolute top-4 left-4 text-gray-600 hover:text-gray-300 text-xl leading-none">×</button>

        <div className="text-center mb-6">
          <div className="text-4xl mb-3 candle-flicker">✨</div>
          <h2 className="text-xl font-bold text-white">
            {step === "email"      && "כניסה / הרשמה"}
            {step === "otp"        && "הזן קוד"}
            {step === "onboarding" && "ספר/י לנו עליך"}
          </h2>
          <p className="text-amber-200/50 text-sm mt-1">
            {step === "email"      && "נשלח לך קוד חד-פעמי למייל"}
            {step === "otp"        && `שלחנו קוד 6 ספרות אל ${email}`}
            {step === "onboarding" && "שאלון קצר לפני שמתחילים"}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === "email" && (
            <motion.div key="email" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendOtp()}
                placeholder="your@email.com"
                autoFocus
                className="w-full rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none text-base"
                style={{ background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.2)" }}
              />
              {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              <button
                onClick={sendOtp}
                disabled={loading || !email.trim()}
                className="w-full font-bold py-3.5 rounded-full text-base disabled:opacity-40 transition-all hover:scale-[1.02]"
                style={{ background: "#fbbf24", color: "#000", boxShadow: "0 0 20px rgba(251,191,36,0.3)" }}
              >
                {loading ? "שולח..." : "שלח קוד ←"}
              </button>
            </motion.div>
          )}

          {step === "otp" && (
            <motion.div key="otp" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
              <input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                onKeyDown={e => e.key === "Enter" && verifyOtp()}
                placeholder="123456"
                autoFocus
                className="w-full rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none text-2xl font-bold text-center tracking-[0.4em]"
                style={{ background: "rgba(251,191,36,0.07)", border: "1px solid rgba(251,191,36,0.2)" }}
              />
              {error && <p className="text-red-400 text-sm text-center">{error}</p>}
              <button
                onClick={verifyOtp}
                disabled={loading || otp.length < 6}
                className="w-full font-bold py-3.5 rounded-full text-base disabled:opacity-40 transition-all hover:scale-[1.02]"
                style={{ background: "#fbbf24", color: "#000", boxShadow: "0 0 20px rgba(251,191,36,0.3)" }}
              >
                {loading ? "מאמת..." : "כניסה ✨"}
              </button>
              <button onClick={() => { setStep("email"); setOtp(""); setError(""); }} className="w-full text-amber-400/40 hover:text-amber-400 text-sm py-1 transition-colors">
                שנה מייל
              </button>
            </motion.div>
          )}

          {step === "onboarding" && (
            <motion.div key="onboarding" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <OnboardingForm onComplete={onSuccess} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
