import type { Metadata } from "next";
import { isAdminFromCookies } from "@/lib/adminAuth";
import AdminApp from "./_components/AdminApp";

export const runtime = "nodejs";
export const metadata: Metadata = {
  title: "ניהול",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const authed = await isAdminFromCookies();
  return <AdminApp initialAuthed={authed} />;
}
