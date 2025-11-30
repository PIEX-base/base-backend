import { useState, useEffect } from "react";
import { createFamilia } from "~/api/familias/createFamilia";
import { getAllResponsaveis } from "~/api/responsavel/getAllResponsaveis";
import { Button } from "~/components/ui/Button";
import { InputField } from "~/components/ui/InputField";
import { useToast } from "~/contexts/ToastContext";
import type { Responsavel } from "~/interfaces/responsavel";

interface ModalCriarFamiliaProps {
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fetchFamilias: () => Promise<void>;
}

export const ModalCriarFamilia: React.FC<ModalCriarFamiliaProps> = ({
  isSubmitting,
  setIsSubmitting,
  setModalOpen,
  fetchFamilias,
}) => {
  const { showToast } = useToast();
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([]);
  const [isLoadingResponsaveis, setIsLoadingResponsaveis] = useState(true);

  const [formData, setFormData] = useState({
    nome: "",
    numero_dependentes: "",
    id_responsavel: "",
    observacoes: "",
  });

  // Efeito para buscar os responsáveis quando o modal for aberto
  useEffect(() => {
    async function fetchResponsaveisDisponiveis() {
      setIsLoadingResponsaveis(true);
      try {
        const data: Responsavel[] = await getAllResponsaveis();
        // Filtra para mostrar apenas responsáveis que não estão vinculados a nenhuma família
        const disponiveis = data.filter((r) => r.familia === null);
        setResponsaveis(disponiveis);
      } catch (error) {
        showToast("danger", "Erro ao carregar responsáveis disponíveis.");
      } finally {
        setIsLoadingResponsaveis(false);
      }
    }
    fetchResponsaveisDisponiveis();
  }, [showToast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreateFamilia = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const body = {
        nome: formData.nome,
        numero_dependentes: Number(formData.numero_dependentes),
        ...(formData.id_responsavel && {
          id_responsavel: Number(formData.id_responsavel), // O backend converterá para BigInt
        }),
        ...(formData.observacoes && { observacoes: formData.observacoes }),
      };

      await createFamilia(body);

      setModalOpen(false);
      fetchFamilias();
      showToast("success", "Família criada com sucesso.");
    } catch (error) {
      showToast(
        "danger",
        error instanceof Error ? error.message : "Erro ao criar família."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleCreateFamilia}>
      <InputField
        label="Nome da Família"
        id="nome"
        name="nome"
        required
        value={formData.nome}
        onChange={handleInputChange}
      />
      <InputField
        label="Número de Dependentes"
        id="numero_dependentes"
        name="numero_dependentes"
        type="number"
        required
        min="0"
        value={formData.numero_dependentes}
        onChange={handleInputChange}
      />

      {/* Campo de Input foi substituído por um Select */}
      <div>
        <label
          htmlFor="id_responsavel"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
          Responsável (Opcional)
        </label>
        <select
          id="id_responsavel"
          name="id_responsavel"
          value={formData.id_responsavel}
          onChange={handleInputChange}
          disabled={isLoadingResponsaveis}
          className="p-2.5 mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-600 dark:text-white">
          <option value="">
            {isLoadingResponsaveis
              ? "Carregando..."
              : "Selecione um responsável"}
          </option>
          {responsaveis.map((resp) => (
            <option key={resp.id_responsavel} value={resp.id_responsavel}>
              {resp.nome} (CPF: {resp.cpf})
            </option>
          ))}
        </select>
      </div>

      <InputField
        label="Observações"
        id="observacoes"
        name="observacoes"
        type="text"
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
          text="Criar"
          variant="primary"
          type="submit"
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
};
