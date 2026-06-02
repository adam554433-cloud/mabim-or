import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("submissions")
    .select("*, challenges(title)")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ submissions: [] });

  const submissions = (data ?? []).map((s: Record<string, unknown>) => ({
    ...s,
    challenge_title: (s.challenges as { title?: string } | null)?.title ?? "",
  }));

  return NextResponse.json({ submissions });
}

export async function POST(req: NextRequest) {
  try {
    const { name, challenge_id, user_id, media_url, media_type } = await req.json();

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "שם לא תקין" }, { status: 400 });
    }

    const safeMediaType =
      media_type === "video" || media_type === "image" ? media_type : null;
    const safeMediaUrl =
      typeof media_url === "string" && media_url.length > 0 ? media_url : null;

    // Get next puzzle index from sequence
    const { data: seqData } = await supabase
      .rpc("nextval", { seq: "puzzle_index_seq" })
      .single();

    // Fallback: count existing submissions + 1248
    let puzzleIndex: number = seqData as number;
    if (!puzzleIndex) {
      const { count } = await supabase
        .from("submissions")
        .select("*", { count: "exact", head: true });
      puzzleIndex = (count ?? 0) + 1248;
    }

    const { data, error } = await supabase
      .from("submissions")
      .insert({
        name: name.trim(),
        challenge_id: challenge_id || null,
        user_id: user_id || null,
        puzzle_index: puzzleIndex,
        media_url: safeMediaUrl,
        media_type: safeMediaType,
        video_url: safeMediaType === "video" ? safeMediaUrl : null,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ puzzle_index: puzzleIndex, submission: data }, { status: 201 });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "שגיאה בשרת" }, { status: 500 });
  }
}
