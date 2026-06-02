"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Submission } from "@/types";

interface ShortsFeedProps {
  submissions: Submission[];
}

function timeAgo(dateStr: string): string {
  const diff = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diff < 60) return "לפני רגע";
  if (diff < 3600) return `לפני ${Math.floor(diff / 60)} דק'`;
  if (diff < 86400) return `לפני ${Math.floor(diff / 3600)} שע'`;
  return `לפני ${Math.floor(diff / 86400)} ימים`;
}

const AVATAR_BG = ["bg-yellow-400", "bg-orange-400", "bg-amber-500", "bg-yellow-500", "bg-orange-500"];

function resolveMedia(s: Submission): { url: string; type: "video" | "image" } | null {
  if (s.media_url && s.media_type) return { url: s.media_url, type: s.media_type };
  if (s.video_url) return { url: s.video_url, type: "video" };
  return null;
}

function ShortItem({
  s,
  i,
  muted,
  onToggleMute,
}: {
  s: Submission;
  i: number;
  muted: boolean;
  onToggleMute: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const articleRef = useRef<HTMLElement>(null);
  const media = resolveMedia(s);

  useEffect(() => {
    if (!videoRef.current || !articleRef.current || !media || media.type !== "video") return;
    const video = videoRef.current;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.intersectionRatio >= 0.6) {
            video.play().catch(() => {});
          } else {
            video.pause();
            video.currentTime = 0;
          }
        }
      },
      { threshold: [0, 0.6, 1] }
    );
    io.observe(articleRef.current);
    return () => io.disconnect();
  }, [media]);

  return (
    <article
      ref={articleRef}
      className="relative h-[100dvh] w-full snap-start snap-always bg-black overflow-hidden"
    >
      {media ? (
        media.type === "video" ? (
          <video
            ref={videoRef}
            src={media.url}
            muted={muted}
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-contain"
          />
        ) : (
          <Image
            src={media.url}
            alt={s.name}
            fill
            sizes="100vw"
            className="object-contain"
            priority={i === 0}
          />
        )
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-yellow-500/20 to-orange-500/10">
          <span className="text-7xl candle-flicker">✨</span>
          <span className="mt-3 text-white/60 text-sm">אור נדלק</span>
        </div>
      )}

      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/85 to-transparent pointer-events-none" />

      <div className="absolute top-4 start-4 flex items-center gap-1.5 bg-black/50 backdrop-blur rounded-full px-2.5 py-1">
        <div className="relative w-1.5 h-1.5">
          <div className="absolute inset-0 rounded-full bg-yellow-400 ping-gold" />
          <div className="absolute inset-0 rounded-full bg-yellow-400" />
        </div>
        <span className="text-yellow-400 text-xs font-medium">
          #{(s.puzzle_index + 1).toLocaleString("he-IL")}
        </span>
      </div>

      <div className="absolute bottom-[88px] md:bottom-8 start-4 end-20 text-white">
        <div className="flex items-center gap-2.5 mb-2">
          <div
            className={`w-10 h-10 rounded-full ${AVATAR_BG[i % AVATAR_BG.length]} flex items-center justify-center text-black font-bold flex-shrink-0`}
          >
            {s.name[0]}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-white text-base truncate">{s.name}</p>
            <p className="text-yellow-400/85 text-xs truncate">{s.challenge_title}</p>
          </div>
        </div>
        <p className="text-white/55 text-xs">{timeAgo(s.created_at)}</p>
      </div>

      <div className="absolute bottom-[152px] md:bottom-24 end-3 flex flex-col gap-3 items-center">
        {media?.type === "video" && (
          <button
            onClick={onToggleMute}
            aria-label={muted ? "הפעל קול" : "השתק"}
            className="w-11 h-11 rounded-full bg-black/55 backdrop-blur border border-white/15 text-xl flex items-center justify-center hover:scale-105 transition"
          >
            {muted ? "🔇" : "🔊"}
          </button>
        )}
        <Link
          href={`/?focus=${s.puzzle_index}`}
          aria-label="ראה בפאזל"
          className="w-11 h-11 rounded-full bg-black/55 backdrop-blur border border-yellow-400/30 text-xl flex items-center justify-center hover:scale-105 transition"
        >
          ✨
        </Link>
      </div>
    </article>
  );
}

export default function ShortsFeed({ submissions }: ShortsFeedProps) {
  const [muted, setMuted] = useState(true);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (localStorage.getItem("shorts-hint-seen") || submissions.length <= 1) return;
    const show = setTimeout(() => setShowHint(true), 0);
    const hide = setTimeout(() => {
      setShowHint(false);
      localStorage.setItem("shorts-hint-seen", "1");
    }, 2200);
    return () => {
      clearTimeout(show);
      clearTimeout(hide);
    };
  }, [submissions.length]);

  if (submissions.length === 0) {
    return (
      <main className="fixed inset-0 bg-black flex flex-col items-center justify-center px-6 text-center">
        <Link
          href="/"
          className="absolute top-4 end-4 w-10 h-10 rounded-full bg-white/10 backdrop-blur text-white text-xl flex items-center justify-center"
          aria-label="סגור"
        >
          ✕
        </Link>
        <div className="text-6xl mb-4 candle-flicker">✨</div>
        <h1 className="text-yellow-400 text-2xl font-bold mb-2">עדיין אין סיפורי אור</h1>
        <p className="text-white/60 text-sm mb-6 max-w-xs">
          היה הראשון לשתף סרטון או תמונה — האור שלך יפתח את הזרם.
        </p>
        <Link
          href="/#submission-form"
          className="bg-yellow-400 text-black font-bold px-6 py-3 rounded-full"
        >
          שלח את האור שלי
        </Link>
      </main>
    );
  }

  return (
    <main className="fixed inset-0 bg-black">
      <Link
        href="/"
        className="absolute top-4 end-4 z-30 w-10 h-10 rounded-full bg-black/55 backdrop-blur border border-white/15 text-white text-xl flex items-center justify-center"
        aria-label="סגור"
      >
        ✕
      </Link>

      {showHint && (
        <div className="absolute inset-x-0 top-1/2 z-30 flex flex-col items-center pointer-events-none">
          <div className="bg-black/60 backdrop-blur text-white text-sm px-4 py-2 rounded-full border border-white/15">
            החלק למעלה לסיפור הבא ↑
          </div>
        </div>
      )}

      <div
        className="h-[100dvh] w-full overflow-y-scroll snap-y snap-mandatory"
        style={{ scrollbarWidth: "none" }}
      >
        {submissions.map((s, i) => (
          <ShortItem
            key={s.id}
            s={s}
            i={i}
            muted={muted}
            onToggleMute={() => setMuted((m) => !m)}
          />
        ))}
      </div>
    </main>
  );
}
