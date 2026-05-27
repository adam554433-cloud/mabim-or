"use client";

import LightPage from "@/components/LightPage";

const INK = "#2A2A2A";
const INK_SOFT = "#5A5A5A";
const GOLD_DK = "#CAA928";

const SECTIONS = [
  {
    icon: "✨",
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
    <LightPage>
      <div className="max-w-2xl mx-auto px-5 py-12 sm:py-16">
        <div className="text-center mb-10">
          <div className="text-5xl mb-3 candle-flicker">✨</div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-2" style={{ color: INK }}>
            אודות
          </h1>
          <p className="text-base" style={{ color: INK_SOFT }}>
            אור לעם ישראל — צופן של מעשה, חיבור ואהבה
          </p>
        </div>

        <div className="space-y-3">
          {SECTIONS.map((s, i) => (
            <div
              key={i}
              className="rounded-2xl p-5"
              style={{
                background: "#FFFFFF",
                border: `1px solid ${GOLD_DK}22`,
                boxShadow: "0 4px 14px rgba(202,169,40,0.06)",
              }}
            >
              <div className="flex items-start gap-3">
                <span className="text-3xl flex-shrink-0">{s.icon}</span>
                <div className="text-right">
                  <h3 className="font-bold text-lg mb-1" style={{ color: INK }}>
                    {s.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: INK_SOFT }}>
                    {s.body}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p
          className="text-center text-sm sm:text-base mt-10 font-semibold px-4 py-3 rounded-xl max-w-md mx-auto"
          style={{
            color: INK,
            background: `${GOLD_DK}1A`,
            border: `1px solid ${GOLD_DK}55`,
          }}
        >
          הפרויקט בפיתוח. יש לכם רעיון? הצטרפו לקהילה ושתפו אותנו.
        </p>
      </div>
    </LightPage>
  );
}
