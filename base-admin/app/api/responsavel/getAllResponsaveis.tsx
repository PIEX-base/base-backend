import { getCookie } from "~/utils/cookies";
import AxiosConnection from "..";

export async function getAllResponsaveis() {
  try {
    const authToken = getCookie("authToken");
    if (!authToken) throw new Error("Não autenticado");

    const response = await AxiosConnection.api.get("/responsavel");

    return response.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message || "Erro ao buscar responsáveis."
    );
  }
}
