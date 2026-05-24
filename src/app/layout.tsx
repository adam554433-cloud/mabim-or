import type { Metadata } from "next";
import { Assistant } from "next/font/google";
import "./globals.css";

const assistant = Assistant({
  subsets: ["hebrew", "latin"],
  variable: "--font-assistant",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "מביאים אור",
  description: "50,000 מעשים של אור — ביחד אנחנו מאירים את העולם",
  icons: {
    icon: [
      { url: "/icons/community.png", type: "image/png" },
    ],
  },
  openGraph: {
    title: "מביאים אור",
    description: "הצטרף לאתגר השבוע והדלק את האור שלך | מביאים אור",
    locale: "he_IL",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl" className={assistant.variable}>
      <body className="font-assistant antialiased bg-[#0a0700] text-white" style={{ background: "radial-gradient(ellipse 140% 55% at 50% -5%, #1e1000 0%, #0a0700 55%)" }}>
        {children}
      </body>
    </html>
  );
}
