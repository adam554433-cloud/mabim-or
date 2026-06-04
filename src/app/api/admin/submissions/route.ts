import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const { data, error } = await supabaseAdmin
    .from("submissions")
    .select("*, challenges(title)")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const submissions = (data ?? []).map((s: Record<string, unknown>) => ({
    ...s,
    challenge_title: (s.challenges as { title?: string } | null)?.title ?? "",
  }));
  return NextResponse.json({ submissions });
}

export async function PATCH(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const { id, hidden } = await req.json();
  if (!id || typeof hidden !== "boolean") {
    return NextResponse.json({ error: "פרמטרים חסרים" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("submissions")
    .update({ hidden })
    .eq("id", id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ submission: data });
}

export async function DELETE(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const { id } = await req.json();
  if (!id) return NextResponse.json({ error: "חסר מזהה" }, { status: 400 });

  const { error } = await supabaseAdmin.from("submissions").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
