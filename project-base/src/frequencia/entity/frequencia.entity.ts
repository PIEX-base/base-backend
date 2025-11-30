import { Frequencia } from "@prisma/client";

export class FrequenciaEntity implements Frequencia {
  id_frequencia: bigint;
  id_matricula: bigint;
  data: Date;
  presenca: boolean;
  justificativa: string | null;
}
