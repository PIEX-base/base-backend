import { getCookie } from "~/utils/cookies";
import type { UserUpdatePayload } from "~/interfaces/user";
import AxiosConnection from "..";

export async function updateUser(
  userId: string | number,
  payload: UserUpdatePayload
) {
  const authToken = getCookie("authToken");
  if (!authToken) throw new Error("Usuário não autenticado.");

  const response = await AxiosConnection.api.put(
    `/usuario/${userId}`,
    payload
  );
  return response.data;
}
