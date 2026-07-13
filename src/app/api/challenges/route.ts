import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET() {
  const today = new Date().toISOString().slice(0, 10);

  // Active = started on/before today AND (no end date OR ends on/after today).
  // Chained .or() calls are ANDed together by PostgREST.
  const { data, error } = await supabase
    .from("challenges")
    .select("*")
    .or(`start_date.is.null,start_date.lte.${today}`)
    .or(`end_date.is.null,end_date.gte.${today}`)
    .order("start_date", { ascending: false });

  if (error) return NextResponse.json({ challenges: [] });
  return NextResponse.json({ challenges: data ?? [] });
}
