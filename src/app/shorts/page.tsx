"use client";

import { useEffect, useState } from "react";
import ShortsFeed from "@/components/ShortsFeed";
import { Submission } from "@/types";

export default function ShortsPage() {
  const [submissions, setSubmissions] = useState<Submission[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/submissions")
      .then((r) => r.json())
      .then((data: { submissions?: Submission[] }) => {
        if (cancelled) return;
        const all = data.submissions ?? [];
        const withMedia = all.filter(
          (s) => (s.media_url && s.media_type) || s.video_url
        );
        setSubmissions(withMedia);
      })
      .catch(() => !cancelled && setSubmissions([]));
    return () => {
      cancelled = true;
    };
  }, []);

  if (submissions === null) {
    return (
      <main className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
      </main>
    );
  }

  return <ShortsFeed submissions={submissions} />;
}
