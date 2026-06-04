"use client";

import type { CSSProperties, ReactNode } from "react";

export const CARD_STYLE: CSSProperties = {
  background: "linear-gradient(135deg, #160f00 0%, #0d0800 100%)",
  border: "1px solid rgba(251,191,36,0.2)",
  boxShadow: "0 0 40px rgba(251,191,36,0.06)",
};

export function Card({
  children,
  className = "",
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div className={`rounded-2xl p-5 ${className}`} style={{ ...CARD_STYLE, ...style }}>
      {children}
    </div>
  );
}

export function Btn({
  children,
  onClick,
  type = "button",
  variant = "primary",
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  variant?: "primary" | "ghost" | "danger";
  disabled?: boolean;
  className?: string;
}) {
  const base =
    "rounded-full px-4 py-2 text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed";
  const styles: Record<string, string> = {
    primary: "bg-yellow-400 hover:bg-yellow-300 text-black",
    ghost:
      "bg-transparent border border-amber-400/30 text-amber-200/80 hover:border-amber-400/60",
    danger: "bg-transparent border border-red-500/40 text-red-300 hover:bg-red-500/10",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

export const inputStyle: CSSProperties = {
  background: "rgba(251,191,36,0.06)",
  border: "1px solid rgba(251,191,36,0.2)",
};

export function fmtDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("he-IL", { year: "numeric", month: "short", day: "numeric" });
}
