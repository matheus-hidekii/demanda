import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env["DEMO_SUPABASE_URL"];
const supabasePublishableKey = import.meta.env["DEMO_SUPABASE_PUBLISHABLE_KEY"];

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error(
    "Missing Supabase environment variables. Check DEMO_SUPABASE_URL and DEMO_SUPABASE_PUBLISHABLE_KEY."
  );
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "demanda-auth-token",
  },
});
