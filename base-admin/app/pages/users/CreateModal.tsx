import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { InputField } from "~/components/ui/InputField";
import type { UserCreatePayload } from "~/interfaces/user";

interface CreateModalProps {
  onCreate: (newUser: UserCreatePayload) => void;
  onCancel: () => void;
  isDisabled?: boolean;
}

export const CreateModal = ({
  onCancel,
  onCreate,
  isDisabled,
}: CreateModalProps) => {
  const [formData, setFormData] = useState<UserCreatePayload>({
    nome: "",
    email: "",
    perfil: "usuario",
    senha: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Input changed:", e.target.name, e.target.value);
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onCreate(formData);
  };

  return (
    <div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <InputField
          required
          labelBlack
          type="text"
          id="nome"
          name="nome"
          label="Nome"
          value={formData.nome}
          onChange={handleInputChange}
        />
        <InputField
          required
          labelBlack
          type="email"
          label="Email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
        />

        <InputField
          required
          labelBlack
          type="password"
          label="Senha"
          id="senha"
          name="senha"
          value={formData.senha}
          onChange={handleInputChange}
        />

        <div className="flex justify-end mt-4">
          <Button
            disabled={isDisabled}
            variant="secondary"
            text={"Cancelar"}
            onClick={onCancel}
          />
          <Button disabled={isDisabled} type="submit" text={"Criar usuário"} />
        </div>
      </form>
    </div>
  );
};
