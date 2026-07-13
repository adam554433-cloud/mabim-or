import type { Metadata } from "next";
import PortalHub from "@/components/hub/PortalHub";

export const metadata: Metadata = {
  title: "קוד26 · Cod26 — מרכז הפורטלים",
  description:
    "קוד26 — כל הפורטלים תחת קורת גג אחת: הפאזל, הצופן ועוד. חשבון אחד, גישה לכולם.",
  openGraph: {
    title: "קוד26 · Cod26 — מרכז הפורטלים",
    description: "כל הפורטלים תחת קורת גג אחת — חשבון אחד, גישה לכולם",
    locale: "he_IL",
  },
};

export default function RootPage() {
  return <PortalHub />;
}
