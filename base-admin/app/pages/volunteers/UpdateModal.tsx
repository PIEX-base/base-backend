import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { InputField } from "~/components/ui/InputField";
import type { Voluntario } from "~/interfaces/volunteers";

interface UpdateModalProps {
  volunteer: Voluntario;
  onSave: (updatedVolunteer: Partial<Voluntario>) => Promise<void>;
  onDelete: (volunteerId: string) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const UpdateModal = ({
  volunteer,
  onSave,
  onDelete,
  onCancel,
  isSubmitting,
}: UpdateModalProps) => {
  const [formData, setFormData] = useState<Partial<Voluntario>>({
    nome: volunteer.nome,
    email: volunteer.email,
    telefone: volunteer.telefone,
    endereco: volunteer.endereco,
    disponibilidade: volunteer.disponibilidade,
    area_atuacao: volunteer.area_atuacao,
    tem_antecedentes: volunteer.tem_antecedentes,
    aceitou_termos: volunteer.aceitou_termos,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja remover este voluntário?")) {
      onDelete(volunteer.id_voluntario);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSave}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField
          labelBlack
          name="nome"
          label="Nome"
          value={formData.nome}
          onChange={handleInputChange}
        />
        <InputField
          labelBlack
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <InputField
          labelBlack
          name="telefone"
          label="Telefone"
          value={formData.telefone}
          onChange={handleInputChange}
        />
        <InputField
          labelBlack
          name="endereco"
          label="Endereço"
          value={formData.endereco}
          onChange={handleInputChange}
        />
        <InputField
          labelBlack
          name="disponibilidade"
          label="Disponibilidade"
          value={formData.disponibilidade}
          onChange={handleInputChange}
        />
        <InputField
          labelBlack
          name="area_atuacao"
          label="Área de Atuação"
          value={formData.area_atuacao}
          onChange={handleInputChange}
        />
      </div>

      <div className="flex items-center gap-4 pt-2">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="aceitou_termos"
            checked={formData.aceitou_termos}
            onChange={handleInputChange}
          />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Aceitou os Termos
          </span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="tem_antecedentes"
            checked={formData.tem_antecedentes}
            onChange={handleInputChange}
          />
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            Possui Antecedentes
          </span>
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
