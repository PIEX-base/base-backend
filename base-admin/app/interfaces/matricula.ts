import type { StatusMatricula } from "~/enums/matriculas";
import type { Atividade } from "./atividade";
import type { Crianca } from "./crianca";

export interface Matricula {
  id_matricula: string;
  id_pessoa: string;
  id_atividade: string;
  data_matricula: string;
  status: StatusMatricula;
  observacoes: string | null;
  crianca: Pick<Crianca, "nome" | "cpf" | "id_crianca">;
  pessoa: Pick<Crianca, "nome" | "cpf">;
  atividade: Pick<Atividade, "nome">;
}

export interface CreateMatriculaPayload {
  id_crianca: number;
  id_atividade: number;
  observacoes?: string;
}

export interface UpdateMatriculaPayload {
  status?: StatusMatricula;
  observacoes?: string;
}
