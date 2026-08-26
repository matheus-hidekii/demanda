import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    console.log("[_authenticated/route.tsx] getUser result:", {
      hasUser: !!data?.user,
      userId: data?.user?.id ?? null,
      error: error?.message ?? null,
    });
    if (error || !data.user) {
      throw redirect({ to: "/auth" });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, nome, tipo")
      .eq("id", data.user.id)
      .single();

    console.log("[_authenticated/route.tsx] profiles query result:", {
      userId: data.user.id,
      hasRecord: !!profile,
      record: profile ?? null,
      error: profileError
        ? { message: profileError.message, code: profileError.code, details: profileError.details, hint: profileError.hint }
        : null,
    });

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
