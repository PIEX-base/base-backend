import { Spinner } from "~/components/ui/Spinner";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import { FamiliasPage } from "~/pages/familias/FamiliasPage";

export default function FamiliasRoutes() {
  const { user, isLoading, error } = useCurrentUser();

  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <Spinner size="md" />
      </div>
    );
  if (error) return <div>Erro: {error}</div>;
  if (!user)
    return <div>Não foi possível carregar os dados do usuário logado.</div>;

  return <FamiliasPage />;
}
