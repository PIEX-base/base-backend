import type { UpdatePessoaPayload } from "~/interfaces/pessoa";
import { getCookie } from "~/utils/cookies";
import AxiosConnection from "..";

export async function updatePessoa(id: string, body: UpdatePessoaPayload) {
  try {
    const authToken = getCookie("authToken");
    if (!authToken) throw new Error("Não autenticado");

    const filtered = Object.fromEntries(
      Object.entries(body).filter(([, value]) => value != null)
    );
    const response = await AxiosConnection.api.patch(
      `/pessoa/${id}`,
      filtered
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Erro ao atualizar pessoa."
    );
  }
}
