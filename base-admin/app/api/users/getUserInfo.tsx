import { getCookie } from "~/utils/cookies";
import AxiosConnection from "..";

export async function getUserInfo() {
  try {
    const authToken = getCookie("authToken");
    const userCookie = getCookie("user");

    if (!authToken || !userCookie) throw new Error("Não autenticado");

    const userFromCookie = JSON.parse(userCookie);
    const userId = userFromCookie.id;
    const response = await AxiosConnection.api.get(`/usuario/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error
        ? error.message
        : "Erro ao buscar informações do usuário."
    );
  }
}
