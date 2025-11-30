import { useState, useEffect } from "react";
import { Button } from "~/components/ui/Button";
import { InputField } from "~/components/ui/InputField";
import { useToast } from "~/contexts/ToastContext";
import { updateAtividade } from "~/api/atividades/updateAtividade";
import { TipoAtividade, tipoAtividadeLabels } from "~/enums/atividades";
import type { Atividade, UpdateAtividadePayload } from "~/interfaces/atividade";

interface ModalEditarAtividadeProps {
  atividade: Atividade;
  setModalOpen: (isOpen: boolean) => void;
  fetchAtividades: () => Promise<void>;
}

export const ModalEditarAtividade: React.FC<ModalEditarAtividadeProps> = ({
  atividade,
  setModalOpen,
  fetchAtividades,
}) => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<UpdateAtividadePayload>({});

  useEffect(() => {
    if (atividade) {
      setFormData({
        nome: atividade.nome || "",
        descricao: atividade.descricao || "",
        tipo: atividade.tipo || "",
        publico_alvo: atividade.publico_alvo || "",
        dias_semana: atividade.dias_semana || "",
        horario_inicio: atividade.horario_inicio
          ? new Date(atividade.horario_inicio).toISOString().substring(0, 16)
          : "",
        horario_fim: atividade.horario_fim
          ? new Date(atividade.horario_fim).toISOString().substring(0, 16)
          : "",
      });
    }
  }, [atividade]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await updateAtividade(atividade.id_atividade, formData);
      setModalOpen(false);
      fetchAtividades();
      showToast("success", "Atividade atualizada com sucesso.");
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
        label="Nome da Atividade"
        name="nome"
        value={formData.nome}
        onChange={handleInputChange}
      />
      <InputField
        label="Descrição"
        name="descricao"
        value={formData.descricao}
        onChange={handleInputChange}
      />
      <div>
        <label
          htmlFor="tipo"
          className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          Tipo
        </label>
        <select
          id="tipo"
          name="tipo"
          value={formData.tipo}
          onChange={handleInputChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          {Object.values(TipoAtividade).map((tipo) => (
            <option key={tipo} value={tipo}>
              {tipoAtividadeLabels[tipo]}
            </option>
          ))}
        </select>
      </div>
      <InputField
        label="Público Alvo"
        name="publico_alvo"
        value={formData.publico_alvo}
        onChange={handleInputChange}
      />
      <InputField
        label="Dias da Semana (separados por vírgula)"
        name="dias_semana"
        value={formData.dias_semana}
        onChange={handleInputChange}
      />
      <InputField
        label="Horário de Início"
        name="horario_inicio"
        type="datetime-local"
        value={formData.horario_inicio}
        onChange={handleInputChange}
      />
      <InputField
        label="Horário de Fim"
        name="horario_fim"
        type="datetime-local"
        value={formData.horario_fim}
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
