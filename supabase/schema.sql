-- אתגרים שבועיים
CREATE TABLE challenges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  week_start date NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- הגשות
CREATE TABLE submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  challenge_id uuid REFERENCES challenges(id),
  video_url text,
  puzzle_index integer UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- RLS
ALTER TABLE challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "challenges are public" ON challenges FOR SELECT USING (true);
CREATE POLICY "submissions are public" ON submissions FOR SELECT USING (true);
CREATE POLICY "anyone can submit" ON submissions FOR INSERT WITH CHECK (true);

-- Seed: אתגר ראשון
INSERT INTO challenges (title, description, week_start) VALUES
  ('קנה לשכן קניות היום', 'היום, צא לסופר וקנה לשכן שלך את מה שהוא צריך. צלם את הרגע, שתף את האור שלך.', '2026-04-28'),
  ('תגיד מילה טובה לאדם זר', 'היום, עצור אדם אחד שאתה לא מכיר ותן לו מחמאה כנה. צלם את הרגע.', '2026-04-21');

-- Sequence for puzzle indices
CREATE SEQUENCE puzzle_index_seq START 1;
