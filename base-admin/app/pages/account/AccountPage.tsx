import { useState } from "react";
import { updateUser } from "~/api/users/updateUser";
import { Button } from "~/components/ui/Button";
import { InputField } from "~/components/ui/InputField";
import { Spinner } from "~/components/ui/Spinner";
import { useToast } from "~/contexts/ToastContext";
import type { User } from "~/interfaces/user";
import { getCookie } from "~/utils/cookies";

export const AccountPage = ({ user }: { user: User }) => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    nome: user.nome,
    email: user.email,
    senha_atual: "",
    nova_senha: "",
    confirmar_senha: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form data before submission:", formData);

    const { nome, email, senha_atual, nova_senha, confirmar_senha } = formData;

    if (nova_senha || confirmar_senha) {
      if (!senha_atual) {
        showToast(
          "warning",
          "Por favor, insira sua senha atual para alterá-la."
        );
        return;
      }
      if (nova_senha !== confirmar_senha) {
        showToast("danger", "As novas senhas não coincidem.");
        return;
      }
    }

    setIsSubmitting(true);
    try {
      const authToken = getCookie("authToken");
      if (!authToken) {
        showToast("danger", "Usuário não autenticado.");
        return;
      }

      const payload: any = {
        nome,
        email,
      };

      if (nova_senha) {
        payload.senha_atual = senha_atual;
        payload.senha = nova_senha;
      }

      await updateUser(user.id_usuario, payload);

      showToast("success", "Perfil atualizado com sucesso!");
      setFormData((prev) => ({
        ...prev,
        senha_atual: "",
        nova_senha: "",
        confirmar_senha: "",
      }));
    } catch (error) {
      showToast(
        "danger",
        error instanceof Error ? error.message : "Erro ao atualizar o perfil."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Minha Conta</h1>

      <form
        onSubmit={handleSubmit}
        className="w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700">
        {/* Seção de Informações do Perfil */}
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Informações do Perfil
        </h5>
        <p className="mb-4 font-normal text-gray-700 dark:text-gray-400">
          Atualize suas informações pessoais e de contato.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputField
            label="Nome Completo"
            id="nome"
            name="nome"
            value={formData.nome}
            onChange={handleInputChange}
            required
          />

          <InputField
            label="Email"
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <InputField
            label="Perfil de Usuário"
            id="perfil"
            value={user.perfil}
            readOnly
          />

          <InputField
            label="Data de Cadastro"
            id="data_cadastro"
            value={new Date(user.data_cadastro).toLocaleDateString("pt-BR")}
            readOnly
          />
        </div>

        {/* Divisor */}
        <hr className="my-6 border-gray-200 dark:border-gray-700" />

        {/* Seção de Alteração de Senha */}
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          Alterar Senha
        </h5>

        <p className="mb-4 font-normal text-gray-700 dark:text-gray-400">
          Deixe em branco para manter a senha atual.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InputField
            label="Senha Atual"
            id="senha_atual"
            name="senha_atual"
            type="password"
            value={formData.senha_atual}
            onChange={handleInputChange}
          />

          <InputField
            label="Nova Senha"
            id="nova_senha"
            name="nova_senha"
            type="password"
            value={formData.nova_senha}
            onChange={handleInputChange}
          />

          <InputField
            label="Confirmar Nova Senha"
            id="confirmar_senha"
            name="confirmar_senha"
            type="password"
            value={formData.confirmar_senha}
            onChange={handleInputChange}
          />
        </div>

        {/* Botão de envio */}
        <div className="flex justify-end pt-6">
          <Button
            type="submit"
            text={isSubmitting ? <Spinner size="sm" /> : "Salvar Alterações"}
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};
