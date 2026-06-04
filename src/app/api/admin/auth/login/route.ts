import { NextRequest, NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  cookieOptions,
  sign,
  SET_COOKIE_MAX_AGE,
  verifyPassword,
} from "@/lib/adminAuth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let password: unknown;
  try {
    ({ password } = await req.json());
  } catch {
    return NextResponse.json({ error: "בקשה לא תקינה" }, { status: 400 });
  }

  if (!verifyPassword(password)) {
    return NextResponse.json({ error: "סיסמה שגויה" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, sign(), cookieOptions(SET_COOKIE_MAX_AGE));
  return res;
}
