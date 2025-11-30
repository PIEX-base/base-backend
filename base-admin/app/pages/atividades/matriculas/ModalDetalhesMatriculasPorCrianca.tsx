import { useState } from "react";
import { Button } from "~/components/ui/Button";
import { Modal } from "~/components/ui/Modal";
import { useToast } from "~/contexts/ToastContext";
import { statusMatriculaBadge } from "~/enums/matriculas";
import type { Matricula } from "~/interfaces/matricula";
import { ModalEditarMatricula } from "./ModalEditarMatricula";
import { deleteMatricula } from "~/api/matriculas/deleteMatriculas";

// A interface para os dados agrupados que o modal recebe
interface CriancaComMatriculas {
  id_crianca: string;
  nome: string;
  matriculas: Matricula[];
}

interface ModalDetalhesMatriculasPorCriancaProps {
  criancaComMatriculas: CriancaComMatriculas | null;
  fetchMatriculas: () => Promise<void>;
}

export const ModalDetalhesMatriculasPorCrianca: React.FC<
  ModalDetalhesMatriculasPorCriancaProps
> = ({ criancaComMatriculas, fetchMatriculas }) => {
  const { showToast } = useToast();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedMatricula, setSelectedMatricula] = useState<Matricula | null>(
    null
  );

  if (!criancaComMatriculas) return null;

  const handleOpenEdit = (matricula: Matricula) => {
    setSelectedMatricula(matricula);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta matrícula?")) {
      try {
        await deleteMatricula(id);
        await fetchMatriculas(); // Recarrega os dados na página principal
        showToast("success", "Matrícula excluída com sucesso.");
      } catch (error) {
        showToast("danger", "Erro ao excluir matrícula.");
      }
    }
  };

  return (
    <>
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Matrículas de: {criancaComMatriculas.nome}
        </h3>

        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {criancaComMatriculas.matriculas.length > 0 ? (
            criancaComMatriculas.matriculas.map((matricula) => (
              <div
                key={matricula.id_matricula}
                className="p-4 border rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-bold text-lg text-gray-900 dark:text-white">
                      {matricula.atividade.nome}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Data:{" "}
                      {new Date(matricula.data_matricula).toLocaleDateString(
                        "pt-BR"
                      )}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${
                      statusMatriculaBadge[matricula.status]
                    }`}>
                    {matricula.status}
                  </span>
                </div>
                {matricula.observacoes && (
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                    Obs: {matricula.observacoes}
                  </p>
                )}
                <div className="flex gap-2 justify-end mt-3">
                  <Button
                    text="Editar"
                    size="sm"
                    onClick={() => handleOpenEdit(matricula)}
                  />
                  <Button
                    text="Excluir"
                    size="sm"
                    variant="danger"
                    onClick={() => void handleDelete(matricula.id_matricula)}
                  />
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">
              Nenhuma matrícula encontrada para esta criança.
            </p>
          )}
        </div>
      </div>

      <Modal
        title="Editar Status da Matrícula"
        isOpen={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        showFooter={false}>
        <ModalEditarMatricula
          matricula={selectedMatricula}
          setModalOpen={setEditModalOpen}
          fetchMatriculas={fetchMatriculas}
        />
      </Modal>
    </>
  );
};
