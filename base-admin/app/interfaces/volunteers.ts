export interface CreateVolunteerPayload {
  nome: string;
  cpf: string;
  rg: string;
  endereco: string;
  email: string;
  telefone: string;
  disponibilidade: string;
  area_atuacao: string;
  tem_antecedentes: boolean;
  url_comprovante: string;
  respondeu_questionario: boolean;
  aceitou_termos: boolean;
}

export interface Voluntario extends CreateVolunteerPayload {
  id_voluntario: string;
  atividades_realizadas: any[];
  data_cadastro: string;
}
