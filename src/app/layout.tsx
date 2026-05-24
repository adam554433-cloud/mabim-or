import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";

const heebo = Heebo({
  subsets: ["hebrew", "latin"],
  variable: "--font-heebo",
  weight: ["300", "400", "500", "700", "800"],
});

export const metadata: Metadata = {
  title: "ניצוצות — אור בפעולה",
  description: "ניצוצות: אור בפעולה — ביחד אנחנו מאירים את העולם",
  icons: {
    icon: [
      { url: "/icons/community.png", type: "image/png" },
    ],
  },
  openGraph: {
    title: "ניצוצות — אור בפעולה",
    description: "הצטרף לאתגר השבוע והדלק את הניצוץ שלך | ניצוצות",
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
      <body className="font-heebo antialiased text-white" style={{ background: "linear-gradient(180deg, #2A2A2A 0%, #000000 100%)" }}>
        {children}
      </body>
    </html>
  );
}
