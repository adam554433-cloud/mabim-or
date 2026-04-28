import { NextRequest, NextResponse } from "next/server";
import { MOCK_SUBMISSIONS, INITIAL_LIT_COUNT } from "@/lib/mockData";
import { Submission } from "@/types";

// In-memory store for demo (replace with Supabase in production)
const submissions: Submission[] = [...MOCK_SUBMISSIONS];
let nextIndex = INITIAL_LIT_COUNT;

export async function GET() {
  return NextResponse.json({ submissions: submissions.slice().reverse() });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, challenge_id } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "שם לא תקין" }, { status: 400 });
    }

    const puzzleIndex = nextIndex++;

    const submission: Submission = {
      id: crypto.randomUUID(),
      name: name.trim(),
      challenge_id,
      challenge_title: "קנה לשכן קניות היום",
      video_url: null,
      puzzle_index: puzzleIndex,
      created_at: new Date().toISOString(),
    };

    submissions.push(submission);

    return NextResponse.json({ puzzle_index: puzzleIndex, submission }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "שגיאה בשרת" }, { status: 500 });
  }
}
