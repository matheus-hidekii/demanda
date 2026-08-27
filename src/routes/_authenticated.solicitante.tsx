import { createFileRoute, redirect } from "@tanstack/react-router";
import { SignOutButton } from "@/components/SignOutButton";
import { NovaSolicitacaoForm } from "@/components/NovaSolicitacaoForm";

export const Route = createFileRoute("/_authenticated/solicitante")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Painel do Solicitante - Demanda" },
      { name: "description", content: "Abra novas solicitações de suporte de TI no sistema Demanda." },
      { property: "og:title", content: "Painel do Solicitante - Demanda" },
      { property: "og:description", content: "Abra novas solicitações de suporte de TI no sistema Demanda." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  beforeLoad: async ({ context }) => {
    if (context.profile.tipo !== "solicitante") {
      throw redirect({ to: "/tecnico" });
    }
  },
  component: SolicitantePage,
});

function SolicitantePage() {
  const { profile } = Route.useRouteContext();

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6">
        <div>
          <h1 className="text-xl font-bold text-foreground">Painel do Solicitante</h1>
          <p className="text-sm text-muted-foreground">{profile.nome}</p>
        </div>
        <SignOutButton />
      </header>
      <main className="flex-1 px-4 py-6 sm:px-6">
        <div className="mx-auto w-full max-w-2xl">
          <NovaSolicitacaoForm solicitanteId={profile.id} />
        </div>
      </main>
    </div>
  );
}
