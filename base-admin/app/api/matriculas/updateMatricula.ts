import type { UpdateMatriculaPayload } from "~/interfaces/matricula";
import { getCookie } from "~/utils/cookies";
import AxiosConnection from "..";

export async function updateMatricula(
  id: string,
  body: UpdateMatriculaPayload
) {
  try {
    const authToken = getCookie("authToken");
    if (!authToken) throw new Error("Não autenticado");

    const response = await AxiosConnection.api.patch(
      `/matricula-atividade/${id}`,
      body
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Erro ao atualizar matrícula."
    );
  }
}
