import { useEffect, useState } from "react";
import { getAllFamilias } from "~/api/familias/getAllFamilias";
import { createCrianca } from "~/api/crianca/createCrianca";
import { Button } from "~/components/ui/Button";
import { InputField } from "~/components/ui/InputField";
import { useToast } from "~/contexts/ToastContext";
import type { Familia } from "~/interfaces/familias";
import type { CriancaCreatePayload } from "~/interfaces/crianca";

interface ModalCriarCriancaProps {
  isSubmitting: boolean;
  setIsSubmitting: React.Dispatch<React.SetStateAction<boolean>>;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fetchPessoas: () => Promise<void>;
}

export const ModalCriarCrianca: React.FC<ModalCriarCriancaProps> = ({
  isSubmitting,
  setIsSubmitting,
  setModalOpen,
  fetchPessoas,
}) => {
  const { showToast } = useToast();

  const [familias, setFamilias] = useState<Familia[]>([]);
  const [formData, setFormData] = useState<CriancaCreatePayload>({
    id_familia: "",
    nome: "",
    data_nascimento: "",
    rg: "",
    cpf: "",
    foto_url: "",
    observacoes: "",
    matriculada_escola: false,
    nome_escola: "",
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

  // Handler específico para o checkbox
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,

      ...(name === "matriculada_escola" && !checked && { nome_escola: "" }),
    }));
  };

  const handleCreateCrianca = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // O backend espera um valor nulo se o nome da escola estiver vazio
      const payload = {
        ...formData,
        nome_escola: formData.nome_escola || null,
      };

      console.log(payload);

      await createCrianca(payload);
      setModalOpen(false);
      fetchPessoas();
      showToast("success", "Criança criada com sucesso.");
    } catch (error) {
      showToast(
        "danger",
        error instanceof Error ? error.message : "Erro ao criar criança."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleCreateCrianca}>
      {/* Campos existentes */}
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

      {/* Novos campos adicionados aqui */}
      <div className="flex items-center gap-x-3 p-2 border rounded-md">
        <input
          id="matriculada_escola"
          name="matriculada_escola"
          type="checkbox"
          checked={formData.matriculada_escola}
          onChange={handleCheckboxChange}
          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
        />
        <label
          htmlFor="matriculada_escola"
          className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
          Está matriculada em uma escola?
        </label>
      </div>

      {/* Campo 'nome_escola' aparece condicionalmente */}
      {formData.matriculada_escola && (
        <InputField
          label="Nome da Escola"
          id="nome_escola"
          name="nome_escola"
          required={formData.matriculada_escola} // Obrigatório se matriculada
          value={formData.nome_escola || ""}
          onChange={handleInputChange}
          placeholder="Digite o nome da escola"
        />
      )}

      {/* Restante dos campos */}
      <InputField
        label="RG (Opcional)"
        id="rg"
        name="rg"
        value={formData.rg}
        onChange={handleInputChange}
      />
      <InputField
        label="CPF (Opcional)"
        id="cpf"
        name="cpf"
        maxLength={11}
        value={formData.cpf}
        onChange={handleInputChange}
      />
      <InputField
        label="Foto (URL, Opcional)"
        id="foto_url"
        name="foto_url"
        value={formData.foto_url}
        onChange={handleInputChange}
      />
      <InputField
        label="Observações (Opcional)"
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
