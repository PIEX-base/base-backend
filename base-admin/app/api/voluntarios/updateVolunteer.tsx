import { getCookie } from "~/utils/cookies";
import type { Voluntario } from "~/interfaces/volunteers";
import AxiosConnection from "..";

export async function updateVolunteer(
  volunteerId: string | number,
  payload: Partial<Voluntario>
) {
  const authToken = getCookie("authToken");
  if (!authToken) throw new Error("Usuário não autenticado.");

  const response = await AxiosConnection.api.put(
    `/voluntario/${volunteerId}`,
    payload
  );
  return response.data;
}
