import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getUsersWithEmails } from "@/lib/adminUsers";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const denied = requireAdmin(req);
  if (denied) return denied;

  try {
    const users = await getUsersWithEmails();
    return NextResponse.json({ users });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "שגיאה בטעינת משתמשים";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
