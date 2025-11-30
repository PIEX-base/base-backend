import { getCookie } from "~/utils/cookies";
import AxiosConnection from "..";

export async function getAllFamilias() {
  try {
    const authToken = getCookie("authToken");
    const userCookie = getCookie("user");
    if (!authToken || !userCookie) throw new Error("Não autenticado");
    const response = await AxiosConnection.api.get("/familia");
    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Erro ao buscar famílias."
    );
  }
}
