import { getCookie } from "~/utils/cookies";
import type { UpdateFamiliaPayload } from "~/interfaces/familias";
import AxiosConnection from "..";

export async function updateFamilia(id: string, body: UpdateFamiliaPayload) {
  try {
    const authToken = getCookie("authToken");
    if (!authToken) throw new Error("Não autenticado");

    const response = await AxiosConnection.api.patch(
      `/familia/${id}`,
      body
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Erro ao atualizar família."
    );
  }
}
