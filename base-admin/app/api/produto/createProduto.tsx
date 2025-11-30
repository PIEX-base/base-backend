import type { ProdutoCreatePayload } from "~/interfaces/produto";
import { getCookie } from "~/utils/cookies";
import AxiosConnection from "..";

export async function createProduto(body: ProdutoCreatePayload) {
  let response;
  try {
    const authToken = getCookie("authToken");
    if (!authToken) throw new Error("Não autenticado");

    const response = await AxiosConnection.api.post("/produto", body);
    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Erro ao criar produto."
    );
  }
}
