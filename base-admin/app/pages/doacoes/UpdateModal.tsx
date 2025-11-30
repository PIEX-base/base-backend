import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { InputField } from "~/components/ui/InputField";
import type { Doacao } from "~/interfaces/doacao";

interface UpdateModalProps {
  doacao: Doacao;
  onSave: (updatedDoacao: Partial<Doacao>) => Promise<void>;
  onDelete: (doacaoId: string) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const UpdateModal = ({
  doacao,
  onSave,
  onDelete,
  onCancel,
  isSubmitting,
}: UpdateModalProps) => {
  const [formData, setFormData] = useState<Partial<Doacao>>({
    id_parceiro: doacao.id_parceiro,
    tipo: doacao.tipo,
    valor: doacao.valor,
    descricao: doacao.descricao,
    data_recebimento: doacao.data_recebimento,
    comprovante_url: doacao.comprovante_url,
    is_anonima: doacao.is_anonima,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setFormData((prev) => {
      return { ...prev, [name]: val };
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.valor) {
      formData.valor = Number(formData.valor);
    }

    onSave(formData);
  };

  const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja remover esta doação?")) {
      onDelete(doacao.id_doacao);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSave}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          labelBlack
          name="id_parceiro"
          label="ID do Parceiro"
          value={formData.id_parceiro || ""}
          onChange={handleInputChange}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tipo
          </label>

          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleInputChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option value="monetaria">Monetária</option>

            <option value="material">Material</option>
          </select>
        </div>

        <InputField
          labelBlack
          name="valor"
          label="Valor"
          type="number"
          value={formData.valor || ""}
          onChange={handleInputChange}
        />

        <InputField
          required
          labelBlack
          name="descricao"
          label="Descrição"
          value={formData.descricao}
          onChange={handleInputChange}
        />

        <InputField
          required
          labelBlack
          name="data_recebimento"
          label="Data de Recebimento"
          type="date"
          value={
            new Date(formData.data_recebimento!).toISOString().split("T")[0]
          }
          onChange={handleInputChange}
        />

        <InputField
          labelBlack
          name="comprovante_url"
          label="URL do Comprovante"
          value={formData.comprovante_url || ""}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex items-center gap-4 pt-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="is_anonima"
            checked={formData.is_anonima}
            onChange={handleInputChange}
          />

          <span className="text-sm font-medium">Doação Anônima</span>
        </label>
      </div>

      <div className="flex justify-end items-center pt-4 gap-2">
        <Button
          disabled={isSubmitting}
          variant="danger"
          text="Remover"
          onClick={handleDelete}
        />

        <Button
          disabled={isSubmitting}
          variant="secondary"
          text="Cancelar"
          onClick={onCancel}
        />
        <Button disabled={isSubmitting} type="submit" text="Salvar" />
      </div>
    </form>
  );
};
