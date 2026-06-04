import { supabaseAdmin } from "@/lib/supabaseAdmin";

export interface AdminUserRow {
  id: string;
  display_name: string | null;
  full_name: string | null;
  gender: string | null;
  age: number | null;
  birth_date: string | null;
  country: string | null;
  city: string | null;
  social_consent: boolean | null;
  age_confirmed_at: string | null;
  onboarded_at: string | null;
  created_at: string | null;
  email: string | null;
}

function ageFromBirthDate(birth: string | null): number | null {
  if (!birth) return null;
  const d = new Date(birth);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age >= 0 && age < 130 ? age : null;
}

/** Profiles joined with their auth email, with age computed from birth_date. */
export async function getUsersWithEmails(): Promise<AdminUserRow[]> {
  const { data: profiles, error } = await supabaseAdmin
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;

  // Map auth emails (paginate defensively).
  const emailById = new Map<string, string>();
  let page = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { data, error: authErr } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage: 1000,
    });
    if (authErr) break;
    for (const u of data.users) if (u.email) emailById.set(u.id, u.email);
    if (data.users.length < 1000) break;
    page++;
  }

  return (profiles ?? []).map((p: Record<string, unknown>) => ({
    id: p.id as string,
    display_name: (p.display_name as string) ?? null,
    full_name: (p.full_name as string) ?? null,
    gender: (p.gender as string) ?? null,
    age: ageFromBirthDate((p.birth_date as string) ?? null),
    birth_date: (p.birth_date as string) ?? null,
    country: (p.country as string) ?? null,
    city: (p.city as string) ?? null,
    social_consent: (p.social_consent as boolean) ?? null,
    age_confirmed_at: (p.age_confirmed_at as string) ?? null,
    onboarded_at: (p.onboarded_at as string) ?? null,
    created_at: (p.created_at as string) ?? null,
    email: emailById.get(p.id as string) ?? null,
  }));
}
