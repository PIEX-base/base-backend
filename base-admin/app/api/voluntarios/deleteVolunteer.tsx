import { getCookie } from "~/utils/cookies";
import AxiosConnection from "..";

export async function deleteVolunteer(volunteerId: string) {
  const authToken = getCookie("authToken");
  if (!authToken) throw new Error("Usuário não autenticado.");

  await AxiosConnection.api.delete(`/voluntario/${volunteerId}`);
  return { success: true };
}
