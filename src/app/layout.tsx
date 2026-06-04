import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import AccessibilityWidget from "@/components/AccessibilityWidget";
import SiteFooter from "@/components/SiteFooter";
import BottomTabBar from "@/components/BottomTabBar";

const a11yInit = `
(function(){try{
  var s = JSON.parse(localStorage.getItem("nitzotzot:a11y") || "{}");
  var h = document.documentElement;
  if (s.fontSize === "lg")  h.classList.add("a11y-font-lg");
  if (s.fontSize === "xl")  h.classList.add("a11y-font-xl");
  if (s.fontSize === "xxl") h.classList.add("a11y-font-xxl");
  if (s.highContrast)    h.classList.add("a11y-high-contrast");
  if (s.underlineLinks)  h.classList.add("a11y-underline-links");
  if (s.reduceMotion)    h.classList.add("a11y-reduce-motion");
  if (s.dyslexia)        h.classList.add("a11y-dyslexia");
  if (s.pauseAnim)       h.classList.add("a11y-pause-anim");
}catch(e){}})();
`;

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  weight: ["300", "400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "ניצוצות — אור בפעולה",
  description: "ניצוצות — 50,000 מעשים של אור. ביחד אנחנו מאירים את העולם",
  icons: {
    icon: [
      { url: "/icons/community.png", type: "image/png" },
    ],
  },
  openGraph: {
    title: "ניצוצות — אור בפעולה",
    description: "הצטרפו לאתגר השבוע והדליקו את האור שלכם | ניצוצות",
    locale: "he_IL",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className={heebo.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: a11yInit }} />
      </head>
      <body className="font-heebo antialiased text-white pb-20 md:pb-0" style={{ background: "linear-gradient(180deg, #2A2A2A 0%, #000000 100%)" }}>
        {children}
        <SiteFooter />
        <AccessibilityWidget />
        <BottomTabBar />
      </body>
    </html>
  );
}
