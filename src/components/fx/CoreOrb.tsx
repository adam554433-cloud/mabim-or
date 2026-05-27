"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useMemo } from "react";

type Props = {
  intensity: number;        // 0..1 — visual fullness (e.g. litCount / 50000)
  pulseTrigger?: number | null; // change this to fire a one-shot pulse wave
  size?: number;            // base orb diameter in px
  color?: string;
  showOrbits?: boolean;     // tiny satellite sparks orbiting the orb
  className?: string;
};

const SAT_COUNT = 6;

export default function CoreOrb({
  intensity,
  pulseTrigger = null,
  size = 160,
  color = "#fbbf24",
  showOrbits = true,
  className = "",
}: Props) {
  const clamped = Math.max(0.05, Math.min(1, intensity));
  const coreScale = 0.55 + clamped * 0.45;        // 0.55..1.0
  const haloScale = 0.9 + clamped * 0.6;          // 0.9..1.5
  const haloOpacity = 0.25 + clamped * 0.45;      // 0.25..0.7

  const satellites = useMemo(
    () =>
      Array.from({ length: SAT_COUNT }, (_, i) => ({
        radius: size * (0.55 + (i % 3) * 0.08),
        dur: 14 + (i * 2.7) % 9,
        delay: (i * 0.7) % 4,
        dot: 3 + (i % 3),
        dir: i % 2 === 0 ? 1 : -1,
      })),
    [size]
  );

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size * 2.2, height: size * 2.2 }}
      aria-hidden
    >
      {/* Outer halo — breathing with intensity */}
      <motion.span
        className="absolute rounded-full"
        animate={{
          scale: [haloScale, haloScale * 1.12, haloScale],
          opacity: [haloOpacity * 0.7, haloOpacity, haloOpacity * 0.7],
        }}
        transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: size * 1.9,
          height: size * 1.9,
          background: `radial-gradient(circle, ${color}55 0%, ${color}22 35%, transparent 70%)`,
          filter: "blur(18px)",
        }}
      />

      {/* Mid halo */}
      <motion.span
        className="absolute rounded-full"
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.55, 0.8, 0.55],
        }}
        transition={{ duration: 3.1, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: size * 1.2 * coreScale,
          height: size * 1.2 * coreScale,
          background: `radial-gradient(circle, ${color}aa 0%, ${color}44 50%, transparent 75%)`,
          filter: "blur(8px)",
        }}
      />

      {/* Core orb — grows with intensity */}
      <motion.span
        className="absolute rounded-full"
        animate={{ scale: [coreScale, coreScale * 1.04, coreScale] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        style={{
          width: size * 0.55,
          height: size * 0.55,
          background: `radial-gradient(circle, #fffbeb 0%, ${color} 45%, ${color}66 80%, transparent 100%)`,
          boxShadow: `0 0 ${size * 0.4}px ${color}, 0 0 ${size * 0.8}px ${color}aa, inset 0 0 ${size * 0.15}px #fffbeb`,
        }}
      />

      {/* Pulse wave — fires on pulseTrigger change */}
      <AnimatePresence>
        {pulseTrigger !== null && pulseTrigger !== undefined && (
          <motion.span
            key={pulseTrigger}
            className="absolute rounded-full pointer-events-none"
            initial={{ scale: 0.4, opacity: 0.9 }}
            animate={{ scale: 2.6, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeOut" }}
            style={{
              width: size * 0.55,
              height: size * 0.55,
              border: `2px solid ${color}`,
              boxShadow: `0 0 20px ${color}`,
            }}
          />
        )}
      </AnimatePresence>

      {/* Orbiting satellite sparks */}
      {showOrbits &&
        satellites.map((s, i) => (
          <motion.span
            key={i}
            className="absolute"
            animate={{ rotate: 360 * s.dir }}
            transition={{
              duration: s.dur,
              repeat: Infinity,
              ease: "linear",
              delay: s.delay,
            }}
            style={{
              width: s.radius * 2,
              height: s.radius * 2,
              borderRadius: "50%",
            }}
          >
            <span
              className="absolute rounded-full"
              style={{
                width: s.dot,
                height: s.dot,
                top: -s.dot / 2,
                left: "50%",
                marginLeft: -s.dot / 2,
                background: "#fef3c7",
                boxShadow: `0 0 ${s.dot * 2}px ${color}, 0 0 ${s.dot * 4}px ${color}88`,
              }}
            />
          </motion.span>
        ))}
    </div>
  );
}
