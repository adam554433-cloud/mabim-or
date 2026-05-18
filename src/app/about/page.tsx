"use client";

import SiteNav from "@/components/SiteNav";

const SECTIONS = [
  {
    icon: "🕯️",
    title: "המהות",
    body: "מביאים אור הוא מסע משותף של עם ישראל. אנחנו מאמינים שכל מעשה טוב — קטן ככל שיהיה — מאיר את העולם. ביחד, נדליק 50,000 אורות.",
  },
  {
    icon: "📜",
    title: "האתגר השבועי",
    body: "כל שבוע — משימה אחת לכל הקהילה. פשוטה, נגישה, אמיתית. עזרה לשכן, מילה טובה לזר, שיחה למישהו שאהבת.",
  },
  {
    icon: "🌌",
    title: "גוף האור המרכזי",
    body: "פאזל של 50,000 נקודות. כל פעולה — נקודה אחת מאירה. כשהפאזל יושלם — חגיגה משותפת.",
  },
  {
    icon: "🌅",
    title: "הודיה ותובנה יומית",
    body: "כל בוקר — תובנה לרוממות הנפש. כל ערב — רגע של הודיה. כך מתחילים ומסיימים יום.",
  },
  {
    icon: "👥",
    title: "רואים אחד את השני",
    body: "קהילה אמיתית מתחילה ברואים זה את זה. כאן נחשפים לאורות של אחרים, מגיבים, נותנים כוח.",
  },
  {
    icon: "🌀",
    title: "קוד 26",
    body: "13 העקרונות לצופן חיים של חיבור, אמת, אהבה, חירות ושלווה — פורטל חניכה לנוער, הורים ומורים.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen">
      <SiteNav />
      <div className="max-w-2xl mx-auto px-5 py-10 sm:py-14">
        <div className="text-center mb-10">
          <div className="text-5xl mb-3 candle-flicker">🕯️</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-yellow-400 mb-2">
            אודות
          </h1>
          <p className="text-yellow-100/70 text-base">
            אור לעם ישראל — צופן של מעשה, חיבור ואהבה
          </p>
        </div>

        <div className="space-y-3">
          {SECTIONS.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl border border-yellow-400/15 p-5"
              style={{
                background:
                  "linear-gradient(135deg, rgba(40,25,0,0.4) 0%, rgba(10,7,0,0.4) 100%)",
              }}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl flex-shrink-0">{s.icon}</span>
                <div className="text-right">
                  <h3 className="text-yellow-400 font-bold text-lg mb-1">
                    {s.title}
                  </h3>
                  <p className="text-yellow-100/75 text-sm leading-relaxed">
                    {s.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-amber-400/40 text-xs mt-10">
          הפרויקט בפיתוח. השאר/י לנו רעיון? הוסיפו לקהילה.
        </p>
      </div>
    </main>
  );
}
