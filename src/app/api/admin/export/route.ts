import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { getUsersWithEmails } from "@/lib/adminUsers";
import { toCsv } from "@/lib/csv";

export const runtime = "nodejs";

function csvResponse(csv: string, filename: string) {
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  const type = req.nextUrl.searchParams.get("type");

  if (type === "users") {
    const users = await getUsersWithEmails();
    const csv = toCsv(users as unknown as Record<string, unknown>[], [
      { key: "full_name", label: "שם מלא" },
      { key: "display_name", label: "שם תצוגה" },
      { key: "email", label: "אימייל" },
      { key: "gender", label: "מין" },
      { key: "age", label: "גיל" },
      { key: "country", label: "מדינה" },
      { key: "city", label: "עיר" },
      { key: "social_consent", label: "אישור שיתוף" },
      { key: "age_confirmed_at", label: "אישור גיל" },
      { key: "onboarded_at", label: "השלים הרשמה" },
      { key: "created_at", label: "נרשם בתאריך" },
    ]);
    return csvResponse(csv, "users.csv");
  }

  if (type === "submissions") {
    const { data } = await supabaseAdmin
      .from("submissions")
      .select("*, challenges(title)")
      .order("created_at", { ascending: false });
    const rows = (data ?? []).map((s: Record<string, unknown>) => ({
      ...s,
      challenge_title: (s.challenges as { title?: string } | null)?.title ?? "",
    }));
    const csv = toCsv(rows, [
      { key: "name", label: "שם" },
      { key: "challenge_title", label: "אתגר" },
      { key: "puzzle_index", label: "מספר אור" },
      { key: "media_type", label: "סוג מדיה" },
      { key: "media_url", label: "קישור מדיה" },
      { key: "instagram_url", label: "אינסטגרם" },
      { key: "hidden", label: "מוסתר" },
      { key: "created_at", label: "תאריך" },
    ]);
    return csvResponse(csv, "submissions.csv");
  }

  return NextResponse.json({ error: "type לא תקין" }, { status: 400 });
}
