import type { CreateMatriculaPayload } from "~/interfaces/matricula";
import { getCookie } from "~/utils/cookies";
import AxiosConnection from "..";

export async function createMatricula(body: CreateMatriculaPayload) {
  try {
    const authToken = getCookie("authToken");
    if (!authToken) throw new Error("Não autenticado");

    const response = await AxiosConnection.api.post(
      "/matricula-atividade",
      body
    );
    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Erro ao criar matrícula."
    );
  }
}
