export type MenuItem = {
  href: string;
  label: string;
  emoji: string;
  description: string;
  requiresAuth?: boolean;
};

export const MENU: MenuItem[] = [
  { href: "/", label: "דף הבית", emoji: "🏠", description: "חזרה לעמוד הראשי" },
  { href: "/#challenge", label: "אתגר שבועי", emoji: "✨", description: "המשימה השבועית של הקהילה" },
  { href: "/gratitude", label: "הודיה", emoji: "🌅", description: "רשום על מה אתה אסיר תודה היום", requiresAuth: true },
  { href: "/insight", label: "תובנה יומית", emoji: "✨", description: "תובנה אחת ליום, מהקהילה ולקהילה" },
  { href: "/community", label: "רואים אחד את השני", emoji: "👥", description: "הזרם של מה שאחרים שלחו", requiresAuth: true },
  { href: "/shorts", label: "סיפורי אור", emoji: "🎬", description: "גלילה אנכית של כל הסרטונים והתמונות מהקהילה" },
  { href: "/#puzzle", label: "גוף האור המרכזי", emoji: "🌌", description: "הפאזל של 50,000 אורות" },
  { href: "/profile", label: "השם שלי", emoji: "💛", description: "הפרופיל האישי שלך", requiresAuth: true },
  { href: "/portal", label: "קוד 26", emoji: "🌀", description: "13 העקרונות — פורטל החניכה" },
  { href: "/about", label: "אודות", emoji: "📜", description: "מה זה ׳מביאים אור׳" },
];
