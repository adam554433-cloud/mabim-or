# Project: אור לעם ישראל (Bringing Light)

## Stack
- Next.js 14+ (App Router)
- TypeScript (strict mode)
- Tailwind CSS
- Supabase (auth + database + storage)
- Framer Motion (animations)
- Vercel (deployment)
- Language: Hebrew (RTL)

## Commands
- `npm run dev` — local dev server (localhost:3000)
- `npm run build` — production build
- `npm run lint` — run ESLint
- `vercel --prod` — deploy to production

## Key Architecture
- `src/app/page.tsx` — main page (Hero + Puzzle + Form + Feed)
- `src/app/presentation/page.tsx` — slideshow presentation (6 slides)
- `src/components/PuzzleGrid.tsx` — Canvas 250×200 grid (50k dots)
- `src/components/SubmissionForm.tsx` — upload form
- `src/components/CommunityFeed.tsx` — submission cards
- `src/lib/mockData.ts` — demo data (replace with Supabase)
- `src/app/api/submissions/route.ts` — POST/GET API (in-memory for demo)
- `supabase/schema.sql` — production DB schema

## Puzzle Grid
- 250 cols × 200 rows = 50,000 dots
- Each dot = 3px, gap = 1px (CELL = 4px)
- Lit = gold (#fbbf24) with glow shadow
- Unlit = rgba(255,255,255,0.06)
- Hover shows name + challenge tooltip

## To Connect Supabase (production)
1. Create project at supabase.com
2. Run `supabase/schema.sql` in SQL editor
3. Add env vars to `.env.local` and Vercel dashboard
4. Replace in-memory API with Supabase queries

## Code Style
- Functional components with hooks only
- No `any` types
- All text in Hebrew
- RTL layout (dir="rtl" on html element)
