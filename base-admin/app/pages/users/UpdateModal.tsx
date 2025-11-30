import { useState } from "react";
import { InputField } from "~/components/ui/InputField";
import { Button } from "~/components/ui/Button";
import type { User } from "~/interfaces/user";

interface UpdateModalProps {
  user: User;
  onSave: (updatedUser: Partial<User>) => void;
  onDelete: () => Promise<void>;
  onCancel: () => void;
  isDisabled?: boolean;
}

export const UpdateModal = ({
  user,
  onSave,
  onDelete,
  onCancel,
  isDisabled,
}: UpdateModalProps) => {
  const [formData, setFormData] = useState({
    nome: user.nome,
    email: user.email,
    perfil: user.perfil,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const handleRemoveUser = async () => {
    const confirmed = window.confirm("Deseja realmente remover este usuário?");
    if (!confirmed) return;
    try {
      await onDelete();
      onCancel();
    } catch (error) {
      console.error("Erro ao remover usuário:", error);
    }
  };

  return (
    <form className="space-y-4">
      <InputField
        labelBlack
        label="Nome"
        id="nome"
        name="nome"
        value={formData.nome}
        onChange={handleChange}
      />
      <InputField
        labelBlack
        label="Email"
        id="email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
      />
      <InputField
        labelBlack
        label="Perfil"
        id="perfil"
        name="perfil"
        readOnly
        value={formData.perfil}
      />
      <div className="flex justify-end gap-2 pt-4">
        <Button
          disabled={isDisabled}
          text="Remover usuário"
          variant="danger"
          onClick={() => {
            handleRemoveUser();
          }}
        />
        <Button
          disabled={isDisabled}
          text="Cancelar"
          variant="secondary"
          onClick={onCancel}
        />
        <Button
          type="submit"
          disabled={isDisabled}
          text="Salvar"
          variant="primary"
          onClick={handleSave}
        />
      </div>
    </form>
  );
};
