import { useState, useEffect } from "react";
import { getUserInfo } from "~/api/users/getUserInfo";
import { useAuth } from "~/hooks/useAuth";
import type { User } from "~/interfaces/user";

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated } = useAuth();

  const authenticated = isAuthenticated();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!authenticated) {
        setError("Usuário não autenticado.");
        setIsLoading(false);
        return;
      }

      try {
        const userData: User = await getUserInfo();

        if (!userData) {
          setError("Usuário não encontrado.");
          setIsLoading(false);
          return;
        }
        setUser(userData);
      } catch (err: any) {
        setError(err.message || "Ocorreu um erro ao carregar os dados.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [authenticated]);

  return { user, isLoading, error };
}
