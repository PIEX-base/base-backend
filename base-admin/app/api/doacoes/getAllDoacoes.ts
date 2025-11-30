import { getCookie } from "~/utils/cookies";
import AxiosConnection from "..";

export async function getAllDoacoes() {
  try {
    const authToken = getCookie("authToken");
    const userCookie = getCookie("user");

    if (!authToken || !userCookie) throw new Error("Não autenticado");
    const response = await AxiosConnection.api.get(`/doacao`);
    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Erro ao buscar informações de doações."
    );
  }
}
