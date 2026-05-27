import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "הצהרת נגישות | ניצוצות",
  description: "הצהרת הנגישות של פלטפורמת ניצוצות לפי תקן ת״י 5568",
};

export default function AccessibilityPage() {
  return (
    <main className="min-h-screen">
      <SiteNav />
      <article className="max-w-2xl mx-auto px-5 py-10 text-amber-50/90 leading-relaxed">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-yellow-400 mb-2">
          הצהרת נגישות
        </h1>
        <p className="text-amber-200/60 text-sm mb-8">
          עודכן לאחרונה: {new Date().toLocaleDateString("he-IL")}
        </p>

        <section className="space-y-4 text-base">
          <h2 className="text-xl font-bold text-yellow-300 mt-6">המחויבות שלנו</h2>
          <p>
            פלטפורמת <strong>ניצוצות</strong> מחויבת לאפשר גישה שווה ונוחה לכלל
            המשתמשים, כולל אנשים עם מוגבלות. אנו פועלים להתאים את האתר לתקן
            הישראלי <strong>ת״י 5568</strong> (ברמה AA) ולהנחיות{" "}
            <strong>WCAG 2.1</strong>.
          </p>

          <h2 className="text-xl font-bold text-yellow-300 mt-6">התאמות שבוצעו</h2>
          <ul className="list-disc list-inside space-y-1 mr-2">
            <li>ניווט מקלדת מלא בכל האתר</li>
            <li>סימון פוקוס ברור (outline צהוב סביב הרכיב הפעיל)</li>
            <li>תיוג ARIA לרכיבים אינטראקטיביים</li>
            <li>תמיכה ב-RTL ובעברית מלאה</li>
            <li>תפריט נגישות מובנה (פינה ימנית תחתונה) הכולל:</li>
            <ul className="list-disc list-inside mr-6 space-y-1">
              <li>הגדלת גופן (4 רמות)</li>
              <li>ניגודיות גבוהה (שחור / צהוב)</li>
              <li>הדגשת קישורים</li>
              <li>הקטנה / עצירה של אנימציות</li>
              <li>גופן ידידותי לדיסלקציה</li>
            </ul>
            <li>קיצור מקלדת: <kbd className="px-2 py-0.5 rounded bg-yellow-400/10 border border-yellow-400/30">Alt + A</kbd> פותח את תפריט הנגישות</li>
          </ul>

          <h2 className="text-xl font-bold text-yellow-300 mt-6">מה עוד בעבודה</h2>
          <p>
            אנו ממשיכים לשפר את הנגישות באופן שוטף. מרכיבים מסוימים (פאזל הדוטים
            הוויזואלי) משלימים בתיאור טקסטואלי שקול.
          </p>

          <h2 className="text-xl font-bold text-yellow-300 mt-6">דיווח על תקלה</h2>
          <p>
            נתקלתם במכשול נגישות? נשמח לשמוע — פנו אלינו דרך עמוד{" "}
            <a href="/about" className="text-yellow-400 underline">
              אודות
            </a>{" "}
            ונטפל בהקדם.
          </p>

          <p className="text-amber-200/60 text-sm mt-8">
            רכז הנגישות: צוות ניצוצות
          </p>
        </section>
      </article>
    </main>
  );
}
