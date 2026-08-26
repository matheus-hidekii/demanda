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

function SolicitantePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-foreground">Painel do Solicitante</h1>
        <p className="mt-2 text-muted-foreground">Bem-vindo à área do solicitante.</p>
      </div>
    </div>
  );
}
