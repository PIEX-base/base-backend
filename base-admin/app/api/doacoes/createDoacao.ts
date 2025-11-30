import { getCookie } from "~/utils/cookies";
import type { Doacao } from "~/interfaces/doacao";
import AxiosConnection from "..";

export async function createDoacao(payload: Omit<Doacao, 'id_doacao'>) {
  const authToken = getCookie("authToken");
  if (!authToken) throw new Error("Usuário não autenticado.");

  const response = await AxiosConnection.api.post(`/doacao`, payload);
  return response.data;
}
