import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const today = new Date().toISOString().slice(0, 10);

  const { data, error } = await supabase
    .from("insights")
    .select("*")
    .eq("insight_date", today)
    .maybeSingle();

  if (error || !data) return NextResponse.json({ insight: null });
  return NextResponse.json({ insight: data });
}
