import { Atividade, Crianca, Frequencia, Pessoa, StatusMatricula } from "@prisma/client";

export class MatriculaAtividadeEntity {
  id_matricula: bigint;
  id_pessoa?: bigint | null;
  id_crianca?: bigint | null;
  id_atividade: bigint;
  data_matricula: Date;
  status: StatusMatricula;
  observacoes?: string | null;

  pessoa?: Pessoa | null;
  crianca?: Crianca | null;
  atividade?: Atividade | null;
  frequencias?: Frequencia[];
}
