"use client";

import { ReactNode } from "react";
import SiteNav from "./SiteNav";

type Props = {
  children: ReactNode;
  showNav?: boolean;
};

/**
 * Wraps a page in the bright cream theme.
 * Use for intimate / contemplative pages (gratitude, insight, profile, about).
 */
export default function LightPage({ children, showNav = true }: Props) {
  return (
    <main
      className="min-h-screen relative"
      style={{
        background:
          "radial-gradient(ellipse 100% 70% at 50% 0%, #FFFCF0 0%, #FCFAEA 50%, #F4EFD8 100%)",
        color: "#2A2A2A",
      }}
    >
      {showNav && <SiteNav theme="light" />}
      {children}
    </main>
  );
}
