import { getCookie } from "~/utils/cookies";
import AxiosConnection from "..";

export async function getAllMatriculas() {
  try {
    const authToken = getCookie("authToken");
    if (!authToken) throw new Error("Não autenticado");

    const response = await AxiosConnection.api.get(
      "/matricula-atividade"
    );
    return response.data;
  } catch (error) {
    throw new Error("Erro ao buscar matrículas.");
  }
}
