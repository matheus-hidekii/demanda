import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/_authenticated/tecnico")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Painel do Técnico - Demanda" },
      { name: "description", content: "Painel do técnico no sistema Demanda." },
      { property: "og:title", content: "Painel do Técnico - Demanda" },
      { property: "og:description", content: "Painel do técnico no sistema Demanda." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  beforeLoad: async ({ context }) => {
    if (context.profile.tipo !== "tecnico") {
      throw redirect({ to: "/solicitante" });
    }
  },
  component: TecnicoPage,
});

function TecnicoPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-3xl font-bold text-foreground">Painel do Técnico</h1>
        <p className="mt-2 text-muted-foreground">Bem-vindo à área do técnico.</p>
      </div>
    </div>
  );
}
