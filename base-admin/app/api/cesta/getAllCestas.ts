import { getCookie } from "~/utils/cookies";
import AxiosConnection from "..";

interface ParamsProps {
  responsavel?: string;
  beneficiario?: string;
  doacao?: string;
}

export async function getAllCestasByParams(params: ParamsProps = {}) {
  try {
    const authToken = getCookie("authToken");
    const userCookie = getCookie("user");
    if (!authToken || !userCookie) throw new Error("Não autenticado");

    const response = await AxiosConnection.api.get("/cesta-basica", { params });

    return response.data;
  } catch (error) {
    throw new Error(
      error instanceof Error ? error.message : "Erro ao buscar cestas básicas."
    );
  }
}
