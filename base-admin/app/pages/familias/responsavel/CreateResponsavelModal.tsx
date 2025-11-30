import { useEffect, useState } from "react";
import { createResponsavel } from "~/api/responsavel/createResponsavel";
import { Button } from "~/components/ui/Button";
import { InputField } from "~/components/ui/InputField";
import { useToast } from "~/contexts/ToastContext";
import type { CreateResponsavelDto } from "~/interfaces/responsavel";
import { getAllFamilias } from "~/api/familias/getAllFamilias";
import type { Familia } from "~/interfaces/familias";

interface ModalCriarResponsavelProps {
  setModalOpen: (isOpen: boolean) => void;
  fetchResponsaveis: () => Promise<void>;
}

export const ModalCriarResponsavel: React.FC<ModalCriarResponsavelProps> = ({
  setModalOpen,
  fetchResponsaveis,
}) => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [familias, setFamilias] = useState<Familia[]>([]);
  const [isLoadingFamilias, setIsLoadingFamilias] = useState(true);
  const [formData, setFormData] = useState<CreateResponsavelDto>({
    nome: "",
    cpf: "",
    rg: "",
    data_nascimento: "",
    telefone: "",
    endereco: "",
    id_familia: undefined, // Adicionado para controlar o select
  });

  useEffect(() => {
    async function fetchFamiliasDisponiveis() {
      setIsLoadingFamilias(true);
      try {
        const data: Familia[] = await getAllFamilias();
        // Filtra para mostrar apenas famílias que ainda não têm um responsável
        const disponiveis = data.filter((f) => f.id_responsavel === null);
        setFamilias(disponiveis);
      } catch (error) {
        showToast("danger", "Erro ao carregar famílias disponíveis.");
      } finally {
        setIsLoadingFamilias(false);
      }
    }
    fetchFamiliasDisponiveis();
  }, [showToast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const body = {
        ...formData,
        id_familia: formData.id_familia ? Number(formData.id_familia) : null,
        data_nascimento: new Date(formData.data_nascimento).toISOString(),
      };
      await createResponsavel(body);
      setModalOpen(false);
      fetchResponsaveis();
      showToast("success", "Responsável criado e vinculado com sucesso.");
    } catch (error) {
      showToast(
        "danger",
        error instanceof Error ? error.message : "Erro ao criar responsável."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleCreate}>
      {/* Campo Select para Família */}
      <div>
        <label
          htmlFor="id_familia"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Família a ser Vinculada
        </label>
        <select
          id="id_familia"
          name="id_familia"
          value={formData.id_familia || ""}
          onChange={handleInputChange}
          required
          disabled={isLoadingFamilias}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white">
          <option value="">
            {isLoadingFamilias ? "Carregando..." : "Selecione uma família"}
          </option>
          {familias.map((familia) => (
            <option key={familia.id_familia} value={familia.id_familia}>
              {familia.nome}
            </option>
          ))}
        </select>
      </div>

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
        label="Endereço"
        name="endereco"
        value={formData.endereco}
        onChange={handleInputChange}
        required
      />
      <InputField
        label="Email (Opcional)"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleInputChange}
      />
      <InputField
        label="Ocupação (Opcional)"
        name="ocupacao"
        value={formData.ocupacao}
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
