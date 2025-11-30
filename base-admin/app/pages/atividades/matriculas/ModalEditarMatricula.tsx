import { useState, useEffect } from "react";
import { Button } from "~/components/ui/Button";
import { useToast } from "~/contexts/ToastContext";
import { updateMatricula } from "~/api/matriculas/updateMatricula";
import type { Matricula, UpdateMatriculaPayload } from "~/interfaces/matricula";
import { statusMatriculaOptions } from "~/enums/matriculas";

interface ModalEditarMatriculaProps {
  matricula: Matricula | null;
  setModalOpen: (isOpen: boolean) => void;
  fetchMatriculas: () => Promise<void>;
}

export const ModalEditarMatricula: React.FC<ModalEditarMatriculaProps> = ({
  matricula,
  setModalOpen,
  fetchMatriculas,
}) => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<UpdateMatriculaPayload>({});

  useEffect(() => {
    if (matricula) {
      setFormData({
        status: matricula.status,
        observacoes: matricula.observacoes || "",
      });
    }
  }, [matricula]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!matricula) return;
    setIsSubmitting(true);
    try {
      await updateMatricula(matricula.id_matricula, formData);
      showToast("success", "Matrícula atualizada com sucesso.");
      fetchMatriculas();
      setModalOpen(false);
    } catch (error) {
      showToast(
        "danger",
        error instanceof Error ? error.message : "Erro ao atualizar."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!matricula) return null;

  return (
    <form className="space-y-4" onSubmit={handleUpdate}>
      <div className="p-4 border rounded-md bg-gray-50 dark:bg-gray-700">
        <p className="font-medium text-gray-900 dark:text-white">
          <strong>Criança:</strong> {matricula.crianca.nome}
        </p>
        <p className="font-medium text-gray-900 dark:text-white">
          <strong>Atividade:</strong> {matricula.atividade.nome}
        </p>
      </div>
      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Status da Matrícula
        </label>
        <select
          id="status"
          name="status"
          value={formData.status}
          onChange={handleInputChange}
          className="mt-1 p-2.5 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-600 dark:text-white">
          {statusMatriculaOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="observacoes"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Observações
        </label>
        <textarea
          id="observacoes"
          name="observacoes"
          rows={3}
          value={formData.observacoes}
          onChange={handleInputChange}
          className="mt-1 p-2.5 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-600 dark:text-white"
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
          text="Salvar Alterações"
          variant="primary"
          type="submit"
          disabled={isSubmitting}
        />
      </div>
    </form>
  );
};
