import { useState, useEffect } from "react";
import { Button } from "~/components/ui/Button";
import { InputField } from "~/components/ui/InputField";
import { useToast } from "~/contexts/ToastContext";
import { updateResponsavel } from "~/api/responsavel/updateResponsavel";
import type {
  Responsavel,
  UpdateResponsavelDto,
} from "~/interfaces/responsavel";

interface ModalEditarProps {
  responsavel: Responsavel;
  setModalOpen: (isOpen: boolean) => void;
  fetchResponsaveis: () => Promise<void>;
}

export const ModalEditarResponsavel: React.FC<ModalEditarProps> = ({
  responsavel,
  setModalOpen,
  fetchResponsaveis,
}) => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<UpdateResponsavelDto>({});

  useEffect(() => {
    if (responsavel) {
      setFormData({
        nome: responsavel.nome || "",
        cpf: responsavel.cpf || "",
        rg: responsavel.rg || "",
        data_nascimento: responsavel.data_nascimento
          ? new Date(responsavel.data_nascimento).toISOString().split("T")[0]
          : "",
        telefone: responsavel.telefone || "",
        email: responsavel.email || "",
        ocupacao: responsavel.ocupacao || "",
        endereco: responsavel.endereco || "",
        foto_url: responsavel.foto_url || "",
      });
    }
  }, [responsavel]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Enviar data_nascimento como ISO se preenchida
      const payload = {
        ...formData,
        data_nascimento: formData.data_nascimento
          ? new Date(formData.data_nascimento).toISOString()
          : undefined,
      };
      await updateResponsavel(responsavel.id_responsavel, payload);
      setModalOpen(false);
      fetchResponsaveis();
      showToast("success", "Responsável atualizado com sucesso.");
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
    <form className="space-y-4" onSubmit={handleUpdate}>
      <InputField
        label="Nome Completo"
        name="nome"
        value={formData.nome}
        onChange={handleInputChange}
        required
      />
      <InputField
        label="CPF"
        name="cpf"
        maxLength={11}
        value={formData.cpf}
        onChange={handleInputChange}
        required
      />
      <InputField
        label="RG"
        name="rg"
        value={formData.rg}
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
      <InputField
        label="Telefone"
        name="telefone"
        value={formData.telefone}
        onChange={handleInputChange}
        required
      />
      <InputField
        label="E-mail"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
      />
      <InputField
        label="Ocupação"
        name="ocupacao"
        value={formData.ocupacao}
        onChange={handleInputChange}
      />
      <InputField
        label="Endereço"
        name="endereco"
        value={formData.endereco}
        onChange={handleInputChange}
        required
      />
      <InputField
        label="Foto (URL)"
        name="foto_url"
        value={formData.foto_url}
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
