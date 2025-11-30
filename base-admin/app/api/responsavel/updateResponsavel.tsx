import { getCookie } from "~/utils/cookies";
import type { UpdateResponsavelDto } from "~/interfaces/responsavel";
import AxiosConnection from "..";

export async function updateResponsavel(
  id: string,
  body: UpdateResponsavelDto
) {
  try {
    const authToken = getCookie("authToken");
    if (!authToken) throw new Error("Não autenticado");

    const response = await AxiosConnection.api.patch(
      `/responsavel/${id}`,
      body
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Erro ao atualizar responsável."
    );
  }
}
