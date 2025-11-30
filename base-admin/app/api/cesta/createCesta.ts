import type { CestaCreatePayload } from "~/interfaces/cesta";
import { getCookie } from "~/utils/cookies";
import AxiosConnection from "..";

export async function createCesta(body: CestaCreatePayload) {
  let response;

  console.log(`Creating cesta with body:`, body);

  try {
    const authToken = getCookie("authToken");
    const userCookie = getCookie("user");
    if (!authToken || !userCookie) throw new Error("Não autenticado");

    const response = await AxiosConnection.api.post("/cesta-basica", body);
    return response.data;
  } catch (error) {
    console.log("Erro ao criar cesta:", error);

    throw new Error(
      error instanceof Error ? error.message : "Erro ao criar cesta básica."
    );
  }
}
