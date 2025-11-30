import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { InputField } from "~/components/ui/InputField";
import type { Doacao } from "~/interfaces/doacao";

interface CreateModalProps {
  onCreate: (newDoacao: Omit<Doacao, 'id_doacao'>) => Promise<void>;
  onCancel: () => void;
  isDisabled?: boolean;
}

export const CreateModal = ({
  onCancel,
  onCreate,
  isDisabled,
}: CreateModalProps) => {
  const [formData, setFormData] = useState<Omit<Doacao, 'id_doacao'>>({
    id_parceiro: null,
    tipo: "monetaria",
    valor: 0,
    descricao: "",
    data_recebimento: new Date().toISOString(),
    comprovante_url: null,
    is_anonima: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ?
      (e.target as HTMLInputElement).checked :
      type === "number" ? Number(value) :
        value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(formData);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          labelBlack
          name="id_parceiro"
          label="ID do Parceiro"
          value={formData.id_parceiro || ''}
          onChange={handleInputChange}
        />
        <div>
          <label className="block text-sm font-medium text-gray-700">Tipo</label>
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleInputChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="monetaria">Monetária</option>
            <option value="material">Material</option>
          </select>
        </div>
        <InputField
          labelBlack
          name="valor"
          label="Valor"
          type="number"
          value={formData.valor || ''}
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
          value={formData.data_recebimento.split('T')[0]}
          onChange={handleInputChange}
        />
        <InputField
          labelBlack
          name="comprovante_url"
          label="URL do Comprovante"
          value={formData.comprovante_url || ''}
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

      <div className="flex justify-end mt-6 gap-2">
        <Button
          disabled={isDisabled}
          variant="secondary"
          text="Cancelar"
          onClick={onCancel}
        />
        <Button disabled={isDisabled} type="submit" text="Criar Doação" />
      </div>
    </form>
  );
};
