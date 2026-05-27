"use client";

import { motion, AnimatePresence } from "framer-motion";

type Props = {
  // Change this value to fire a single pulse wave (e.g. timestamp or counter)
  trigger: number | null;
  size?: number;
  color?: string;
  rings?: number;
  duration?: number; // seconds
  className?: string;
};

export default function OnePulse({
  trigger,
  size = 24,
  color = "#fbbf24",
  rings = 2,
  duration = 1.4,
  className = "",
}: Props) {
  return (
    <span
      className={`relative inline-flex items-center justify-center pointer-events-none ${className}`}
      style={{ width: size * 3, height: size * 3 }}
      aria-hidden
    >
      <AnimatePresence>
        {trigger !== null &&
          Array.from({ length: rings }).map((_, i) => (
            <motion.span
              key={`${trigger}-${i}`}
              initial={{ scale: 0.3, opacity: 0.7 }}
              animate={{ scale: 2.6, opacity: 0 }}
              exit={{ opacity: 0 }}
              transition={{
                duration,
                ease: "easeOut",
                delay: (i * duration) / (rings * 2),
              }}
              className="absolute rounded-full"
              style={{
                width: size,
                height: size,
                border: `1.5px solid ${color}`,
                boxShadow: `0 0 14px ${color}`,
              }}
            />
          ))}
      </AnimatePresence>
    </span>
  );
}
