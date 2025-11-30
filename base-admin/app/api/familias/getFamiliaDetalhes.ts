import type { FamiliaDetalhes } from "~/interfaces/familias";
import { getCookie } from "~/utils/cookies";
import AxiosConnection from "..";

export async function getFamiliaDetalhes(
  id: number
): Promise<FamiliaDetalhes | null> {
  try {
    const authToken = getCookie("authToken");
    const userCookie = getCookie("user");
    if (!authToken || !userCookie) throw new Error("Não autenticado");
    const response = await AxiosConnection.api.get(
      `/familia/detalhes/${id}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Erro ao buscar detalhes de famílias."
    );
  }
}
