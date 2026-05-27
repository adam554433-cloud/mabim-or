-- ── Challenges ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS challenges (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  description text,
  week_start  date NOT NULL,
  created_at  timestamptz DEFAULT now()
);

-- ── Profiles (linked to auth.users) ─────────────────────────────────
CREATE TABLE IF NOT EXISTS profiles (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name    text,
  full_name       text,
  gender          text CHECK (gender IN ('male','female')),
  birth_date      date,
  country         text,
  city            text,
  social_consent  boolean DEFAULT false,
  age_confirmed_at timestamptz,
  onboarded_at    timestamptz,
  created_at      timestamptz DEFAULT now()
);

-- Add new onboarding columns to existing profiles (idempotent)
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name        text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS gender           text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS birth_date       date;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS country          text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS city             text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS social_consent   boolean DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS age_confirmed_at timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS onboarded_at     timestamptz;

-- ── Submissions ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS submissions (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  name         text NOT NULL,
  challenge_id uuid REFERENCES challenges(id),
  video_url    text,
  puzzle_index integer UNIQUE NOT NULL,
  created_at   timestamptz DEFAULT now()
);

-- ── Reactions (מילות עידוד) ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reactions (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id uuid REFERENCES submissions(id) ON DELETE CASCADE,
  from_user_id  uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  from_name     text NOT NULL,
  message       text NOT NULL,
  created_at    timestamptz DEFAULT now()
);

-- ── Puzzle index sequence ────────────────────────────────────────────
CREATE SEQUENCE IF NOT EXISTS puzzle_index_seq START 1248;

-- ── RLS ─────────────────────────────────────────────────────────────
ALTER TABLE challenges  ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles    ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE reactions   ENABLE ROW LEVEL SECURITY;

-- Challenges: public read
CREATE POLICY "challenges_public_read"  ON challenges  FOR SELECT USING (true);

-- Profiles: user owns their own
CREATE POLICY "profiles_public_read"    ON profiles    FOR SELECT USING (true);
CREATE POLICY "profiles_insert_own"     ON profiles    FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own"     ON profiles    FOR UPDATE USING (auth.uid() = id);

-- Submissions: public read, authenticated insert
CREATE POLICY "submissions_public_read" ON submissions FOR SELECT USING (true);
CREATE POLICY "submissions_insert"      ON submissions FOR INSERT WITH CHECK (true);

-- Reactions: public read, authenticated insert
CREATE POLICY "reactions_public_read"   ON reactions   FOR SELECT USING (true);
CREATE POLICY "reactions_insert"        ON reactions   FOR INSERT WITH CHECK (true);

-- ── Auto-create profile on signup ───────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (new.id, new.raw_user_meta_data->>'display_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ── Seed data ────────────────────────────────────────────────────────
INSERT INTO challenges (title, description, week_start) VALUES
  ('קנה לשכן קניות היום', 'היום, צא לסופר וקנה לשכן שלך את מה שהוא צריך. צלם את הרגע, שתף את האור שלך.', '2026-04-28'),
  ('תגיד מילה טובה לאדם זר', 'היום, עצור אדם אחד שאתה לא מכיר ותן לו מחמאה כנה. צלם את הרגע.', '2026-04-21')
ON CONFLICT DO NOTHING;
