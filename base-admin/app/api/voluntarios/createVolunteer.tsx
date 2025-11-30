import { getCookie } from "~/utils/cookies";
import type { CreateVolunteerPayload } from "~/interfaces/volunteers";
import AxiosConnection from "..";

export async function createVolunteer(payload: CreateVolunteerPayload) {
  const authToken = getCookie("authToken");
  if (!authToken) throw new Error("Usuário não autenticado.");

  const response = await AxiosConnection.api.post(`/voluntario`, payload);
  return response.data;
}
