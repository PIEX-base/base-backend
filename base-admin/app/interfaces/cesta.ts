import type { BeneficiarioExterno } from "./beneficiario-externo";
import type { Doacao } from "./doacao";
import type { Familia } from "./familias";
import type { ProdutoCesta } from "./produto";
import type { Responsavel } from "./responsavel";

export interface CestaBasica {
  id_cesta: string;
  id_responsavel?: string;
  id_beneficiario?: string;
  data_entrega: string;
  observacoes?: string;
  responsavel?: { nome: string };
  beneficiario_externo?: { nome: string };
  produtos: Array<{
    produto: { nome: string; unidade_medida: string };
    quantidade: number;
  }>;
}

export interface CestaCreatePayload {
  id_responsavel?: number;
  data_entrega: string;
  id_beneficiario: bigint | null;
  id_doacao: bigint | null;
  observacoes?: string;
  produtos?: Array<{
    id_produto: number;
    quantidade: number;
  }>;
}

export interface CestaBasicaDetalhes {
  id_cesta: string;
  id_responsavel?: string;
  id_beneficiario?: string | null;
  id_doacao?: string | null;
  data_entrega: string;
  observacoes?: string | null;
  responsavel?: Responsavel & { familia?: Familia };
  beneficiario_externo?: BeneficiarioExterno;
  doacao_origem?: Doacao;
  produtos: ProdutoCesta[];
}
