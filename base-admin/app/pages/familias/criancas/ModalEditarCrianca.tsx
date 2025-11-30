import { useEffect, useState } from "react";
import { Button } from "~/components/ui/Button";
import { InputField } from "~/components/ui/InputField";
import { useToast } from "~/contexts/ToastContext";
import type { Crianca, CriancaUpdatePayload } from "~/interfaces/crianca";
import { updateCrianca } from "~/api/crianca/updateCrianca";

interface ModalEditarCriancaProps {
  crianca: Crianca | null;
  setModalOpen: (isOpen: boolean) => void;
  fetchPessoas: () => Promise<void>;
}

export const ModalEditarCrianca: React.FC<ModalEditarCriancaProps> = ({
  crianca,
  setModalOpen,
  fetchPessoas,
}) => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<CriancaUpdatePayload>({});

  useEffect(() => {
    if (crianca) {
      setFormData({
        nome: crianca.nome,
        data_nascimento: crianca.data_nascimento.split("T")[0], // Formato YYYY-MM-DD para o input
        rg: crianca.rg || "",
        cpf: crianca.cpf || "",
        observacoes: crianca.observacoes || "",
        matriculada_escola: crianca.matriculada_escola,
        nome_escola: crianca.nome_escola || "",
      });
    }
  }, [crianca]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!crianca) return;
    setIsSubmitting(true);
    try {
      const payload: CriancaUpdatePayload = {
        ...formData,
        nome_escola: formData.matriculada_escola ? formData.nome_escola : null,
      };

      await updateCrianca(crianca.id_crianca, payload);
      setModalOpen(false);
      fetchPessoas();
      showToast("success", "Dados da criança atualizados com sucesso.");
    } catch (error) {
      showToast(
        "danger",
        error instanceof Error ? error.message : "Erro ao atualizar."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!crianca) return null;

  return (
    <form className="space-y-4" onSubmit={handleUpdate}>
      <InputField
        label="Nome"
        name="nome"
        value={formData.nome}
        onChange={handleInputChange}
        required
      />
      <InputField
        label="Data de Nascimento"
        name="data_nascimento"
        type="date"
        value={formData.data_nascimento}
        onChange={handleInputChange}
        required
      />

      <div className="flex items-center gap-x-3 p-2 border rounded-md">
        <input
          id="matriculada_escola"
          name="matriculada_escola"
          type="checkbox"
          checked={formData.matriculada_escola}
          onChange={handleCheckboxChange}
          className="h-4 w-4 rounded"
        />
        <label htmlFor="matriculada_escola">
          Está matriculada em uma escola?
        </label>
      </div>

      {formData.matriculada_escola && (
        <InputField
          label="Nome da Escola"
          name="nome_escola"
          value={formData.nome_escola || ""}
          onChange={handleInputChange}
          required={formData.matriculada_escola}
        />
      )}

      <InputField
        label="RG"
        name="rg"
        value={formData.rg}
        onChange={handleInputChange}
      />
      <InputField
        label="CPF"
        name="cpf"
        value={formData.cpf}
        onChange={handleInputChange}
      />
      <InputField
        label="Observações"
        name="observacoes"
        value={formData.observacoes}
        onChange={handleInputChange}
      />

      <div className="flex justify-end gap-2 pt-4">
        <Button
          text="Cancelar"
          variant="secondary"
          onClick={() => setModalOpen(false)}
          type="button"
          disabled={isSubmitting}
        />
        <Button
          text="Salvar Alterações"
          variant="primary"
          type="submit"
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
};
