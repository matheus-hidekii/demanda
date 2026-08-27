import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { z } from "zod";

const PRIORIDADES = [
  { value: "baixa", label: "Baixa" },
  { value: "media", label: "Média" },
  { value: "alta", label: "Alta" },
] as const;

const demandSchema = z.object({
  titulo: z
    .string()
    .trim()
    .nonempty({ message: "Informe o título da solicitação." })
    .max(120, { message: "O título deve ter no máximo 120 caracteres." }),
  descricao: z
    .string()
    .trim()
    .nonempty({ message: "Descreva o problema." })
    .max(2000, { message: "A descrição deve ter no máximo 2000 caracteres." }),
  prioridade: z.enum(["baixa", "media", "alta"], {
    message: "Selecione a prioridade.",
  }),
});

type FieldErrors = Partial<Record<"titulo" | "descricao" | "prioridade", string>>;

export function NovaSolicitacaoForm({ solicitanteId }: { solicitanteId: string }) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [prioridade, setPrioridade] = useState<string>("media");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function resetForm() {
    setTitulo("");
    setDescricao("");
    setPrioridade("media");
    setErrors({});
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const parsed = demandSchema.safeParse({ titulo, descricao, prioridade });
    if (!parsed.success) {
      const fieldErrors: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      toast.error("Verifique os campos", {
        description: "Preencha corretamente os campos obrigatórios.",
      });
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    const { error } = await supabase.from("demands").insert({
      solicitante_id: solicitanteId,
      tecnico_id: null,
      titulo: parsed.data.titulo,
      descricao: parsed.data.descricao,
      status: "aberto",
      prioridade: parsed.data.prioridade,
    });

    setIsSubmitting(false);

    if (error) {
      toast.error("Não foi possível criar a solicitação", {
        description: error.message || "Tente novamente em alguns instantes.",
      });
      return;
    }

    toast.success("Solicitação enviada", {
      description: "Sua solicitação foi registrada e está com status “aberto”.",
    });
    resetForm();
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6"
    >
      <h2 className="text-lg font-semibold text-card-foreground">Nova Solicitação</h2>
      <p className="mt-1 text-sm text-muted-foreground">
        Descreva o problema para que a equipe de TI possa atendê-lo.
      </p>

      <div className="mt-6 space-y-5">
        <div>
          <label htmlFor="titulo" className="block text-sm font-medium text-foreground">
            Título <span className="text-destructive">*</span>
          </label>
          <input
            id="titulo"
            type="text"
            value={titulo}
            maxLength={120}
            onChange={(e) => setTitulo(e.target.value)}
            placeholder="Ex.: Computador não liga"
            className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
          {errors.titulo && <p className="mt-1.5 text-xs text-destructive">{errors.titulo}</p>}
        </div>

        <div>
          <label htmlFor="descricao" className="block text-sm font-medium text-foreground">
            Descrição do problema <span className="text-destructive">*</span>
          </label>
          <textarea
            id="descricao"
            value={descricao}
            rows={5}
            maxLength={2000}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Detalhe o que está acontecendo, mensagens de erro e desde quando ocorre."
            className="mt-1.5 w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
          />
          {errors.descricao && <p className="mt-1.5 text-xs text-destructive">{errors.descricao}</p>}
        </div>

        <div>
          <label htmlFor="prioridade" className="block text-sm font-medium text-foreground">
            Prioridade <span className="text-destructive">*</span>
          </label>
          <select
            id="prioridade"
            value={prioridade}
            onChange={(e) => setPrioridade(e.target.value)}
            className="mt-1.5 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
          >
            {PRIORIDADES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
          {errors.prioridade && <p className="mt-1.5 text-xs text-destructive">{errors.prioridade}</p>}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-60"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {isSubmitting ? "Enviando..." : "Enviar Solicitação"}
        </button>
        <button
          type="button"
          onClick={resetForm}
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent disabled:opacity-60"
        >
          Limpar
        </button>
      </div>
    </form>
  );
}
