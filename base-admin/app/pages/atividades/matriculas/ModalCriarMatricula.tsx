import { useEffect, useState } from "react";
import { Button } from "~/components/ui/Button";
import { useToast } from "~/contexts/ToastContext";
import type { CreateMatriculaPayload } from "~/interfaces/matricula";
import { createMatricula } from "~/api/matriculas/createMatricula";
import { getAllCriancas } from "~/api/crianca/getAllCriancas";
import { getAllAtividades } from "~/api/atividades/getAllAtividades";
import type { Crianca } from "~/interfaces/crianca";
import type { Atividade } from "~/interfaces/atividade";

interface ModalCriarMatriculaProps {
  setModalOpen: (isOpen: boolean) => void;
  fetchMatriculas: () => Promise<void>;
}

export const ModalCriarMatricula: React.FC<ModalCriarMatriculaProps> = ({
  setModalOpen,
  fetchMatriculas,
}) => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [criancas, setCriancas] = useState<Crianca[]>([]);
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    id_crianca: "",
    id_atividade: "",
    observacoes: "",
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const [criancasData, atividadesData] = await Promise.all([
          getAllCriancas(),
          getAllAtividades(),
        ]);

        setCriancas(criancasData);
        setAtividades(atividadesData);
      } catch (error) {
        showToast("danger", "Erro ao carregar dados para matrícula.");
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [showToast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e?.target?.name]: e?.target?.value }));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        id_crianca: Number(formData.id_crianca),
        id_atividade: Number(formData.id_atividade),
        observacoes: formData.observacoes || undefined,
      };

      await createMatricula(payload);

      showToast("success", "Matrícula realizada com sucesso.");
      fetchMatriculas();
      setModalOpen(false);
    } catch (error) {
      showToast(
        "danger",
        error instanceof Error ? error.message : "Erro ao matricular."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleCreate}>
      <div>
        <label
          htmlFor="id_crianca"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Criança
        </label>
        <select
          id="id_crianca"
          name="id_crianca"
          value={formData.id_crianca}
          onChange={handleInputChange}
          required
          disabled={isLoading}
          className="mt-1 p-2.5 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-600 dark:text-white">
          <option value="">
            {isLoading ? "Carregando..." : "Selecione a criança"}
          </option>
          {criancas.map((c) => (
            <option key={c.id_crianca} value={c.id_crianca}>
              {c?.nome ?? "—"}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="id_atividade"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Atividade
        </label>
        <select
          id="id_atividade"
          name="id_atividade"
          value={formData.id_atividade}
          onChange={handleInputChange}
          required
          disabled={isLoading}
          className="mt-1 p-2.5 block w-full rounded-md border-gray-300 shadow-sm dark:bg-gray-600 dark:text-white">
          <option value="">
            {isLoading ? "Carregando..." : "Selecione a atividade"}
          </option>
          {atividades.map((a) => (
            <option key={a.id_atividade} value={a.id_atividade}>
              {a?.nome ?? "—"}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label
          htmlFor="observacoes"
          className="block text-sm font-medium text-gray-700 dark:text-gray-200">
          Observações (Opcional)
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
          text="Matricular"
          variant="primary"
          type="submit"
          disabled={isSubmitting || isLoading}
        />
      </div>
    </form>
  );
};
