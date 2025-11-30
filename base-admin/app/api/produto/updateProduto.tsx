import { getCookie } from "~/utils/cookies";
import type { ProdutoUpdatePayload } from "~/interfaces/produto";
import AxiosConnection from "..";

export async function updateProduto(id: string, body: ProdutoUpdatePayload) {
  console.log(`Updating produto with ID: ${id}`, body);

  try {
    const authToken = getCookie("authToken");
    if (!authToken) throw new Error("Não autenticado");

    const response = await AxiosConnection.api.put(`/produto/${id}`, body);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);

    throw new Error(
      error instanceof Error ? error.message : "Erro ao atualizar produto."
    );
  }
}
