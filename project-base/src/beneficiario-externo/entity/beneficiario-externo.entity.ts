import { BeneficiarioExterno } from "@prisma/client";

export class BeneficiarioExternoEntity implements BeneficiarioExterno {
  id_beneficiario: bigint;
  nome: string;
  telefone: string | null;
  endereco: string | null;
  origem: string;
  observacoes: string | null;
}
