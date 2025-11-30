export interface UpdatePessoaPayload {
  id_familia?: string;
  nome?: string;
  data_nascimento?: string;
  rg?: string;
  cpf?: string;
  foto_url?: string;
  observacoes?: string;
  ehCrianca: boolean;
}

export interface Pessoa {
  id_pessoa: string;
  id_familia: string;
  nome: string;
  data_nascimento: string;
  rg: string | null;
  cpf: string | null;
  foto_url: string | null;
  observacoes: string | null;
  ehCrianca: boolean;
  matriculada_escola: boolean;
  nome_escola: string | null;
  familia: {
    id_familia: string;
    nome: string;
  } | null;
}

export interface ModalDetalhesPessoaProps {
  pessoa: Pessoa;
}
