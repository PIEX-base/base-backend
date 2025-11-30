export interface Responsavel {
  id_responsavel: string;
  nome: string;
  cpf: string;
  rg: string;
  data_nascimento: string;
  telefone: string;
  email: string | null;
  ocupacao: string | null;
  endereco: string;
  foto_url: string | null;
  familia: {
    id_familia: string | null;
    nome: string | null;
  };
}

export interface CreateResponsavelDto {
  nome: string;
  cpf: string;
  rg: string;
  data_nascimento: string;
  telefone: string;
  endereco: string;
  email?: string;
  ocupacao?: string;
  foto_url?: string;
  id_familia?: number | null;
}

export interface UpdateResponsavelDto extends Partial<CreateResponsavelDto> {}
