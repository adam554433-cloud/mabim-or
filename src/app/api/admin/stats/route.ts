import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    const head = { count: "exact" as const, head: true };
    const [submissions, submissionsHidden, users, onboarded, consents, challenges] =
      await Promise.all([
        supabaseAdmin.from("submissions").select("*", head),
        supabaseAdmin.from("submissions").select("*", head).eq("hidden", true),
        supabaseAdmin.from("profiles").select("*", head),
        supabaseAdmin.from("profiles").select("*", head).not("onboarded_at", "is", null),
        supabaseAdmin.from("profiles").select("*", head).eq("social_consent", true),
        supabaseAdmin.from("challenges").select("*", head),
      ]);

    return NextResponse.json({
      submissions: submissions.count ?? 0,
      submissionsHidden: submissionsHidden.count ?? 0,
      users: users.count ?? 0,
      onboarded: onboarded.count ?? 0,
      consents: consents.count ?? 0,
      challenges: challenges.count ?? 0,
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "שגיאה";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
