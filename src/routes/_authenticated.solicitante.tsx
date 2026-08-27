import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/solicitante")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Painel do Solicitante - Demanda" },
      { name: "description", content: "Painel do solicitante no sistema Demanda." },
      { property: "og:title", content: "Painel do Solicitante - Demanda" },
      { property: "og:description", content: "Painel do solicitante no sistema Demanda." },
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

import { SignOutButton } from "@/components/SignOutButton";

function SolicitantePage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6">
        <h1 className="text-xl font-bold text-foreground">Painel do Solicitante</h1>
        <SignOutButton />
      </header>
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold text-foreground">Bem-vindo à área do solicitante</h2>
          <p className="mt-2 text-muted-foreground">Aqui ficará o painel de solicitações em breve.</p>
        </div>
      </main>
    </div>
  );
}
