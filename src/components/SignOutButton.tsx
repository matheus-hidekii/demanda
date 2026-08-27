import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { supabase } from "@/lib/supabase";
import { LogOut } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function SignOutButton() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignOut() {
    try {
      setIsLoading(true);
      await queryClient.cancelQueries();
      queryClient.clear();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate({ to: "/auth", replace: true });
    } catch (error) {
      toast.error("Erro ao sair", {
        description: error instanceof Error ? error.message : "Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={isLoading}
      className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-60"
    >
      <LogOut className="h-4 w-4" />
      {isLoading ? "Saindo..." : "Sair"}
    </button>
  );
}
