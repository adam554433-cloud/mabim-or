import { createClient, SupabaseClient } from "@supabase/supabase-js";

// Service-role Supabase client. SERVER ONLY — bypasses RLS.
// Never import this from a "use client" file; it would leak the service key.
//
// Created lazily on first use so the module can be imported at build time
// (page-data collection) without SUPABASE_SERVICE_ROLE_KEY being present.
let client: SupabaseClient | null = null;

function getClient(): SupabaseClient {
  if (!client) {
    client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
  }
  return client;
}

export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const real = getClient();
    const value = Reflect.get(real, prop, real);
    return typeof value === "function" ? value.bind(real) : value;
  },
});
