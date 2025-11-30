import type { CreateAtividadePayload } from "~/interfaces/atividade";
import { getCookie } from "~/utils/cookies";
import AxiosConnection from "..";

export async function createAtividade(body: CreateAtividadePayload) {
  try {
    const authToken = getCookie("authToken");
    if (!authToken) throw new Error("Não autenticado");

    const payload = {
      ...body,
      horario_inicio: `1970-01-01T${body.horario_inicio}:00.000`,
      horario_fim: `1970-01-01T${body.horario_fim}:00.000`,
    };

    const response = await AxiosConnection.api.post(
      `/atividade`,
      payload
    );

    if (response.status !== 201) {
      const errorData = response.data || {};
      throw new Error(errorData.message || "Erro ao criar atividade.");
    }

    return response.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Erro ao criar atividade.");
  }
}
