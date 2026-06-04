import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE, isValidToken } from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const authed = isValidToken(req.cookies.get(ADMIN_COOKIE)?.value);
  return NextResponse.json({ authed }, { status: authed ? 200 : 401 });
}
