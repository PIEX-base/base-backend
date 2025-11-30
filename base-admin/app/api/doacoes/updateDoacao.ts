import { getCookie } from "~/utils/cookies";
import type { Doacao } from "~/interfaces/doacao";
import AxiosConnection from "..";

export async function updateDoacao(
  doacaoId: string | number,
  payload: Partial<Doacao>
) {
  const authToken = getCookie("authToken");
  if (!authToken) throw new Error("Usuário não autenticado.");

  const response = await AxiosConnection.api.patch(
    `/doacao/${doacaoId}`,
    payload
  );
  return response.data;
}
