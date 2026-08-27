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

import { SignOutButton } from "@/components/SignOutButton";

function TecnicoPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="flex items-center justify-between border-b border-border px-4 py-4 sm:px-6">
        <h1 className="text-xl font-bold text-foreground">Painel do Técnico</h1>
        <SignOutButton />
      </header>
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h2 className="text-2xl font-bold text-foreground">Bem-vindo à área do técnico</h2>
          <p className="mt-2 text-muted-foreground">Aqui ficará o painel de chamados em breve.</p>
        </div>
      </main>
    </div>
  );
}
