import { getCookie } from "~/utils/cookies";
import AxiosConnection from "..";

export async function deleteUser(userId: string | number) {
  const authToken = getCookie("authToken");
  if (!authToken) throw new Error("Usuário não autenticado.");

  await AxiosConnection.api.delete(`/usuario/${userId}`);
  return { success: true };
}
