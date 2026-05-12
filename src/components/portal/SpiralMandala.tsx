"use client";

import { motion } from "framer-motion";
import { PRINCIPLES } from "@/lib/principles";

type Props = {
  onSelect: (id: number) => void;
};

const SIZE = 720;
const CENTER = SIZE / 2;
const OUTER_R = 340;
const INNER_R = 90;
const SLICE = 360 / 13;

// Convert polar to cartesian
function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// Build a wedge path
function wedge(startDeg: number, endDeg: number, rInner: number, rOuter: number) {
  const p1 = polar(CENTER, CENTER, rOuter, startDeg);
  const p2 = polar(CENTER, CENTER, rOuter, endDeg);
  const p3 = polar(CENTER, CENTER, rInner, endDeg);
  const p4 = polar(CENTER, CENTER, rInner, startDeg);
  const largeArc = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${p1.x} ${p1.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${p4.x} ${p4.y}`,
    `Z`,
  ].join(" ");
}

export default function SpiralMandala({ onSelect }: Props) {
  return (
    <div className="relative w-full max-w-[720px] mx-auto aspect-square select-none">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(251,191,36,0.18) 0%, rgba(251,191,36,0.05) 35%, transparent 70%)",
        }}
      />

      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} className="relative w-full h-full">
        <defs>
          {/* Stone-mosaic gradient for each wedge */}
          {PRINCIPLES.map((p) => (
            <radialGradient
              key={`grad-${p.id}`}
              id={`grad-${p.id}`}
              cx="50%"
              cy="50%"
              r="80%"
            >
              <stop offset="0%" stopColor={p.color} stopOpacity="0.35" />
              <stop offset="60%" stopColor={p.color} stopOpacity="0.18" />
              <stop offset="100%" stopColor="#0a0700" stopOpacity="0.95" />
            </radialGradient>
          ))}

          {/* Lantern glow */}
          <radialGradient id="lantern" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="1" />
            <stop offset="40%" stopColor="#fbbf24" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
          </radialGradient>

          {/* Center glow */}
          <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef3c7" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#fbbf24" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#92400e" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer ring decoration (mosaic pebbles) */}
        <circle
          cx={CENTER}
          cy={CENTER}
          r={OUTER_R + 18}
          fill="none"
          stroke="rgba(251,191,36,0.15)"
          strokeWidth="1.5"
          strokeDasharray="4 3"
        />

        {/* 13 Wedges */}
        {PRINCIPLES.map((p, i) => {
          const startDeg = i * SLICE - 90; // start at top
          const endDeg = startDeg + SLICE;
          const midDeg = startDeg + SLICE / 2;
          const labelPos = polar(CENTER, CENTER, (OUTER_R + INNER_R) / 2 + 30, midDeg);
          const numPos = polar(CENTER, CENTER, INNER_R + 24, midDeg);

          // Rotate label so it reads outward (RTL-friendly)
          const labelRotate = midDeg > 90 && midDeg < 270 ? midDeg + 180 : midDeg;

          return (
            <motion.g
              key={p.id}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.05 * i, duration: 0.5, ease: "easeOut" }}
              style={{ cursor: "pointer", transformOrigin: `${CENTER}px ${CENTER}px` }}
              onClick={() => onSelect(p.id)}
              whileHover={{ scale: 1.02 }}
            >
              <path
                d={wedge(startDeg, endDeg, INNER_R, OUTER_R)}
                fill={`url(#grad-${p.id})`}
                stroke={p.ringColor}
                strokeWidth="1.2"
                className="transition-all duration-200 hover:brightness-150"
              />
              {/* Principle number */}
              <text
                x={numPos.x}
                y={numPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={p.color}
                fontSize="14"
                fontWeight="700"
                opacity="0.85"
                style={{ pointerEvents: "none" }}
              >
                {p.id}
              </text>
              {/* Title — curved-ish via rotation */}
              <text
                x={labelPos.x}
                y={labelPos.y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#fef3c7"
                fontSize="13"
                fontWeight="600"
                transform={`rotate(${labelRotate} ${labelPos.x} ${labelPos.y})`}
                style={{ pointerEvents: "none" }}
              >
                {p.title.length > 18 ? p.title.slice(0, 17) + "…" : p.title}
              </text>
            </motion.g>
          );
        })}

        {/* Lanterns between wedges */}
        {PRINCIPLES.map((_, i) => {
          const deg = i * SLICE - 90;
          const pos = polar(CENTER, CENTER, OUTER_R + 6, deg);
          return (
            <motion.circle
              key={`lantern-${i}`}
              cx={pos.x}
              cy={pos.y}
              r="9"
              fill="url(#lantern)"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{
                duration: 2 + (i % 3) * 0.4,
                repeat: Infinity,
                delay: i * 0.15,
              }}
            />
          );
        })}

        {/* Center disk */}
        <motion.circle
          cx={CENTER}
          cy={CENTER}
          r={INNER_R - 6}
          fill="url(#centerGlow)"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        <circle
          cx={CENTER}
          cy={CENTER}
          r={INNER_R - 6}
          fill="none"
          stroke="rgba(251,191,36,0.6)"
          strokeWidth="1.5"
        />
        <text
          x={CENTER}
          y={CENTER - 12}
          textAnchor="middle"
          fill="#fbbf24"
          fontSize="14"
          fontWeight="700"
          letterSpacing="2"
        >
          קוד 26
        </text>
        <text
          x={CENTER}
          y={CENTER + 10}
          textAnchor="middle"
          fill="#fef3c7"
          fontSize="18"
          fontWeight="800"
        >
          הכל אחד
        </text>
        <text
          x={CENTER}
          y={CENTER + 30}
          textAnchor="middle"
          fill="rgba(254,243,199,0.6)"
          fontSize="10"
          letterSpacing="3"
        >
          ה׳ אחד
        </text>
      </svg>
    </div>
  );
}
