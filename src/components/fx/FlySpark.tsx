"use client";

import { motion, AnimatePresence } from "framer-motion";

type Props = {
  // Trigger animation by changing this key (e.g. timestamp)
  trigger: number | null;
  // Target position as percentage of parent (0-100)
  targetXPct?: number;
  targetYPct?: number;
};

export default function FlySpark({
  trigger,
  targetXPct = 50,
  targetYPct = 50,
}: Props) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      <AnimatePresence>
        {trigger !== null && (
          <motion.div
            key={trigger}
            initial={{
              left: "50%",
              top: "100%",
              x: "-50%",
              y: "-50%",
              opacity: 0,
              scale: 0.4,
            }}
            animate={{
              left: `${targetXPct}%`,
              top: `${targetYPct}%`,
              x: "-50%",
              y: "-50%",
              opacity: [0, 1, 1, 0],
              scale: [0.4, 1.6, 1.6, 6],
            }}
            transition={{ duration: 1.4, ease: "easeOut", times: [0, 0.3, 0.7, 1] }}
            exit={{ opacity: 0 }}
            className="absolute"
          >
            <span
              className="block rounded-full"
              style={{
                width: 18,
                height: 18,
                background:
                  "radial-gradient(circle, #fef3c7 0%, #fbbf24 50%, transparent 70%)",
                boxShadow:
                  "0 0 30px #fbbf24, 0 0 60px rgba(251,191,36,0.6), 0 0 100px rgba(251,191,36,0.3)",
              }}
            />
            {/* Trailing tail */}
            <span
              aria-hidden
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: 60,
                height: 60,
                background:
                  "radial-gradient(circle, rgba(251,191,36,0.25) 0%, transparent 60%)",
                filter: "blur(8px)",
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
