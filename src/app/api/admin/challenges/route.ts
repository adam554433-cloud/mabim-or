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
    .order("week_start", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ challenges: data ?? [] });
}

export async function POST(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const { title, description, week_start } = await req.json();
  if (!title || typeof title !== "string" || !week_start) {
    return NextResponse.json({ error: "כותרת ותאריך הם שדות חובה" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("challenges")
    .insert({ title: title.trim(), description: description ?? null, week_start })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ challenge: data }, { status: 201 });
}

export async function PATCH(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const { id, title, description, week_start } = await req.json();
  if (!id) return NextResponse.json({ error: "חסר מזהה" }, { status: 400 });

  const patch: Record<string, unknown> = {};
  if (typeof title === "string") patch.title = title.trim();
  if (description !== undefined) patch.description = description;
  if (week_start) patch.week_start = week_start;

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
