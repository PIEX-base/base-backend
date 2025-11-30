import { getCookie } from "~/utils/cookies";
import AxiosConnection from "..";

export async function deleteMatricula(id: string) {
  try {
    const authToken = getCookie("authToken");
    if (!authToken) throw new Error("Não autenticado");

    const response = await AxiosConnection.api.delete(
      `/matricula-atividade/${id}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Erro ao excluir matrícula.");
  }
}
