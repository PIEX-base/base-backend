import { useState } from "react";
import { useNavigate } from "react-router";
import { eraseCookie, getCookie, setCookie } from "~/utils/cookies";
import { useToast } from "~/contexts/ToastContext";
import type { AuthResponse, LoginCredentials } from "~/interfaces/user";
import { userLogin } from "~/api/users/login";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { showToast } = useToast();

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const data: AuthResponse = await userLogin(credentials);

      // Salvar token e usuário em cookies
      setCookie("authToken", data.accessToken, 7); // Expira em 7 dias
      setCookie("user", JSON.stringify(data.user), 7);

      showToast("success", "Login realizado com sucesso!");

      // Redirecionar para a página inicial autenticada
      navigate("/");

      return data;
    } catch (error) {
      showToast(
        "danger",
        error instanceof Error ? error.message : "Erro ao fazer login"
      );
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    eraseCookie("authToken");
    eraseCookie("user");
    navigate("/login");
  };

  const getUser = () => {
    const userStr = getCookie("user");
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (error) {
      console.error("Erro ao parsear o cookie do usuário:", error);
      eraseCookie("user");
      return null;
    }
  };

  const isAuthenticated = () => {
    return !!getCookie("authToken");
  };

  return { login, logout, getUser, isAuthenticated, isLoading };
}
