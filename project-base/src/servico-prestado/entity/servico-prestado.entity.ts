import { ServicoPrestado } from "@prisma/client";

export class ServicoPrestadoEntity implements ServicoPrestado {
  id_servico: bigint;
  id_parceiro: bigint;
  descricao: string;
  data_inicio: Date;
  data_fim: Date | null;
  observacoes: string | null;
}
