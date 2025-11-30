import { Spinner } from "~/components/ui/Spinner";
import { useCurrentUser } from "~/hooks/useCurrentUser";
import { AccountPage } from "~/pages/account/AccountPage";

export default function AccountRoute() {
  const { user, isLoading, error } = useCurrentUser();

  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <Spinner size="md" />
      </div>
    );
  if (error) return <div>Erro: {error}</div>;
  if (!user) return <div>Não foi possível carregar os dados do usuário.</div>;

  return <AccountPage user={user} />;
}
