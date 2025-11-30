import { getCookie } from "~/utils/cookies";
import AxiosConnection from "..";

export async function deletePessoa(id: string) {
  try {
    const authToken = getCookie("authToken");
    if (!authToken) throw new Error("Não autenticado");

    await AxiosConnection.api.delete(`/pessoa/${id}`);
    return { success: true };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Erro ao excluir pessoa."
    );
  }
}
