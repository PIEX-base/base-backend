export interface BeneficiarioExterno {
  id_beneficiario: string;
  nome: string;
  telefone: string;
  endereco: string;
  observacoes: string | null;
  origem: string;
}

export type BeneficiarioExternoCreatePayload = Omit<
  BeneficiarioExterno,
  "id_beneficiario"
>;
