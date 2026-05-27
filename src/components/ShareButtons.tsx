"use client";

import { useState } from "react";

type Props = {
  puzzleNumber: number;
  url?: string;
};

function buildText(puzzleNumber: number, url: string) {
  return `הדלקתי את האור ה-${puzzleNumber.toLocaleString("he-IL")} מתוך 50,000 בפאזל ניצוצות 🕯️\nביחד מאירים את העולם — הצטרפו אליי:\n${url}`;
}

export default function ShareButtons({ puzzleNumber, url }: Props) {
  const [copied, setCopied] = useState(false);

  const shareUrl =
    url ??
    (typeof window !== "undefined"
      ? window.location.origin
      : "https://nitzotzot.com");

  const text = buildText(puzzleNumber, shareUrl);
  const encText = encodeURIComponent(text);
  const encUrl = encodeURIComponent(shareUrl);

  const whatsapp = `https://wa.me/?text=${encText}`;
  const twitter = `https://twitter.com/intent/tweet?text=${encText}`;
  const facebook = `https://www.facebook.com/sharer/sharer.php?u=${encUrl}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // ignore
    }
  }

  async function nativeShare() {
    if (typeof navigator === "undefined" || !navigator.share) return;
    try {
      await navigator.share({
        title: "ניצוצות — אור בפעולה",
        text,
        url: shareUrl,
      });
    } catch {
      // user cancelled
    }
  }

  const canNativeShare =
    typeof navigator !== "undefined" && typeof navigator.share === "function";

  const btnBase =
    "flex items-center justify-center w-11 h-11 rounded-full transition-all hover:scale-110 active:scale-95";

  return (
    <div className="mt-5">
      <p className="text-amber-300/70 text-xs mb-2.5">שתפו את ההישג שלכם</p>
      <div className="flex items-center justify-center gap-2.5 flex-row-reverse">
        <a
          href={whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="שיתוף בוואטסאפ"
          className={btnBase}
          style={{ background: "#25D366", color: "#fff" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.768.967-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.057 21.6h-.014a9.42 9.42 0 0 1-4.8-1.317l-.345-.205-3.57.937.954-3.482-.225-.357a9.4 9.4 0 0 1-1.439-5.011c.002-5.197 4.232-9.427 9.432-9.427 2.519.001 4.886.983 6.668 2.766a9.36 9.36 0 0 1 2.762 6.665c-.002 5.198-4.232 9.428-9.43 9.428m8.027-17.452A11.36 11.36 0 0 0 12.056 0C5.832 0 .765 5.064.762 11.286c0 1.989.519 3.93 1.508 5.642L.67 23.7a.5.5 0 0 0 .613.62l6.928-1.816a11.3 11.3 0 0 0 5.397 1.374h.005c6.222 0 11.29-5.066 11.293-11.29a11.27 11.27 0 0 0-3.297-7.984"/>
          </svg>
        </a>

        <a
          href={twitter}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="שיתוף בטוויטר"
          className={btnBase}
          style={{ background: "#000", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
          </svg>
        </a>

        <a
          href={facebook}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="שיתוף בפייסבוק"
          className={btnBase}
          style={{ background: "#1877F2", color: "#fff" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
          </svg>
        </a>

        <button
          onClick={copyLink}
          aria-label="העתקת הטקסט"
          className={btnBase}
          style={{
            background: copied ? "rgba(255,211,69,0.25)" : "rgba(255,211,69,0.10)",
            color: "#FFD345",
            border: "1px solid rgba(255,211,69,0.35)",
          }}
        >
          {copied ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          )}
        </button>

        {canNativeShare && (
          <button
            onClick={nativeShare}
            aria-label="שיתוף"
            className={`${btnBase} sm:hidden`}
            style={{
              background: "rgba(255,211,69,0.10)",
              color: "#FFD345",
              border: "1px solid rgba(255,211,69,0.35)",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
            </svg>
          </button>
        )}
      </div>

      {copied && (
        <p className="text-center text-yellow-300/80 text-xs mt-2">הטקסט הועתק ✓</p>
      )}
    </div>
  );
}
