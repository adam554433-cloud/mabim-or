import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .order("week_start", { ascending: false });

  if (error) return NextResponse.json({ challenges: [] });
  return NextResponse.json({ challenges: data ?? [] });
}
