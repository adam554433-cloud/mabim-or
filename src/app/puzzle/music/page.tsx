"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AmbientEngine, PRESETS, type AmbientPreset } from "@/lib/ambient";
import { VolumeOnIcon, VolumeOffIcon } from "@/components/icons";

export default function MusicPage() {
  const engineRef = useRef<AmbientEngine | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.7);

  // Lazily create the engine on the client; tear it down on unmount.
  useEffect(() => {
    engineRef.current = new AmbientEngine();
    return () => {
      engineRef.current?.dispose();
      engineRef.current = null;
    };
  }, []);

  function toggle(preset: AmbientPreset) {
    const engine = engineRef.current;
    if (!engine) return;
    if (playingId === preset.id) {
      engine.stop();
      setPlayingId(null);
    } else {
      engine.play(preset);
      setPlayingId(preset.id);
    }
  }

  function onVolume(v: number) {
    setVolume(v);
    engineRef.current?.setVolume(v);
  }

  return (
    <main
      dir="rtl"
      className="min-h-screen text-yellow-50 px-5 py-10 sm:py-14"
      style={{
        background:
          "radial-gradient(120% 80% at 50% 0%, #1a1000 0%, #0a0600 45%, #050300 100%)",
      }}
    >
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <header className="text-center mb-10">
          <Link
            href="/puzzle"
            className="inline-block text-amber-400/60 text-sm mb-6 hover:text-amber-300 transition-colors"
          >
            → חזרה לאתר
          </Link>
          <h1 className="text-3xl sm:text-4xl font-bold text-amber-300 mb-3">
            מוזיקת תדרים
          </h1>
          <p className="text-yellow-100/60 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            מוזיקה מקורית שנוצרת בזמן אמת — אין שני רגעים זהים. לחצו על כל כרטיס
            כדי להאזין, ובחרו את האווירה שתלווה את האתר.
          </p>
        </header>

        {/* Volume */}
        <div className="flex items-center gap-3 justify-center mb-8 text-amber-400/70">
          <button
            onClick={() => onVolume(volume > 0 ? 0 : 0.7)}
            aria-label="עוצמת קול"
            className="hover:text-amber-300 transition-colors"
          >
            {volume > 0 ? <VolumeOnIcon size={20} /> : <VolumeOffIcon size={20} />}
          </button>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => onVolume(parseFloat(e.target.value))}
            className="w-48 accent-amber-400"
            aria-label="מחוון עוצמת קול"
          />
        </div>

        {/* Preset cards */}
        <div className="grid sm:grid-cols-2 gap-4">
          {PRESETS.map((preset) => {
            const active = playingId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => toggle(preset)}
                className="relative text-right rounded-2xl p-5 transition-all overflow-hidden group"
                style={{
                  background: active
                    ? "linear-gradient(135deg,#251600,#120a00)"
                    : "linear-gradient(135deg,#160d00,#0a0500)",
                  border: `1px solid ${active ? preset.color : "rgba(251,191,36,0.18)"}`,
                  boxShadow: active
                    ? `0 0 32px ${preset.color}33`
                    : "0 0 0 transparent",
                }}
              >
                {/* pulsing rings when active */}
                {active && (
                  <span className="pointer-events-none absolute -left-8 -top-8 w-32 h-32">
                    <span
                      className="absolute inset-0 rounded-full animate-ping"
                      style={{ background: `${preset.color}18` }}
                    />
                  </span>
                )}

                <div className="flex items-start justify-between gap-3 relative">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className="text-lg font-bold"
                        style={{ color: preset.color }}
                      >
                        {preset.name}
                      </span>
                    </div>
                    <div
                      className="text-xs font-mono tracking-wider mb-2 opacity-70"
                      style={{ color: preset.color }}
                    >
                      {preset.hz}
                    </div>
                    <p className="text-yellow-100/55 text-sm leading-relaxed">
                      {preset.desc}
                    </p>
                  </div>

                  {/* play / stop indicator */}
                  <span
                    className="shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-transform group-hover:scale-105"
                    style={{
                      border: `1px solid ${preset.color}66`,
                      color: preset.color,
                      background: active ? `${preset.color}1a` : "transparent",
                    }}
                  >
                    {active ? (
                      // stop (square)
                      <span
                        className="block w-3 h-3 rounded-[2px]"
                        style={{ background: preset.color }}
                      />
                    ) : (
                      // play (triangle, RTL-mirrored to point right)
                      <span
                        className="block w-0 h-0"
                        style={{
                          borderTop: "7px solid transparent",
                          borderBottom: "7px solid transparent",
                          borderRight: `11px solid ${preset.color}`,
                        }}
                      />
                    )}
                  </span>
                </div>

                {/* animated equaliser bars when active */}
                {active && (
                  <div className="flex items-end gap-1 h-6 mt-4">
                    {[0, 1, 2, 3, 4, 5, 6].map((i) => (
                      <span
                        key={i}
                        className="flex-1 rounded-full eq-bar"
                        style={{
                          background: preset.color,
                          animationDelay: `${i * 0.12}s`,
                        }}
                      />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        <p className="text-center text-yellow-100/35 text-xs mt-10 leading-relaxed">
          כשתבחרו פריסט אהוב — אגדיר אותו כפסקול ברירת המחדל של האתר,
          <br />
          שיתחיל בלחיצה על כפתור המוזיקה. אפשר גם לשייך פריסט שונה לכל עמוד.
        </p>
      </div>

      <style jsx>{`
        @keyframes eq {
          0%,
          100% {
            height: 20%;
          }
          50% {
            height: 100%;
          }
        }
        .eq-bar {
          animation: eq 0.9s ease-in-out infinite;
        }
      `}</style>
    </main>
  );
}
