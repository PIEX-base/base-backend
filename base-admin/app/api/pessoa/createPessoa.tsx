import { getCookie } from "~/utils/cookies";
import AxiosConnection from "..";

export interface PessoaCreatePayload {
  id_familia?: string;
  nome: string;
  data_nascimento: string;
  rg?: string;
  cpf?: string;
  foto_url?: string;
  observacoes?: string;
}

export async function createPessoa(body: PessoaCreatePayload) {
  try {
    const authToken = getCookie("authToken");
    if (!authToken) throw new Error("Não autenticado");
    const response = await AxiosConnection.api.post("/pessoa", {
      ...body,
      data_nascimento: new Date(body.data_nascimento).toISOString(),
    });
    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Erro ao criar pessoa."
    );
  }
}
