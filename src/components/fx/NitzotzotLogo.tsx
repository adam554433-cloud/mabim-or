"use client";

// Placeholder logo for "ניצוצות" — replace when final brand asset arrives.
import { useId } from "react";

type Size = "icon" | "full";

type Props = {
  size?: Size;
  pixelSize?: number;
  className?: string;
  showTagline?: boolean;
  textColor?: string;
};

const SPARKLE_PATH =
  "M0,-44 C6,-14 14,-6 44,0 C14,6 6,14 0,44 C-6,14 -14,6 -44,0 C-14,-6 -6,-14 0,-44 Z";

export default function NitzotzotLogo({
  size = "full",
  pixelSize,
  className = "",
  showTagline = true,
  textColor = "#FFD345",
}: Props) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const mainGrad = `nlogo-main-${id}`;
  const haloGrad = `nlogo-halo-${id}`;

  const dim = pixelSize ?? (size === "icon" ? 28 : 56);

  const mark = (
    <svg
      viewBox="-60 -60 120 120"
      width={dim}
      height={dim}
      className="nlogo-mark"
      style={{
        filter:
          "drop-shadow(0 0 10px rgba(255,211,69,0.65)) drop-shadow(0 0 22px rgba(255,211,69,0.30))",
      }}
      aria-hidden
    >
      <defs>
        <radialGradient id={haloGrad} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,211,69,0.55)" />
          <stop offset="60%" stopColor="rgba(255,211,69,0.15)" />
          <stop offset="100%" stopColor="rgba(255,211,69,0)" />
        </radialGradient>
        <linearGradient id={mainGrad} x1="0" y1="-1" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF6D1" />
          <stop offset="55%" stopColor="#FFD345" />
          <stop offset="100%" stopColor="#CAA928" />
        </linearGradient>
      </defs>
      <circle cx="0" cy="0" r="56" fill={`url(#${haloGrad})`} />
      <path d={SPARKLE_PATH} fill={`url(#${mainGrad})`} />
      <path
        d={SPARKLE_PATH}
        transform="rotate(45) scale(0.55)"
        fill="#FFF6D1"
        opacity="0.85"
      />
    </svg>
  );

  if (size === "icon") {
    return <span className={`inline-flex items-center justify-center ${className}`}>{mark}</span>;
  }

  return (
    <span
      className={`inline-flex flex-col items-center justify-center gap-1 ${className}`}
      aria-label="הפאזל — ניצוצות אור בפעולה"
    >
      <span className="inline-flex items-center gap-2">
        {mark}
        <span
          className="font-extrabold tracking-tight"
          style={{
            color: textColor,
            fontSize: dim * 0.7,
            lineHeight: 1,
            textShadow: "0 0 18px rgba(255,211,69,0.45)",
          }}
        >
          הפאזל
        </span>
      </span>
      {showTagline && (
        <span
          className="font-medium tracking-wide"
          style={{
            color: "#FDE494",
            fontSize: dim * 0.22,
            opacity: 0.85,
            letterSpacing: "0.08em",
          }}
        >
          ניצוצות אור בפעולה
        </span>
      )}
    </span>
  );
}
