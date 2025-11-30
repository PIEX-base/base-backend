import { getCookie } from "~/utils/cookies";
import AxiosConnection from "..";

interface FamiliaCreatePayload {
  nome: string;
  numero_dependentes: number;
  id_responsavel?: number;
  observacoes?: string;
}

export async function createFamilia(body: FamiliaCreatePayload) {
  try {
    const authToken = getCookie("authToken");
    const userCookie = getCookie("user");
    if (!authToken || !userCookie) throw new Error("Não autenticado");
    const response = await AxiosConnection.api.post("/familia", body);
    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Erro ao criar família."
    );
  }
}
