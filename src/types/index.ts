export interface Challenge {
  id: string;
  title: string;
  description: string;
  week_start: string;
  created_at: string;
}

export interface Submission {
  id: string;
  name: string;
  challenge_id: string;
  challenge_title?: string;
  video_url: string | null;
  puzzle_index: number;
  created_at: string;
}

export interface PuzzlePoint {
  index: number;
  name: string;
  challenge: string;
  lit: boolean;
}
