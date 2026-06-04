import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { parseInstagram } from "@/lib/instagram";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("submissions")
    .select("*, challenges(title)")
    .eq("hidden", false)
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
    const { name, challenge_id, user_id, media_url, media_type, instagram_url } = await req.json();

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "שם לא תקין" }, { status: 400 });
    }

    // Guard against non-UUID challenge IDs (e.g. legacy mock IDs like "1") that
    // would otherwise fail the uuid foreign-key cast and break the whole submit.
    const UUID_RE =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const safeChallengeId =
      typeof challenge_id === "string" && UUID_RE.test(challenge_id)
        ? challenge_id
        : null;

    const safeMediaType =
      media_type === "video" || media_type === "image" ? media_type : null;
    const safeMediaUrl =
      typeof media_url === "string" && media_url.length > 0 ? media_url : null;

    // Validate Instagram link (store the canonical post URL, not whatever was pasted)
    let safeInstagramUrl: string | null = null;
    if (typeof instagram_url === "string" && instagram_url.trim().length > 0) {
      const ig = parseInstagram(instagram_url.trim());
      if (!ig) {
        return NextResponse.json(
          { error: "קישור האינסטגרם אינו תקין" },
          { status: 400 }
        );
      }
      safeInstagramUrl = ig.url;
    }

    // Get next puzzle index from the sequence (atomic, collision-free)
    const { data: seqData } = await supabase.rpc("next_puzzle_index").single();

    // Fallback if the RPC isn't installed: highest existing index + 1
    let puzzleIndex = typeof seqData === "number" ? seqData : null;
    if (puzzleIndex == null) {
      const { data: maxRow } = await supabase
        .from("submissions")
        .select("puzzle_index")
        .order("puzzle_index", { ascending: false })
        .limit(1)
        .maybeSingle();
      puzzleIndex = ((maxRow?.puzzle_index as number | undefined) ?? 1247) + 1;
    }

    const { data, error } = await supabase
      .from("submissions")
      .insert({
        name: name.trim(),
        challenge_id: safeChallengeId,
        user_id: user_id || null,
        puzzle_index: puzzleIndex,
        media_url: safeMediaUrl,
        media_type: safeMediaType,
        video_url: safeMediaType === "video" ? safeMediaUrl : null,
        instagram_url: safeInstagramUrl,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ puzzle_index: puzzleIndex, submission: data }, { status: 201 });
  } catch (e) {
    console.error("[submissions] insert failed:", e);
    const msg = e instanceof Error ? e.message : "שגיאה בשרת";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
