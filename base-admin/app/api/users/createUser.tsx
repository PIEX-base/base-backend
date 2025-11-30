import { getCookie } from "~/utils/cookies";
import type { UserCreatePayload } from "~/interfaces/user";
import AxiosConnection from "..";

export async function createUser(
  userId: string | number,
  payload: UserCreatePayload
) {
  const authToken = getCookie("authToken");
  if (!authToken) throw new Error("Usuário não autenticado.");

  const response = await AxiosConnection.api.post(`/usuario`, payload);
  return response.data;
}
