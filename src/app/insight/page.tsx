"use client";

import { motion } from "framer-motion";
import LightPage from "@/components/LightPage";

const INK = "#2A2A2A";
const INK_SOFT = "#5A5A5A";
const GOLD = "#FFD345";
const GOLD_DK = "#CAA928";
const GOLD_LT = "#FDE494";

const INSIGHTS = [
  { text: "כל העולם כולו גשר צר מאוד — והעיקר לא לפחד כלל.", source: "רבי נחמן מברסלב, ליקוטי מוהר״ן" },
  { text: "אם אין אני לי — מי לי? וכשאני לעצמי — מה אני? ואם לא עכשיו — אימתי?", source: "הלל הזקן, פרקי אבות א, יד" },
  { text: "איזהו עשיר? השמח בחלקו.", source: "בן זומא, פרקי אבות ד, א" },
  { text: "אל תדון את חברך עד שתגיע למקומו.", source: "הלל, פרקי אבות ב, ה" },
  { text: "במקום שאין אנשים — השתדל להיות איש.", source: "הלל, פרקי אבות ב, ה" },
  { text: "מעט מן האור — דוחה הרבה מן החושך.", source: "אדמו״ר הזקן, ספר התניא" },
  { text: "אסור להתייאש.", source: "רבי נחמן מברסלב" },
  { text: "אם אתה מאמין שאפשר לקלקל — תאמין שאפשר לתקן.", source: "רבי נחמן מברסלב" },
  { text: "ואהבת לרעך כמוך — זה כלל גדול בתורה.", source: "ויקרא יט, יח / רבי עקיבא" },
  { text: "כל המקיים נפש אחת — כאילו קיים עולם מלא.", source: "משנה, סנהדרין ד, ה" },
  { text: "אדם נברא יחידי — לפיכך חייב כל אחד לומר: בשבילי נברא העולם.", source: "משנה, סנהדרין ד, ה" },
  { text: "טוב שכן קרוב — מאח רחוק.", source: "משלי כז, י" },
  { text: "במקום שבעלי תשובה עומדים — אפילו צדיקים גמורים אינם יכולים לעמוד.", source: "תלמוד, ברכות ל״ד ע״ב" },
  { text: "סייג לחכמה — שתיקה.", source: "רבי עקיבא, פרקי אבות ג, יז" },
  { text: "הגיד לך אדם מה טוב, ומה ה׳ דורש ממך — כי אם עשות משפט, ואהבת חסד, והצנע לכת עם אלוקיך.", source: "מיכה ו, ח" },
  { text: "אדם, איפה אתה?", source: "בראשית ג, ט — השאלה הראשונה במקרא" },
  { text: "וצדיק באמונתו יחיה.", source: "חבקוק ב, ד" },
  { text: "ובחרת בחיים — למען תחיה אתה וזרעך.", source: "דברים ל, יט" },
  { text: "בכל מקום שאתה מוצא גדולתו של הקדוש ברוך הוא — שם אתה מוצא ענוותנותו.", source: "תלמוד, מגילה ל״א ע״א" },
  { text: "מצוה גוררת מצוה, ועברה גוררת עברה.", source: "בן עזאי, פרקי אבות ד, ב" },
  { text: "הקנאה, התאווה והכבוד — מוציאין את האדם מן העולם.", source: "רבי אלעזר הקפר, פרקי אבות ד, כא" },
  { text: "הסתכל בשלושה דברים ואי אתה בא לידי עבירה: דע מאין באת, ולאן אתה הולך, ולפני מי אתה עתיד ליתן דין וחשבון.", source: "עקביא בן מהללאל, פרקי אבות ג, א" },
  { text: "יפה שעה אחת של תשובה ומעשים טובים בעולם הזה — מכל חיי העולם הבא.", source: "רבי יעקב, פרקי אבות ד, יז" },
  { text: "פתחו לי פתח כחודו של מחט — ואני אפתח לכם פתח שיהיו עגלות וקרוניות נכנסות בו.", source: "שיר השירים רבה ה, ב" },
  { text: "המאור שבה מחזירו למוטב.", source: "מדרש איכה רבה, פתיחתא ב — על התורה" },
  { text: "דע מה למעלה ממך — עין רואה ואוזן שומעת, וכל מעשיך בספר נכתבים.", source: "רבי יהודה הנשיא, פרקי אבות ב, א" },
  { text: "הכל בידי שמים — חוץ מיראת שמים.", source: "תלמוד, ברכות ל״ג ע״ב" },
  { text: "אהבת ישראל קודמת לאהבת התורה — שאהבת התורה היא בכלל אהבת ישראל.", source: "הראי״ה קוק" },
  { text: "כל הצמצומים — לטובתנו.", source: "האר״י הקדוש" },
  { text: "הולך בתום — ילך בטח.", source: "משלי י, ט" },
];

function todaysInsight() {
  const start = new Date("2026-01-01").getTime();
  const today = new Date().setHours(0, 0, 0, 0);
  const daysSince = Math.floor((today - start) / (1000 * 60 * 60 * 24));
  return INSIGHTS[((daysSince % INSIGHTS.length) + INSIGHTS.length) % INSIGHTS.length];
}

export default function InsightPage() {
  const insight = todaysInsight();
  const today = new Date().toLocaleDateString("he-IL", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <LightPage>
      <div className="max-w-2xl mx-auto px-5 py-12 sm:py-20">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">✨</div>
          <h1 className="text-2xl sm:text-3xl font-extrabold mb-1" style={{ color: INK }}>
            תובנה יומית
          </h1>
          <p className="text-sm" style={{ color: GOLD_DK }}>
            {today}
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="rounded-3xl p-8 sm:p-12 text-center"
          style={{
            background: "#FFFFFF",
            border: `1px solid ${GOLD_DK}33`,
            boxShadow:
              "0 20px 50px rgba(202,169,40,0.10), 0 8px 16px rgba(0,0,0,0.04)",
          }}
        >
          <div className="text-5xl leading-none mb-3 select-none" style={{ color: GOLD_LT }}>
            ״
          </div>
          <p
            className="text-xl sm:text-2xl leading-relaxed font-medium"
            style={{ color: INK }}
          >
            {insight.text}
          </p>
          <div className="text-5xl leading-none mt-1 select-none" style={{ color: GOLD_LT }}>
            ״
          </div>
          <p className="text-sm mt-5" style={{ color: GOLD_DK }}>
            — {insight.source}
          </p>
        </motion.div>

        <div className="text-center mt-10 text-xs" style={{ color: INK_SOFT }}>
          תובנה חדשה כל בוקר. שתף בקהילה רעיון שעלה אצלך.
        </div>
      </div>
    </LightPage>
  );
}
