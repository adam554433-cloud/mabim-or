import { Submission, Challenge } from "@/types";

export const CURRENT_CHALLENGE: Challenge = {
  id: "1",
  title: "קנה לשכן קניות היום",
  description:
    "היום, צא לסופר וקנה לשכן שלך את מה שהוא צריך. צלם את הרגע, שתף את האור שלך.",
  week_start: "2026-04-28",
  created_at: "2026-04-28",
};

export const ALL_CHALLENGES: Challenge[] = [
  CURRENT_CHALLENGE,
  {
    id: "2",
    title: "תגיד מילה טובה לאדם זר",
    description: "היום, עצור מישהו ברחוב ואמור לו מילה טובה אמיתית. צלם את הרגע.",
    week_start: "2026-04-21",
    created_at: "2026-04-21",
  },
  {
    id: "3",
    title: "עזור למישהו שצריך עזרה",
    description: "מצא מישהו שצריך עזרה היום — שכן, זר, קולגה — ועזור לו. צלם.",
    week_start: "2026-04-14",
    created_at: "2026-04-14",
  },
  {
    id: "4",
    title: "התקשר להורים / לאח שלך",
    description: "התקשר למישהו שאהבת ולא דיברתם הרבה. שיחה אחת יכולה להאיר יום שלם.",
    week_start: "2026-04-07",
    created_at: "2026-04-07",
  },
  {
    id: "5",
    title: "שלם לאחור — שלם עבור הבא בתור",
    description: 'בבית קפה, בקופה — שלם עבור הלקוח הבא. "Pay it forward" ישראלי.',
    week_start: "2026-03-31",
    created_at: "2026-03-31",
  },
];

export const MOCK_SUBMISSIONS: Submission[] = [
  {
    id: "1",
    name: "יוסי לוי",
    challenge_id: "1",
    challenge_title: "קנה לשכן קניות היום",
    video_url: null,
    puzzle_index: 0,
    created_at: "2026-04-28T08:00:00Z",
  },
  {
    id: "2",
    name: "מרים כהן",
    challenge_id: "1",
    challenge_title: "קנה לשכן קניות היום",
    video_url: null,
    puzzle_index: 1,
    created_at: "2026-04-28T09:15:00Z",
  },
  {
    id: "3",
    name: "דוד אברהם",
    challenge_id: "1",
    challenge_title: "קנה לשכן קניות היום",
    video_url: null,
    puzzle_index: 2,
    created_at: "2026-04-28T10:30:00Z",
  },
  {
    id: "4",
    name: "רחל שמש",
    challenge_id: "2",
    challenge_title: "תגיד מילה טובה לאדם זר",
    video_url: null,
    puzzle_index: 3,
    created_at: "2026-04-27T14:00:00Z",
  },
  {
    id: "5",
    name: "אבי גולן",
    challenge_id: "2",
    challenge_title: "תגיד מילה טובה לאדם זר",
    video_url: null,
    puzzle_index: 4,
    created_at: "2026-04-27T16:45:00Z",
  },
  {
    id: "6",
    name: "תמר פרץ",
    challenge_id: "1",
    challenge_title: "קנה לשכן קניות היום",
    video_url: null,
    puzzle_index: 5,
    created_at: "2026-04-28T11:00:00Z",
  },
];

// Simulate 1,247 lit indices out of 50,000
export function generateLitIndices(count: number): Set<number> {
  const lit = new Set<number>();
  // First few are from real submissions
  MOCK_SUBMISSIONS.forEach((s) => lit.add(s.puzzle_index));
  // Fill the rest with deterministic pseudo-random indices
  let seed = 42;
  while (lit.size < count) {
    seed = (seed * 1664525 + 1013904223) & 0xffffffff;
    const idx = Math.abs(seed) % 50000;
    lit.add(idx);
  }
  return lit;
}

export const INITIAL_LIT_COUNT = 1247;
