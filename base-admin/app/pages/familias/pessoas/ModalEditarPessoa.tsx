import { useState, useEffect } from "react";
import { updatePessoa } from "~/api/pessoa/updatePessoa";
import { Button } from "~/components/ui/Button";
import { InputField } from "~/components/ui/InputField";
import { useToast } from "~/contexts/ToastContext";
import type { Pessoa, UpdatePessoaPayload } from "~/interfaces/pessoa";

interface ModalEditarPessoaProps {
  pessoa: Pessoa;
  setModalOpen: (isOpen: boolean) => void;
  fetchPessoas: () => Promise<void>;
}

export const ModalEditarPessoa: React.FC<ModalEditarPessoaProps> = ({
  pessoa,
  setModalOpen,
  fetchPessoas,
}) => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<UpdatePessoaPayload>({
    nome: "",
    data_nascimento: "",
    cpf: "",
    rg: "",
    observacoes: "",
    ehCrianca: false,
  });

  useEffect(() => {
    if (pessoa) {
      console.log("Initializing form data with:", pessoa);

      setFormData({
        nome: pessoa.nome || "",
        data_nascimento: pessoa.data_nascimento
          ? new Date(pessoa.data_nascimento).toISOString().split("T")[0]
          : "",
        cpf: pessoa.cpf || "",
        rg: pessoa.rg || "",
        observacoes: pessoa.observacoes || "",
        ehCrianca: pessoa.ehCrianca || false,
      });
    }
  }, [pessoa]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleUpdatePessoa = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updatePessoa(pessoa.id_pessoa, formData);
      setModalOpen(false);
      fetchPessoas();
      showToast("success", "Pessoa atualizada com sucesso.");
    } catch (error) {
      showToast(
        "danger",
        error instanceof Error ? error.message : "Erro ao atualizar."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleUpdatePessoa}>
      <InputField
        label="Nome"
        name="nome"
        value={formData.nome}
        onChange={handleInputChange}
      />
      <InputField
        label="Data de Nascimento"
        name="data_nascimento"
        type="date"
        value={formData.data_nascimento}
        onChange={handleInputChange}
      />
      <InputField
        label="CPF"
        name="cpf"
        value={formData.cpf}
        onChange={handleInputChange}
      />
      <InputField
        label="RG"
        name="rg"
        value={formData.rg}
        onChange={handleInputChange}
      />
      <InputField
        label="Observações"
        name="observacoes"
        value={formData.observacoes}
        onChange={handleInputChange}
      />

      <div className="flex justify-between gap-2 pt-4">
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="ehCrianca"
              checked={formData.ehCrianca}
              onChange={handleInputChange}
            />
            <span className="text-sm font-medium text-gray-900 dark:text-white">
              É Criança
            </span>
          </label>
        </div>

        <div>
          <Button
            text="Cancelar"
            variant="secondary"
            onClick={() => setModalOpen(false)}
            type="button"
            disabled={isSubmitting}
          />
          <Button
            text="Salvar"
            variant="primary"
            type="submit"
            disabled={isSubmitting}
          />
        </div>
      </div>
    </form>
  );
};
