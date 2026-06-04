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
  { href: "/", label: "דף הבית", Icon: HomeIcon, description: "חזרה לעמוד הראשי" },
  { href: "/#challenge", label: "אתגר שבועי", Icon: SparkIcon, description: "המשימה השבועית של הקהילה" },
  { href: "/gratitude", label: "הודיה", Icon: SunriseIcon, description: "רשום על מה אתה אסיר תודה היום", requiresAuth: true },
  { href: "/insight", label: "תובנה יומית", Icon: LightbulbIcon, description: "תובנה אחת ליום, מהקהילה ולקהילה" },
  { href: "/community", label: "רואים אחד את השני", Icon: UsersIcon, description: "הזרם של מה שאחרים שלחו", requiresAuth: true },
  { href: "/shorts", label: "סיפורי אור", Icon: FilmIcon, description: "גלילה אנכית של כל הסרטונים והתמונות מהקהילה" },
  { href: "/#puzzle", label: "גוף האור המרכזי", Icon: PuzzleIcon, description: "הפאזל של 50,000 אורות" },
  { href: "/profile", label: "השם שלי", Icon: HeartIcon, description: "הפרופיל האישי שלך", requiresAuth: true },
  { href: "/portal", label: "קוד 26", Icon: SpiralIcon, description: "13 העקרונות — פורטל החניכה" },
  { href: "/about", label: "אודות", Icon: ScrollIcon, description: "מה זה ׳מביאים אור׳" },
];
