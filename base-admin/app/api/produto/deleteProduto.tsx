import { getCookie } from "~/utils/cookies";
import AxiosConnection from "..";

export async function deleteProduto(id: string) {
  console.log(`Deleting produto with ID: ${id}`);

  try {
    const authToken = getCookie("authToken");
    if (!authToken) throw new Error("Não autenticado");

    await AxiosConnection.api.delete(`/produto/${id}`);
  } catch (error) {
    console.error("Erro ao deletar produto:", error);

    throw new Error(
      error instanceof Error ? error.message : "Erro ao deletar produto."
    );
  }
}
