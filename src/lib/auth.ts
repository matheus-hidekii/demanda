import { supabase } from "./supabase";
import type { Profile } from "./types";

export async function getCurrentProfile(): Promise<Profile | null> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  console.log("[auth.ts] getUser result:", {
    hasUser: !!userData?.user,
    userId: userData?.user?.id ?? null,
    error: userError?.message ?? null,
  });
  if (userError || !userData.user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, nome, tipo")
    .eq("id", userData.user.id)
    .single();

  console.log("[auth.ts] profiles query result:", {
    userId: userData.user.id,
    hasRecord: !!data,
    record: data ?? null,
    error: error ? { message: error.message, code: error.code, details: error.details, hint: error.hint } : null,
  });

  if (error || !data) return null;
  return data as Profile;
}
