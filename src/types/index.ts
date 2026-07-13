export interface Challenge {
  id: string;
  title: string;
  description: string;
  week_start: string;
  /** Date the challenge goes live on the site (inclusive) */
  start_date?: string | null;
  /** Last date the challenge is shown (inclusive); null = no end */
  end_date?: string | null;
  created_at: string;
}

export interface Insight {
  id: string;
  /** The date this insight is shown (YYYY-MM-DD) */
  insight_date: string;
  text: string;
  source?: string | null;
  created_at: string;
}

export type MediaType = "video" | "image";

export interface Submission {
  id: string;
  name: string;
  challenge_id: string;
  challenge_title?: string;
  video_url: string | null;
  media_url?: string | null;
  media_type?: MediaType | null;
  thumbnail_url?: string | null;
  instagram_url?: string | null;
  puzzle_index: number;
  created_at: string;
}

export interface PuzzlePoint {
  index: number;
  name: string;
  challenge: string;
  lit: boolean;
}
