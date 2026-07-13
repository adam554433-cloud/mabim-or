import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const { data, error } = await supabaseAdmin
    .from("challenges")
    .select("*")
    .order("start_date", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ challenges: data ?? [] });
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const { title, description, start_date, end_date } = await req.json();
  if (!title || typeof title !== "string" || !start_date) {
    return NextResponse.json({ error: "כותרת ותאריך התחלה הם שדות חובה" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("challenges")
    .insert({
      title: title.trim(),
      description: description ?? null,
      start_date,
      end_date: end_date || null,
      week_start: start_date, // keep legacy NOT NULL column in sync
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ challenge: data }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const { id, title, description, start_date, end_date } = await req.json();
  if (!id) return NextResponse.json({ error: "חסר מזהה" }, { status: 400 });

  const patch: Record<string, unknown> = {};
  if (typeof title === "string") patch.title = title.trim();
  if (description !== undefined) patch.description = description;
  if (start_date) {
    patch.start_date = start_date;
    patch.week_start = start_date;
  }
  if (end_date !== undefined) patch.end_date = end_date || null;

  const { data, error } = await supabaseAdmin
    .from("challenges")
    .update(patch)
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ challenge: data });
}

export async function DELETE(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "חסר מזהה" }, { status: 400 });

  const { error } = await supabaseAdmin.from("challenges").delete().eq("id", id);
  if (error) {
    // FK violation: challenge still referenced by submissions
    if (error.code === "23503") {
      return NextResponse.json(
        { error: "לא ניתן למחוק אתגר שיש לו הגשות" },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
