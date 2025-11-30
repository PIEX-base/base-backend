import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { InputField } from "~/components/ui/InputField";
import { useToast } from "~/contexts/ToastContext";
import type { CreateAtividadePayload } from "~/interfaces/atividade";
import { TipoAtividade, tipoAtividadeLabels } from "~/enums/atividades";
import { createAtividade } from "~/api/atividades/createAtividade";

interface ModalCriarAtividadeProps {
  setModalOpen: (isOpen: boolean) => void;
  fetchAtividades: () => Promise<void>;
}

const diasDaSemana = [
  { id: "1", label: "Seg" },
  { id: "2", label: "Ter" },
  { id: "3", label: "Qua" },
  { id: "4", label: "Qui" },
  { id: "5", label: "Sex" },
  { id: "6", label: "Sáb" },
  { id: "0", label: "Dom" },
];

export const ModalCriarAtividade: React.FC<ModalCriarAtividadeProps> = ({
  setModalOpen,
  fetchAtividades,
}) => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDias, setSelectedDias] = useState<string[]>([]);
  const [formData, setFormData] = useState<
    Omit<CreateAtividadePayload, "dias_semana">
  >({
    nome: "",
    descricao: "",
    tipo: TipoAtividade.AULA_REFORCO,
    publico_alvo: "Crianças",
    horario_inicio: "",
    horario_fim: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDiaChange = (diaId: string) => {
    setSelectedDias((prev) =>
      prev.includes(diaId) ? prev.filter((d) => d !== diaId) : [...prev, diaId]
    );
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDias.length === 0) {
      showToast("warning", "Selecione pelo menos um dia da semana.");
      return;
    }
    setIsSubmitting(true);
    try {
      const payload: CreateAtividadePayload = {
        ...formData,
        dias_semana: selectedDias.join(","),
      };

      console.log("Payload to create activity:", payload);

      await createAtividade(payload);
      setModalOpen(false);
      fetchAtividades();
      showToast("success", "Atividade criada com sucesso.");
    } catch (error) {
      showToast(
        "danger",
        error instanceof Error ? error.message : "Erro ao criar."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleCreate}>
      <InputField
        label="Nome da Atividade"
        name="nome"
        value={formData.nome}
        onChange={handleInputChange}
        required
      />

      <div>
        <label htmlFor="descricao">Descrição</label>
        <textarea
          id="descricao"
          name="descricao"
          rows={3}
          value={formData.descricao}
          onChange={handleInputChange}
          className="mt-1 p-2.5 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-600 dark:text-white"
          required
        />
      </div>

      <div>
        <label htmlFor="tipo">Tipo de Atividade</label>
        <select
          id="tipo"
          name="tipo"
          value={formData.tipo}
          onChange={handleInputChange}
          className="mt-1 p-2.5 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-600 dark:text-white">
          {Object.entries(tipoAtividadeLabels).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>

      <InputField
        label="Público Alvo"
        name="publico_alvo"
        value={formData.publico_alvo}
        onChange={handleInputChange}
        required
      />

      <div>
        <label>Dias da Semana</label>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {diasDaSemana.map((dia) => (
            <div key={dia.id} className="flex items-center">
              <input
                id={`dia-${dia.id}`}
                type="checkbox"
                checked={selectedDias.includes(dia.id)}
                onChange={() => handleDiaChange(dia.id)}
                className="h-4 w-4 rounded"
              />
              <label htmlFor={`dia-${dia.id}`} className="ml-2 text-sm">
                {dia.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <InputField
          label="Horário de Início"
          name="horario_inicio"
          type="time"
          value={formData.horario_inicio}
          onChange={handleInputChange}
          required
        />
        <InputField
          label="Horário de Fim"
          name="horario_fim"
          type="time"
          value={formData.horario_fim}
          onChange={handleInputChange}
          required
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button
          text="Cancelar"
          variant="secondary"
          onClick={() => setModalOpen(false)}
          type="button"
          disabled={isSubmitting}
        />
        <Button
          text="Criar Atividade"
          variant="primary"
          type="submit"
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
};
