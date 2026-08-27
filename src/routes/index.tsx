import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Demanda - Gerenciamento de Chamados de TI" },
      { name: "description", content: "Sistema Demanda para gerenciamento de solicitações e chamados de suporte de TI." },
      { property: "og:title", content: "Demanda - Gerenciamento de Chamados de TI" },
      { property: "og:description", content: "Sistema Demanda para gerenciamento de solicitações e chamados de suporte de TI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  beforeLoad: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) {
      throw redirect({ to: "/auth" });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("tipo")
      .eq("id", data.user.id)
      .single();

    if (profileError || !profile) {
      await supabase.auth.signOut();
      throw redirect({ to: "/auth", search: { error: "perfil_invalido" } });
    }

    if (profile.tipo === "tecnico") {
      throw redirect({ to: "/tecnico" });
    }

    throw redirect({ to: "/solicitante" });
  },
  component: Index,
});

function Index() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-foreground">Demanda</h1>
        <p className="mt-2 text-muted-foreground">Redirecionando...</p>
      </div>
    </div>
  );
}
