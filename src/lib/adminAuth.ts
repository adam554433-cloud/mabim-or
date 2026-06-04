import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const ADMIN_COOKIE = "bl_admin";
const TOKEN_PAYLOAD = "admin:v1";
const MAX_AGE = 60 * 60 * 12; // 12 hours

function secret(): string {
  return process.env.ADMIN_SECRET || "";
}

/** Stable signed token for the admin session cookie. */
export function sign(): string {
  return createHmac("sha256", secret()).update(TOKEN_PAYLOAD).digest("hex");
}

/** Timing-safe compare of the submitted password against ADMIN_PASSWORD. */
export function verifyPassword(input: unknown): boolean {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (typeof input !== "string" || expected.length === 0) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Validate a cookie token against the freshly recomputed signature. */
export function isValidToken(token: string | undefined): boolean {
  if (!token || !secret()) return false;
  const expected = sign();
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

/** Cookie attributes shared by login (set) and logout (clear). */
export function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
    maxAge,
  };
}

export const SET_COOKIE_MAX_AGE = MAX_AGE;

/**
 * Guard for admin API routes. Returns a 401 NextResponse if the request is not
 * authenticated, or null if it is — call at the top of every protected handler:
 *   const denied = requireAdmin(req); if (denied) return denied;
 */
export function requireAdmin(req: NextRequest): NextResponse | null {
  const token = req.cookies.get(ADMIN_COOKIE)?.value;
  if (isValidToken(token)) return null;
  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

/** Server-component helper for the /admin page gate. */
export async function isAdminFromCookies(): Promise<boolean> {
  const store = await cookies();
  return isValidToken(store.get(ADMIN_COOKIE)?.value);
}
