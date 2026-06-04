"use client";

import { useState } from "react";
import { Btn, Card, inputStyle } from "./ui";

export default function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "סיסמה שגויה");
        return;
      }
      onSuccess();
    } catch {
      setError("שגיאה — נסה שוב");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-sm">
        <h1 className="text-2xl font-bold text-center mb-1">כניסת מנהל</h1>
        <p className="text-amber-200/50 text-sm text-center mb-6">אזור ניהול המערכת</p>
        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="סיסמה"
            autoFocus
            className="w-full rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none text-base"
            style={inputStyle}
          />
          {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          <Btn type="submit" disabled={loading || !password} className="w-full">
            {loading ? "מתחבר..." : "כניסה"}
          </Btn>
        </form>
      </Card>
    </div>
  );
}
