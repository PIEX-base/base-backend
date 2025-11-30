import { useEffect, useState } from "react";
import { getAllFamilias } from "~/api/familias/getAllFamilias";
import {
  createPessoa,
  type PessoaCreatePayload,
} from "~/api/pessoa/createPessoa";
import { Button } from "~/components/ui/Button";
import { InputField } from "~/components/ui/InputField";
import { useToast } from "~/contexts/ToastContext";
import type { Familia } from "~/interfaces/familias";

interface ModalCriarPessoaProps {
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fetchPessoas: () => Promise<void>;
}

export const ModalCriarPessoa: React.FC<ModalCriarPessoaProps> = ({
  isSubmitting,
  setIsSubmitting,
  setModalOpen,
  fetchPessoas,
}) => {
  const { showToast } = useToast();

  const [familias, setFamilias] = useState<Familia[]>([]);
  const [formData, setFormData] = useState<PessoaCreatePayload>({
    id_familia: "",
    nome: "",
    data_nascimento: "",
    rg: "",
    cpf: "",
    foto_url: "",
    observacoes: "",
  });

  useEffect(() => {
    async function fetchFamilias() {
      try {
        const data = await getAllFamilias();
        setFamilias(data);
      } catch (error) {
        showToast(
          "danger",
          error instanceof Error ? error.message : "Erro ao buscar famílias."
        );
      }
    }
    fetchFamilias();
  }, [showToast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreatePessoa = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createPessoa(formData);
      setModalOpen(false);
      fetchPessoas();
      showToast("success", "Pessoa criada com sucesso.");
    } catch (error) {
      showToast(
        "danger",
        error instanceof Error ? error.message : "Erro ao criar pessoa."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleCreatePessoa}>
      <div>
        <label
          htmlFor="id_familia"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Família
        </label>
        <select
          id="id_familia"
          name="id_familia"
          required
          value={formData.id_familia}
          onChange={handleInputChange}
          className="mt-1 p-2.5 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-600 dark:text-white">
          <option value="">Selecione uma família</option>
          {familias.map((familia) => (
            <option key={familia.id_familia} value={familia.id_familia}>
              {familia.nome}
            </option>
          ))}
        </select>
      </div>
      <InputField
        label="Nome"
        id="nome"
        name="nome"
        required
        value={formData.nome}
        onChange={handleInputChange}
      />
      <InputField
        label="Data de Nascimento"
        id="data_nascimento"
        name="data_nascimento"
        type="date"
        required
        value={formData.data_nascimento}
        onChange={handleInputChange}
      />
      <InputField
        label="RG"
        id="rg"
        name="rg"
        value={formData.rg}
        onChange={handleInputChange}
      />
      <InputField
        label="CPF"
        id="cpf"
        name="cpf"
        maxLength={11}
        value={formData.cpf}
        onChange={handleInputChange}
      />
      <InputField
        label="Foto (URL)"
        id="foto_url"
        name="foto_url"
        value={formData.foto_url}
        onChange={handleInputChange}
      />
      <InputField
        label="Observações"
        id="observacoes"
        name="observacoes"
        value={formData.observacoes}
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
          text="Criar"
          variant="primary"
          type="submit"
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
};
