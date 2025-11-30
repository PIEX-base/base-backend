import { CestaBasica } from "@prisma/client";

export class CestaBasicaEntity implements CestaBasica {
  id_cesta: bigint;
  id_responsavel: bigint | null;
  id_beneficiario: bigint | null;
  id_doacao: bigint | null;
  data_entrega: Date;
  observacoes: string | null;
}
