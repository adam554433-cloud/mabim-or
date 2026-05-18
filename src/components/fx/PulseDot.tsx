"use client";

import { motion } from "framer-motion";

type Props = {
  size?: number;          // base dot diameter px
  color?: string;         // glow color (hex/rgb)
  rings?: number;         // how many concentric expanding rings
  speed?: number;         // seconds per pulse cycle
  className?: string;
};

export default function PulseDot({
  size = 14,
  color = "#fbbf24",
  rings = 3,
  speed = 2.2,
  className = "",
}: Props) {
  return (
    <span
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size * 3, height: size * 3 }}
      aria-hidden
    >
      {Array.from({ length: rings }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ scale: 0.4, opacity: 0.55 }}
          animate={{ scale: 2.4, opacity: 0 }}
          transition={{
            duration: speed,
            repeat: Infinity,
            ease: "easeOut",
            delay: (i * speed) / rings,
          }}
          className="absolute rounded-full"
          style={{
            width: size,
            height: size,
            border: `1.5px solid ${color}`,
            boxShadow: `0 0 12px ${color}`,
          }}
        />
      ))}
      <span
        className="relative rounded-full"
        style={{
          width: size,
          height: size,
          background: color,
          boxShadow: `0 0 ${size}px ${color}, 0 0 ${size * 2}px ${color}80`,
        }}
      />
    </span>
  );
}
