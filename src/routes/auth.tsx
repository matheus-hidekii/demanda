import { createFileRoute, redirect, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const authSearchSchema = z.object({
  error: z.enum(["perfil_invalido"]).optional(),
});

export const Route = createFileRoute("/auth")({
  ssr: false,
  validateSearch: authSearchSchema,
  head: () => ({
    meta: [
      { title: "Entrar - Demanda" },
      { name: "description", content: "Acesse o sistema Demanda de gerenciamento de chamados de TI." },
      { property: "og:title", content: "Entrar - Demanda" },
      { property: "og:description", content: "Acesse o sistema Demanda de gerenciamento de chamados de TI." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  beforeLoad: async ({ search }) => {
    if (search.error === "perfil_invalido") return;
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      throw redirect({ to: "/" });
    }
  },
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate({ from: "/auth" });
  const search = Route.useSearch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (search.error === "perfil_invalido") {
      toast.error("Perfil inválido", {
        description: "Sua conta não possui um perfil válido no sistema. Entre em contato com o administrador.",
      });
    }
  }, [search.error]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      toast.error("Erro ao entrar", {
        description: error.message,
      });
      setIsLoading(false);
      return;
    }

    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError || !userData.user) {
      toast.error("Erro ao recuperar sessão", {
        description: "Não foi possível identificar o usuário. Tente novamente.",
      });
      setIsLoading(false);
      return;
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("tipo")
      .eq("id", userData.user.id)
      .single();

    if (profileError || !profile) {
      await supabase.auth.signOut();
      toast.error("Perfil não encontrado", {
        description: "Entre em contato com o administrador do sistema.",
      });
      setIsLoading(false);
      return;
    }

    toast.success("Login realizado com sucesso!");

    if (profile.tipo === "tecnico") {
      navigate({ to: "/tecnico" });
    } else {
      navigate({ to: "/solicitante" });
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background to-muted/50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/20">
            <span className="text-2xl font-bold text-primary-foreground">D</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Demanda</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Sistema de gerenciamento de chamados de TI
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-border bg-card/80 p-8 shadow-xl shadow-black/5 backdrop-blur-sm">
          <h2 className="mb-6 text-xl font-semibold text-card-foreground">Entrar na sua conta</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-card-foreground">
                E-mail
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-input bg-background px-10 py-3 text-sm text-foreground outline-none ring-ring transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-card-foreground">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-input bg-background px-10 py-3 text-sm text-foreground outline-none ring-ring transition-all placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? "Ocultar" : "Mostrar"}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link
                to="/"
                className="text-xs font-medium text-primary hover:text-primary/80 hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>

            <button
              type="submit"
              disabled={isLoading || !email || !password}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  Entrar
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Versão inicial - Apenas login disponível nesta etapa
        </p>
      </div>
    </div>
  );
}
