import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/auth" });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, nome, tipo")
      .eq("id", data.user.id)
      .single();

    if (profileError || !profile) {
      await supabase.auth.signOut();
      throw redirect({ to: "/auth", search: { error: "perfil_invalido" } });
    }

    return { user: data.user, profile };
  },
  component: AuthLayout,
});

function AuthLayout() {
  return <Outlet />;
}
