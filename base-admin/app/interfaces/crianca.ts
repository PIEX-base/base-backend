import type { Familia } from "./familias";

export interface CriancaCreatePayload {
  id_familia?: string;
  nome: string;
  data_nascimento: string;
  rg?: string;
  cpf?: string;
  foto_url?: string;
  observacoes?: string;
  matriculada_escola: boolean;
  nome_escola: string | null;
}

export type CriancaUpdatePayload = Partial<
  Omit<CriancaCreatePayload, "id_familia">
>;

export interface Crianca {
  id_crianca: string;
  id_familia: string;
  nome: string;
  data_nascimento: string;
  rg?: string;
  cpf?: string;
  foto_url?: string;
  observacoes?: string;
  matriculada_escola: boolean;
  nome_escola: string | null;
  familia: Familia;
  matriculas: any[]; // Ajustar tipo
}
