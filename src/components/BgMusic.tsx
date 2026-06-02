"use client";

import { useEffect, useRef, useState } from "react";
import { VolumeOnIcon, VolumeOffIcon } from "./icons";

// ── Background music infrastructure ──────────────────────────────────────
// Drop an audio file at public/audio/ambient.mp3 (or change SRC below) and
// the toggle button starts working. Until then the button stays visible but
// play() simply no-ops because the file is missing.
const SRC = "/audio/ambient.mp3";
const STORAGE_KEY = "nitzotzot:music";

export default function BgMusic() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);

  // Browsers block autoplay until a user gesture, so we only *attempt* to
  // resume if the user had previously turned music on.
  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) !== "on") return;
    audioRef.current
      ?.play()
      .then(() => setPlaying(true))
      .catch(() => {});
  }, []);

  function toggle() {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
      localStorage.setItem(STORAGE_KEY, "off");
    } else {
      el.play()
        .then(() => {
          setPlaying(true);
          localStorage.setItem(STORAGE_KEY, "on");
        })
        .catch(() => {});
    }
  }

  return (
    <>
      <audio ref={audioRef} src={SRC} loop preload="none" />
      <button
        onClick={toggle}
        aria-label={playing ? "השתקת מוזיקה" : "הפעלת מוזיקה"}
        className="fixed z-50 bottom-20 md:bottom-5 left-5 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-105 active:scale-95 text-yellow-400"
        style={{
          background: "linear-gradient(135deg,#1e1200,#0d0800)",
          border: "1px solid rgba(251,191,36,0.4)",
          boxShadow: "0 0 20px rgba(251,191,36,0.18)",
        }}
      >
        {playing ? <VolumeOnIcon size={20} /> : <VolumeOffIcon size={20} />}
      </button>
    </>
  );
}
