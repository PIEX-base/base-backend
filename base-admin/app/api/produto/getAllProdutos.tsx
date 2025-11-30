import { getCookie } from "~/utils/cookies";
import AxiosConnection from "..";

export async function getAllProdutos() {
  try {
    const authToken = getCookie("authToken");
    if (!authToken) throw new Error("Não autenticado");

    const response = await AxiosConnection.api.get("/produto");
    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Erro desconhecido."
    );
  }
}
