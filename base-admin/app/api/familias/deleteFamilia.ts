import { getCookie } from "~/utils/cookies";
import AxiosConnection from "..";

export async function deleteFamilia(id: string) {
  try {
    const authToken = getCookie("authToken");
    if (!authToken) throw new Error("Não autenticado");

    await AxiosConnection.api.delete(`/familia/${id}`);
    return { success: true };
  } catch (error) {
    console.log("Erro ao excluir família:", error);

    throw new Error(
      error instanceof Error ? error.message : "Erro ao excluir família."
    );
  }
}
