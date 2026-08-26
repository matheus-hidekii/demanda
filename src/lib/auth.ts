import { supabase } from "./supabase";
import type { Profile } from "./types";

export async function getCurrentProfile(): Promise<Profile | null> {
  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData.user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("id, nome, tipo")
    .eq("id", userData.user.id)
    .single();

  if (error || !data) return null;
  return data as Profile;
}
