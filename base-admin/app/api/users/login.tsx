import type { LoginCredentials } from "~/interfaces/user";
import AxiosConnection from "..";

export async function userLogin(credentials: LoginCredentials) {
  const response = await AxiosConnection.api.post(
    "/auth/login",
    credentials
  );
  return response.data;
}
