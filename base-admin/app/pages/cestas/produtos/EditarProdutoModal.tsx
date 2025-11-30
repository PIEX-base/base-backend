import { useState } from "react";
import { updateProduto } from "~/api/produto/updateProduto";
import { deleteProduto } from "~/api/produto/deleteProduto";
import { Button } from "~/components/ui/Button";
import { InputField } from "~/components/ui/InputField";
import { useToast } from "~/contexts/ToastContext";
import type { Produto } from "~/interfaces/produto";

interface EditarProdutoModalProps {
  produto: Produto;
  onClose: () => void;
  fetchProdutos: () => Promise<void>;
}

export const EditarProdutoModal: React.FC<EditarProdutoModalProps> = ({
  produto,
  fetchProdutos,
  onClose,
}) => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    nome: produto.nome,
    descricao: produto.descricao,
    is_basico: produto.is_basico,
    unidade_medida: produto.unidade_medida,
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

  const handleUpdateProduto = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateProduto(produto.id_produto, formData);

      onClose();
      fetchProdutos();
      showToast("success", "Produto atualizado com sucesso.");
    } catch (error) {
      showToast(
        "danger",
        error instanceof Error ? error.message : "Erro ao atualizar produto."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduto = async () => {
    const confirm = window.confirm(
      "Tem certeza que deseja deletar este produto?"
    );

    if (!confirm) return;

    await deleteProduto(produto.id_produto)
      .then(() => {
        showToast("success", "Produto deletado com sucesso.");
        fetchProdutos();
        onClose();
      })
      .catch((error) => {
        showToast(
          "danger",
          error instanceof Error ? error.message : "Erro ao deletar produto."
        );
      });
  };

  return (
    <form className="space-y-4" onSubmit={handleUpdateProduto}>
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
        value={formData.descricao}
        onChange={handleInputChange}
      />
      <InputField
        label="Unidade de Medida"
        name="unidade_medida"
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

      <div className="flex justify-between gap-2 pt-4">
        <Button
          text="Deletar"
          variant="danger"
          onClick={handleDeleteProduto}
          type="button"
          disabled={isSubmitting}
        />

        <div className="flex gap-2">
          <Button
            text="Cancelar"
            variant="secondary"
            onClick={() => onClose()}
            type="button"
            disabled={isSubmitting}
          />

          <Button
            text="Atualizar"
            variant="primary"
            type="submit"
            disabled={isSubmitting}
          />
        </div>
      </div>
    </form>
  );
};
