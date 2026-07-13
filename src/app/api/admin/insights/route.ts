import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const { data, error } = await supabaseAdmin
    .from("insights")
    .select("*")
    .order("insight_date", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ insights: data ?? [] });
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const body = await req.json();

  // Bulk upsert: { bulk: [{ insight_date, text, source }] }
  if (Array.isArray(body.bulk)) {
    const rows = body.bulk
      .filter(
        (r: { insight_date?: string; text?: string }) =>
          r && DATE_RE.test(r.insight_date ?? "") && (r.text ?? "").trim().length > 0
      )
      .map((r: { insight_date: string; text: string; source?: string }) => ({
        insight_date: r.insight_date,
        text: r.text.trim(),
        source: r.source?.trim() || null,
      }));

    if (rows.length === 0) {
      return NextResponse.json({ error: "לא נמצאו שורות תקינות" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("insights")
      .upsert(rows, { onConflict: "insight_date" })
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ inserted: data?.length ?? 0, insights: data }, { status: 201 });
  }

  // Single create
  const { insight_date, text, source } = body;
  if (!DATE_RE.test(insight_date ?? "") || !(text ?? "").trim()) {
    return NextResponse.json({ error: "תאריך וטקסט הם שדות חובה" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("insights")
    .upsert(
      { insight_date, text: text.trim(), source: source?.trim() || null },
      { onConflict: "insight_date" }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ insight: data }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const { id, insight_date, text, source } = await req.json();
  if (!id) return NextResponse.json({ error: "חסר מזהה" }, { status: 400 });

  const patch: Record<string, unknown> = {};
  if (insight_date && DATE_RE.test(insight_date)) patch.insight_date = insight_date;
  if (typeof text === "string") patch.text = text.trim();
  if (source !== undefined) patch.source = source?.trim() || null;

  const { data, error } = await supabaseAdmin
    .from("insights")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ insight: data });
}

export async function DELETE(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "חסר מזהה" }, { status: 400 });

  const { error } = await supabaseAdmin.from("insights").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
