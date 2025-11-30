import type { CreateResponsavelDto } from "~/interfaces/responsavel";
import { getCookie } from "~/utils/cookies";
import AxiosConnection from "..";

export async function createResponsavel(body: CreateResponsavelDto) {
  try {
    const authToken = getCookie("authToken");
    if (!authToken) throw new Error("Não autenticado");

    const response = await AxiosConnection.api.post("/responsavel", body);
    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Erro desconhecido."
    );
  }
}
