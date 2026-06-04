"use client";

import { useEffect, useState } from "react";
import LoginScreen from "./LoginScreen";
import Dashboard from "./Dashboard";

export default function AdminApp({ initialAuthed }: { initialAuthed: boolean }) {
  const [authed, setAuthed] = useState<boolean | null>(initialAuthed ? true : null);

  useEffect(() => {
    if (authed) return;
    fetch("/api/admin/auth/session")
      .then((r) => setAuthed(r.ok))
      .catch(() => setAuthed(false));
  }, [authed]);

  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center text-amber-200/50">
        טוען…
      </div>
    );
  }

  if (!authed) return <LoginScreen onSuccess={() => setAuthed(true)} />;
  return <Dashboard onLogout={() => setAuthed(false)} />;
}
