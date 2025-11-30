import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { InputField } from "~/components/ui/InputField";
import type {
  CreateVolunteerPayload,
  Voluntario,
} from "~/interfaces/volunteers";

interface CreateModalProps {
  onCreate: (newVolunteer: CreateVolunteerPayload) => Promise<void>;
  onCancel: () => void;
  isDisabled?: boolean;
}

export const CreateModal = ({
  onCancel,
  onCreate,
  isDisabled,
}: CreateModalProps) => {
  const [formData, setFormData] = useState<CreateVolunteerPayload>({
    nome: "",
    email: "",
    telefone: "",
    cpf: "",
    rg: "",
    endereco: "",
    disponibilidade: "",
    area_atuacao: "",
    tem_antecedentes: false,
    url_comprovante: "",
    aceitou_termos: false,
    respondeu_questionario: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
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
          required
          labelBlack
          name="nome"
          label="Nome"
          value={formData.nome}
          onChange={handleInputChange}
        />
        <InputField
          required
          labelBlack
          name="email"
          label="Email"
          type="email"
          value={formData.email}
          onChange={handleInputChange}
        />
        <InputField
          required
          labelBlack
          name="telefone"
          label="Telefone"
          value={formData.telefone}
          onChange={handleInputChange}
        />
        <InputField
          required
          labelBlack
          name="cpf"
          label="CPF"
          value={formData.cpf}
          onChange={handleInputChange}
        />
        <InputField
          required
          labelBlack
          name="rg"
          label="RG"
          value={formData.rg}
          onChange={handleInputChange}
        />
        <InputField
          required
          labelBlack
          name="endereco"
          label="Endereço"
          value={formData.endereco}
          onChange={handleInputChange}
        />
        <InputField
          required
          labelBlack
          name="disponibilidade"
          label="Disponibilidade"
          value={formData.disponibilidade}
          onChange={handleInputChange}
        />
        <InputField
          required
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
          <span className="text-sm font-medium">Aceitou os Termos</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="tem_antecedentes"
            checked={formData.tem_antecedentes}
            onChange={handleInputChange}
          />
          <span className="text-sm font-medium">Possui Antecedentes</span>
        </label>
      </div>

      <div className="flex justify-end mt-6 gap-2">
        <Button
          disabled={isDisabled}
          variant="secondary"
          text="Cancelar"
          onClick={onCancel}
        />
        <Button disabled={isDisabled} type="submit" text="Criar Voluntário" />
      </div>
    </form>
  );
};
