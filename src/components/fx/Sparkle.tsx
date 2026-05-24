"use client";

import { motion } from "framer-motion";

const SPARKLE_PATH =
  "M0,-40 Q4,-6 40,0 Q4,6 0,40 Q-4,6 -40,0 Q-4,-6 0,-40 Z";
const SPARKLE_SMALL =
  "M0,-22 Q2.5,-3.5 22,0 Q2.5,3.5 0,22 Q-2.5,3.5 -22,0 Q-2.5,-3.5 0,-22 Z";

type Props = {
  size?: number;
};

const SATELLITES = [
  { x: 8, y: 12, size: 14, delay: 0.0, dur: 2.1 },
  { x: 86, y: 70, size: 10, delay: 0.7, dur: 1.9 },
  { x: 92, y: 14, size: 12, delay: 1.3, dur: 2.4 },
  { x: 10, y: 82, size: 9, delay: 0.4, dur: 1.7 },
];

export default function Sparkle({ size = 88 }: Props) {
  return (
    <div
      className="relative inline-block"
      style={{ width: size * 1.6, height: size * 1.6 }}
      aria-hidden
    >
      {/* Soft pulsing halo */}
      <motion.div
        className="absolute inset-0 rounded-full"
        animate={{ scale: [1, 1.35, 1], opacity: [0.35, 0.7, 0.35] }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        style={{
          background:
            "radial-gradient(circle, rgba(254,243,199,0.55) 0%, rgba(251,191,36,0.25) 35%, transparent 70%)",
          filter: "blur(10px)",
        }}
      />

      {/* Main sparkle */}
      <motion.svg
        viewBox="-50 -50 100 100"
        className="absolute"
        style={{
          width: size,
          height: size,
          top: "50%",
          left: "50%",
          marginTop: -size / 2,
          marginLeft: -size / 2,
          filter:
            "drop-shadow(0 0 12px #fbbf24) drop-shadow(0 0 30px rgba(251,191,36,0.7))",
        }}
        animate={{ rotate: 360, scale: [1, 1.08, 0.96, 1.04, 1] }}
        transition={{
          rotate: { duration: 22, repeat: Infinity, ease: "linear" },
          scale: { duration: 2.4, repeat: Infinity, ease: "easeInOut" },
        }}
      >
        <defs>
          <linearGradient id="sparkleGrad" x1="0" y1="-1" x2="0" y2="1">
            <stop offset="0%" stopColor="#fffbeb" />
            <stop offset="55%" stopColor="#fcd34d" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
          <radialGradient id="coreGlow" cx="0" cy="0" r="0.5">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="60%" stopColor="#fef3c7" stopOpacity="0.7" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Primary 4-point sparkle */}
        <path d={SPARKLE_PATH} fill="url(#sparkleGrad)" />

        {/* Secondary 45° sparkle for richness */}
        <g transform="rotate(45)">
          <path d={SPARKLE_SMALL} fill="#fef3c7" opacity="0.75" />
        </g>

        {/* Bright core */}
        <circle r="10" fill="url(#coreGlow)" />
      </motion.svg>

      {/* Satellite twinklers */}
      {SATELLITES.map((s, i) => (
        <motion.div
          key={i}
          className="absolute"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            marginLeft: -s.size / 2,
            marginTop: -s.size / 2,
          }}
          animate={{
            opacity: [0, 1, 0],
            scale: [0.4, 1.15, 0.4],
            rotate: [0, 90],
          }}
          transition={{
            duration: s.dur,
            repeat: Infinity,
            delay: s.delay,
            ease: "easeInOut",
          }}
        >
          <svg
            viewBox="-50 -50 100 100"
            className="w-full h-full"
            style={{
              filter:
                "drop-shadow(0 0 6px #fbbf24) drop-shadow(0 0 12px rgba(251,191,36,0.6))",
            }}
          >
            <path d={SPARKLE_PATH} fill="#fef3c7" />
          </svg>
        </motion.div>
      ))}
    </div>
  );
}
