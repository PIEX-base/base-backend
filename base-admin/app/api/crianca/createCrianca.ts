import { getCookie } from "~/utils/cookies";
import type { CriancaCreatePayload } from "~/interfaces/crianca";
import AxiosConnection from "..";

export async function createCrianca(body: CriancaCreatePayload) {
  try {
    const authToken = getCookie("authToken");
    if (!authToken) throw new Error("Não autenticado");

    const response = await AxiosConnection.api.post(
      "/crianca",
      {
        ...body,
        data_nascimento: new Date(body.data_nascimento).toISOString(),
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Erro ao criar criança.");
  }
}
