import type { ComponentType } from "react";
import {
  HomeIcon,
  SparkIcon,
  SunriseIcon,
  LightbulbIcon,
  UsersIcon,
  FilmIcon,
  PuzzleIcon,
  HeartIcon,
  SpiralIcon,
  ScrollIcon,
} from "@/components/icons";

export type MenuItem = {
  href: string;
  label: string;
  Icon: ComponentType<{ size?: number; className?: string }>;
  description: string;
  requiresAuth?: boolean;
};

export const MENU: MenuItem[] = [
  { href: "/puzzle", label: "דף הבית", Icon: HomeIcon, description: "חזרה לעמוד הראשי" },
  { href: "/puzzle#challenge", label: "אתגר שבועי", Icon: SparkIcon, description: "המשימה השבועית של הקהילה" },
  { href: "/puzzle/gratitude", label: "הודיה", Icon: SunriseIcon, description: "רשום על מה אתה אסיר תודה היום", requiresAuth: true },
  { href: "/puzzle/insight", label: "תובנה יומית", Icon: LightbulbIcon, description: "תובנה אחת ליום, מהקהילה ולקהילה" },
  { href: "/puzzle/community", label: "רואים אחד את השני", Icon: UsersIcon, description: "הזרם של מה שאחרים שלחו", requiresAuth: true },
  { href: "/puzzle/shorts", label: "סיפורי אור", Icon: FilmIcon, description: "גלילה אנכית של כל הסרטונים והתמונות מהקהילה" },
  { href: "/puzzle/board", label: "גוף האור המרכזי", Icon: PuzzleIcon, description: "הפאזל של 50,000 אורות" },
  { href: "/profile", label: "השם שלי", Icon: HeartIcon, description: "הפרופיל האישי שלך", requiresAuth: true },
  { href: "/portal", label: "קוד 26", Icon: SpiralIcon, description: "13 העקרונות — פורטל החניכה" },
  { href: "/", label: "מרכז הפורטלים", Icon: SpiralIcon, description: "כל הפורטלים של קוד26" },
  { href: "/about", label: "אודות", Icon: ScrollIcon, description: "מה זה ׳מביאים אור׳" },
];
