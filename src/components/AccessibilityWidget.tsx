"use client";

import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "nitzotzot:a11y";

type FontSize = "default" | "lg" | "xl" | "xxl";

type Settings = {
  fontSize: FontSize;
  highContrast: boolean;
  underlineLinks: boolean;
  reduceMotion: boolean;
  dyslexia: boolean;
  pauseAnim: boolean;
};

const DEFAULTS: Settings = {
  fontSize: "default",
  highContrast: false,
  underlineLinks: false,
  reduceMotion: false,
  dyslexia: false,
  pauseAnim: false,
};

function applyToHtml(s: Settings) {
  if (typeof document === "undefined") return;
  const html = document.documentElement;
  html.classList.remove("a11y-font-lg", "a11y-font-xl", "a11y-font-xxl");
  if (s.fontSize === "lg") html.classList.add("a11y-font-lg");
  if (s.fontSize === "xl") html.classList.add("a11y-font-xl");
  if (s.fontSize === "xxl") html.classList.add("a11y-font-xxl");
  html.classList.toggle("a11y-high-contrast", s.highContrast);
  html.classList.toggle("a11y-underline-links", s.underlineLinks);
  html.classList.toggle("a11y-reduce-motion", s.reduceMotion);
  html.classList.toggle("a11y-dyslexia", s.dyslexia);
  html.classList.toggle("a11y-pause-anim", s.pauseAnim);
}

function loadSettings(): Settings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

export default function AccessibilityWidget() {
  const [open, setOpen] = useState(false);
  // Defer reading localStorage to after mount via `useSyncExternalStore` semantics;
  // initialize with defaults to keep SSR + first client render aligned.
  const [settings, setSettings] = useState<Settings>(DEFAULTS);
  const panelRef = useRef<HTMLDivElement | null>(null);

  // After mount, hydrate from localStorage and apply (the inline init script
  // already applied classes; this syncs React state to match).
  useEffect(() => {
    const s = loadSettings();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSettings(s);
    applyToHtml(s);
  }, []);

  // Persist + apply on change
  function update(patch: Partial<Settings>) {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
      applyToHtml(next);
      return next;
    });
  }

  function reset() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setSettings(DEFAULTS);
    applyToHtml(DEFAULTS);
  }

  // Keyboard shortcut Alt+A + Escape to close
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.altKey && (e.key === "a" || e.key === "A")) {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Focus trap when open
  useEffect(() => {
    if (!open) return;
    const first = panelRef.current?.querySelector<HTMLElement>(
      "button, [tabindex]:not([tabindex='-1'])"
    );
    first?.focus();
  }, [open]);

  const fontOptions: { v: FontSize; label: string }[] = [
    { v: "default", label: "רגיל" },
    { v: "lg", label: "גדול" },
    { v: "xl", label: "גדול מאוד" },
    { v: "xxl", label: "ענק" },
  ];

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="הגדרות נגישות (Alt+A)"
        aria-expanded={open}
        className="fixed bottom-5 right-5 z-50 w-12 h-12 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        style={{
          background: "#FFD345",
          color: "#000",
          boxShadow:
            "0 4px 16px rgba(0,0,0,0.45), 0 0 24px rgba(255,211,69,0.35)",
        }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <circle cx="12" cy="3.5" r="2.2" />
          <path d="M21 8.5h-7v3.7l1.9 9.1-2 .4-1.9-8.9-1.9 8.9-2-.4 1.9-9.1V8.5H3v-2h18z" />
        </svg>
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            style={{ background: "rgba(0,0,0,0.5)" }}
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            ref={panelRef}
            role="dialog"
            aria-label="הגדרות נגישות"
            className="fixed bottom-20 right-5 z-50 w-[320px] max-w-[calc(100vw-2.5rem)] rounded-2xl p-5"
            style={{
              background: "linear-gradient(135deg,#1e1200,#0d0800)",
              border: "1px solid rgba(255,211,69,0.35)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.6), 0 0 40px rgba(255,211,69,0.15)",
              color: "#fff",
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-lg" style={{ color: "#FFD345" }}>
                הגדרות נגישות
              </h2>
              <button
                onClick={() => setOpen(false)}
                aria-label="סגור"
                className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Font size */}
            <div className="mb-4">
              <p className="text-amber-200/80 text-xs mb-1.5">גודל גופן</p>
              <div className="grid grid-cols-4 gap-1.5">
                {fontOptions.map((o) => {
                  const active = settings.fontSize === o.v;
                  return (
                    <button
                      key={o.v}
                      onClick={() => update({ fontSize: o.v })}
                      aria-pressed={active}
                      className="text-xs py-2 rounded-lg transition-colors"
                      style={{
                        background: active ? "#FFD345" : "rgba(255,211,69,0.08)",
                        color: active ? "#000" : "#fff",
                        border: active ? "1px solid #FFD345" : "1px solid rgba(255,211,69,0.25)",
                        fontWeight: active ? 700 : 500,
                      }}
                    >
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-1.5">
              <ToggleRow
                label="ניגודיות גבוהה"
                checked={settings.highContrast}
                onChange={(v) => update({ highContrast: v })}
              />
              <ToggleRow
                label="הדגשת קישורים"
                checked={settings.underlineLinks}
                onChange={(v) => update({ underlineLinks: v })}
              />
              <ToggleRow
                label="הקטנת אנימציות"
                checked={settings.reduceMotion}
                onChange={(v) => update({ reduceMotion: v })}
              />
              <ToggleRow
                label="עצירת אנימציות"
                checked={settings.pauseAnim}
                onChange={(v) => update({ pauseAnim: v })}
              />
              <ToggleRow
                label="גופן ידידותי לדיסלקציה"
                checked={settings.dyslexia}
                onChange={(v) => update({ dyslexia: v })}
              />
            </div>

            <div className="mt-4 flex gap-2">
              <button
                onClick={reset}
                className="flex-1 py-2.5 rounded-full text-sm font-semibold"
                style={{
                  background: "rgba(255,211,69,0.10)",
                  color: "#FFD345",
                  border: "1px solid rgba(255,211,69,0.30)",
                }}
              >
                איפוס
              </button>
              <a
                href="/accessibility"
                className="flex-1 py-2.5 rounded-full text-sm font-semibold text-center"
                style={{ background: "#FFD345", color: "#000" }}
              >
                הצהרת נגישות
              </a>
            </div>

            <p className="text-amber-100/40 text-[11px] mt-3 text-center">
              קיצור מקלדת: Alt+A
            </p>
          </div>
        </>
      )}
    </>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label
      className="flex items-center justify-between py-2 px-3 rounded-lg cursor-pointer"
      style={{
        background: checked ? "rgba(255,211,69,0.12)" : "rgba(255,211,69,0.04)",
        border: `1px solid ${checked ? "rgba(255,211,69,0.45)" : "rgba(255,211,69,0.15)"}`,
      }}
    >
      <span className="text-sm">{label}</span>
      <span
        className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
        style={{ background: checked ? "#FFD345" : "rgba(255,255,255,0.15)" }}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <span
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
          style={{
            insetInlineStart: checked ? "calc(100% - 1.125rem)" : "0.125rem",
          }}
        />
      </span>
    </label>
  );
}
