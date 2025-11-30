import type { CriancaUpdatePayload } from "~/interfaces/crianca";
import { getCookie } from "~/utils/cookies";
import AxiosConnection from "..";

export async function updateCrianca(id: string, body: CriancaUpdatePayload) {
  try {
    const authToken = getCookie("authToken");
    if (!authToken) throw new Error("Não autenticado");

    const response = await AxiosConnection.api.patch(
      `/crianca/${id}`,
      body
    );

    if (response.status !== 200) {
      const errorData = response.data || {};
      throw new Error(errorData.message || "Erro ao atualizar criança.");
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Erro ao atualizar criança.");
  }
}
