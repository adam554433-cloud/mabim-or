"use client";

import { motion } from "framer-motion";

export type ConstellationStep = {
  label: string;
  sub?: string;
  done: boolean;
  active?: boolean; // currently in progress
};

type Props = {
  steps: ConstellationStep[];
  title?: string;
};

export default function ProgressConstellation({ steps, title }: Props) {
  return (
    <div className="w-full max-w-md mx-auto px-2 py-4">
      {title && (
        <h3 className="text-amber-400/70 text-xs tracking-[0.25em] font-semibold text-center mb-6">
          {title}
        </h3>
      )}
      <ol className="relative">
        {/* Glow line */}
        <span
          aria-hidden
          className="absolute right-[18px] top-3 bottom-3 w-px"
          style={{
            background:
              "linear-gradient(180deg, rgba(251,191,36,0.55) 0%, rgba(251,191,36,0.12) 100%)",
            boxShadow: "0 0 6px rgba(251,191,36,0.3)",
          }}
        />
        {steps.map((s, i) => {
          const isLast = i === steps.length - 1;
          const dim = !s.done && !s.active;
          return (
            <li
              key={i}
              className={`relative pr-12 ${isLast ? "" : "pb-7"} text-right`}
            >
              {/* Star */}
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.08, type: "spring", stiffness: 220 }}
                className="absolute right-[10px] top-1 flex items-center justify-center"
                style={{ width: 18, height: 18 }}
              >
                {s.done ? (
                  <span
                    className="block w-[14px] h-[14px] rounded-full"
                    style={{
                      background: "#fbbf24",
                      boxShadow: "0 0 14px #fbbf24, 0 0 24px rgba(251,191,36,0.6)",
                    }}
                  />
                ) : s.active ? (
                  <>
                    <motion.span
                      animate={{ scale: [1, 2.2], opacity: [0.6, 0] }}
                      transition={{ duration: 1.6, repeat: Infinity }}
                      className="absolute block w-[14px] h-[14px] rounded-full"
                      style={{
                        border: "1.5px solid #fbbf24",
                        boxShadow: "0 0 10px #fbbf24",
                      }}
                    />
                    <span
                      className="block w-[10px] h-[10px] rounded-full"
                      style={{
                        background: "#fbbf24",
                        boxShadow: "0 0 12px #fbbf24",
                      }}
                    />
                  </>
                ) : (
                  <span
                    className="block w-[10px] h-[10px] rounded-full border"
                    style={{
                      borderColor: "rgba(251,191,36,0.35)",
                      background: "rgba(251,191,36,0.07)",
                    }}
                  />
                )}
              </motion.span>

              {/* Text */}
              <motion.div
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 + 0.1 }}
              >
                <div
                  className={`font-bold text-sm ${
                    dim ? "text-gray-500" : "text-yellow-100"
                  }`}
                >
                  {s.label}
                </div>
                {s.sub && (
                  <div
                    className={`text-xs mt-0.5 ${
                      dim ? "text-gray-600" : "text-amber-400/60"
                    }`}
                  >
                    {s.sub}
                  </div>
                )}
              </motion.div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
