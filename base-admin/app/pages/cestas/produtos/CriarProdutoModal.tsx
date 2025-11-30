import { useState } from "react";
import { createProduto } from "~/api/produto/createProduto";
import { Button } from "~/components/ui/Button";
import { InputField } from "~/components/ui/InputField";
import { useToast } from "~/contexts/ToastContext";

interface CriarProdutoModalProps {
  onClose: () => void;
  fetchProdutos: () => Promise<void>;
}

export const CriarProdutoModal: React.FC<CriarProdutoModalProps> = ({
  fetchProdutos,
  onClose,
}) => {
  const { showToast } = useToast();

  // Formulário de criação de produto
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: "",
    descricao: "",
    is_basico: false,
    unidade_medida: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type, checked } = target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCreateProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createProduto(formData);

      onClose();
      setFormData({
        nome: "",
        descricao: "",
        is_basico: false,
        unidade_medida: "",
      });
      fetchProdutos();
      showToast("success", "Produto criado com sucesso.");
    } catch (error) {
      showToast(
        "danger",
        error instanceof Error ? error.message : "Erro ao criar produto."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleCreateProduto}>
      <InputField
        label="Nome"
        name="nome"
        required
        value={formData.nome}
        onChange={handleInputChange}
      />
      <InputField
        label="Descrição"
        name="descricao"
        required
        value={formData.descricao}
        onChange={handleInputChange}
      />
      <InputField
        label="Unidade de Medida"
        name="unidade_medida"
        required
        value={formData.unidade_medida}
        onChange={handleInputChange}
      />

      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_basico"
          checked={formData.is_basico}
          onChange={handleInputChange}
        />
        Produto básico
      </label>
      <div className="flex justify-end gap-2 pt-4">
        <Button
          text="Cancelar"
          variant="secondary"
          onClick={() => onClose()}
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
