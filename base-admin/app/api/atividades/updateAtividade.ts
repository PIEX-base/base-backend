import type { UpdateAtividadePayload } from "~/interfaces/atividade";
import { getCookie } from "~/utils/cookies";
import AxiosConnection from "..";

export async function updateAtividade(
  id: string,
  body: UpdateAtividadePayload
) {
  try {
    const authToken = getCookie("authToken");
    if (!authToken) throw new Error("Não autenticado");

    const response = await AxiosConnection.api.patch(
      `/atividade/${id}`,
      body
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Erro ao atualizar atividade."
    );
  }
}
