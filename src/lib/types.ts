export type ProfileTipo = "tecnico" | "solicitante";

export interface Profile {
  id: string;
  nome: string;
  tipo: ProfileTipo;
}
