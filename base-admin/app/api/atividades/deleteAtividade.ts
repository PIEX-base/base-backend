import { getCookie } from "~/utils/cookies";
import AxiosConnection from "..";

export async function deleteAtividade(id: string) {
  try {
    const authToken = getCookie("authToken");
    if (!authToken) throw new Error("Não autenticado");

    await AxiosConnection.api.delete(`/atividade/${id}`);
    return { success: true };
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Erro ao excluir atividade."
    );
  }
}
