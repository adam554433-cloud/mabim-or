import type { Metadata } from "next";
import SiteNav from "@/components/SiteNav";

export const metadata: Metadata = {
  title: "תקנון | ניצוצות",
  description: "תקנון השימוש בפלטפורמת ניצוצות",
};

export default function TermsPage() {
  return (
    <main className="min-h-screen">
      <SiteNav />
      <article className="max-w-2xl mx-auto px-5 py-10 text-amber-50/90 leading-relaxed">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-yellow-400 mb-2">
          תקנון השימוש
        </h1>
        <p className="text-amber-200/60 text-sm mb-8">
          עודכן לאחרונה: {new Date().toLocaleDateString("he-IL")}
        </p>

        <section className="space-y-4 text-base">
          <h2 className="text-xl font-bold text-yellow-300 mt-6">1. כללי</h2>
          <p>
            ברוכים הבאים ל<strong>ניצוצות</strong> — פלטפורמה קהילתית להאיר את
            העולם במעשים טובים. השימוש באתר כפוף לתנאים אלה.
          </p>

          <h2 className="text-xl font-bold text-yellow-300 mt-6">2. הגבלת גיל</h2>
          <p>
            ההצטרפות לפלטפורמה מותרת ל<strong>בני 13 ומעלה בלבד</strong>. בעת
            ההרשמה תידרשו לאשר את גילכם. ההורים נושאים באחריות לפיקוח על שימוש
            של קטינים.
          </p>

          <h2 className="text-xl font-bold text-yellow-300 mt-6">3. תוכן משתמשים</h2>
          <p>
            תוכן שתעלו (טקסטים, תמונות, סרטונים) עשוי להופיע בפלטפורמה ובערוצי
            הרשת החברתית של הקהילה, בהתאם להסכמתכם בעת ההרשמה. אין להעלות תוכן
            פוגעני, פרסומי, או מפר זכויות יוצרים.
          </p>

          <h2 className="text-xl font-bold text-yellow-300 mt-6">4. פרטיות</h2>
          <p>
            אנו אוספים מידע בסיסי (שם, מין, תאריך לידה, מדינה, עיר) לצורך תפעול
            הקהילה. המידע נשמר ב-Supabase ולא נמכר לצדדים שלישיים.
          </p>

          <h2 className="text-xl font-bold text-yellow-300 mt-6">5. שינויים</h2>
          <p>
            התקנון עשוי להתעדכן מעת לעת. שימוש מתמשך בפלטפורמה מהווה הסכמה
            לגרסה המעודכנת.
          </p>

          <h2 className="text-xl font-bold text-yellow-300 mt-6">6. צרו קשר</h2>
          <p>
            לכל שאלה או בקשה, פנו אלינו דרך עמוד{" "}
            <a href="/about" className="text-yellow-400 underline">
              אודות
            </a>
            .
          </p>
        </section>
      </article>
    </main>
  );
}
