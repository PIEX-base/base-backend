import { useState, useEffect } from "react";
import { updateFamilia } from "~/api/familias/updateFamilia";
import { getAllResponsaveis } from "~/api/responsavel/getAllResponsaveis";
import { Button } from "~/components/ui/Button";
import { InputField } from "~/components/ui/InputField";
import { useToast } from "~/contexts/ToastContext";
import type { Familia, UpdateFamiliaPayload } from "~/interfaces/familias";
import type { Responsavel } from "~/interfaces/responsavel";

interface ModalEditarFamiliaProps {
  familia: Familia;
  setModalOpen: (isOpen: boolean) => void;
  fetchFamilias: () => Promise<void>;
}

export const ModalEditarFamilia: React.FC<ModalEditarFamiliaProps> = ({
  familia,
  setModalOpen,
  fetchFamilias,
}) => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<UpdateFamiliaPayload>({});
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchResponsaveis() {
      try {
        setLoading(true);
        const data = await getAllResponsaveis();
        setResponsaveis(data);
      } finally {
        setLoading(false);
      }
    }
    fetchResponsaveis();
  }, []);

  useEffect(() => {
    if (familia) {
      setFormData({
        nome: familia.nome || "",
        observacoes: familia.observacoes || undefined,
        id_responsavel: Number(familia.id_responsavel) || undefined,
      });
    }
  }, [familia]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log("Updating family with data:", formData);

    const submitData = {
      ...formData,
      id_responsavel: formData.id_responsavel
        ? Number(formData.id_responsavel)
        : null,
    };

    try {
      await updateFamilia(familia.id_familia, submitData);
      setModalOpen(false);
      fetchFamilias();
      showToast("success", "Família atualizada com sucesso.");
    } catch (error) {
      console.log("Error updating family:", error);

      showToast(
        "danger",
        error instanceof Error ? error.message : "Erro ao atualizar."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleUpdate}>
      <InputField
        label="Nome da Família"
        name="nome"
        value={formData.nome}
        onChange={handleInputChange}
      />

      <div>
        <label
          htmlFor="id_responsavel"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Responsável
        </label>

        <select
          id="id_responsavel"
          name="id_responsavel"
          value={formData.id_responsavel || ""}
          onChange={handleInputChange}
          className="p-2.5 mt-1 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-500 dark:text-white">
          <option value="">Sem responsável</option>
          {responsaveis.map((resp) => (
            <option key={resp.id_responsavel} value={resp.id_responsavel}>
              {resp.nome}
            </option>
          ))}
        </select>
      </div>

      <InputField
        label="Observações"
        name="observacoes"
        value={formData.observacoes ?? ""}
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
          text="Salvar"
          variant="primary"
          type="submit"
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
};
