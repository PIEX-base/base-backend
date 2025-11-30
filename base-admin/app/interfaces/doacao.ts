export type TipoDoacao = "monetaria" | "material";

export interface Doacao {
  id_doacao: string;
  id_parceiro: string | null;
  tipo: TipoDoacao;
  valor: number | null;
  descricao: string;
  data_recebimento: string;
  comprovante_url: string | null;
  is_anonima: boolean;
}
