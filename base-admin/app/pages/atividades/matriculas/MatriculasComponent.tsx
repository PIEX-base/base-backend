import { useCallback, useEffect, useState, useMemo } from "react";
import { Button } from "~/components/ui/Button";
import { Modal } from "~/components/ui/Modal";
import { Spinner } from "~/components/ui/Spinner";
import { Table } from "~/components/ui/Table";
import { useToast } from "~/contexts/ToastContext";
import { getAllMatriculas } from "~/api/matriculas/getAllMatriculas";
import type { Matricula } from "~/interfaces/matricula";
import { ModalCriarMatricula } from "./ModalCriarMatricula";
import { ModalDetalhesMatriculasPorCrianca } from "./ModalDetalhesMatriculasPorCrianca";

// Interface para os dados agrupados, usando a nomenclatura correta
interface CriancaComMatriculas {
  id_crianca: string;
  nome: string;
  cpf: string | null;
  matriculas: Matricula[];
}

export const MatriculasComponent: React.FC = () => {
  const { showToast } = useToast();
  const [matriculas, setMatriculas] = useState<Matricula[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCrianca, setSelectedCrianca] =
    useState<CriancaComMatriculas | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const fetchMatriculas = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAllMatriculas();
      setMatriculas(data);
    } catch (error) {
      showToast("danger", "Erro ao buscar matrículas.");
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchMatriculas();
  }, [fetchMatriculas]);

  // Agrupa matrículas por criança
  const criancasComMatriculas = useMemo(() => {
    const grouped = matriculas.reduce((acc, matricula) => {
      const { id_crianca, nome, cpf } = matricula.crianca;
      if (!acc[id_crianca]) {
        acc[id_crianca] = {
          id_crianca,
          nome,
          cpf: cpf || null,
          matriculas: [],
        };
      }
      acc[id_crianca].matriculas.push(matricula);
      return acc;
    }, {} as Record<string, CriancaComMatriculas>);

    return Object.values(grouped);
  }, [matriculas]);

  const handleOpenDetails = (crianca: CriancaComMatriculas) => {
    setSelectedCrianca(crianca);
    setDetailsModalOpen(true);
  };

  const columns = [
    { key: "nome", label: "Nome da Criança" },
    { key: "cpf", label: "CPF" },
    {
      key: "matriculas_count",
      label: "Nº de Matrículas",
      render: (_: any, row: CriancaComMatriculas) => row.matriculas.length,
    },
    {
      key: "actions",
      label: "Ações",
      render: (_: any, row: CriancaComMatriculas) => (
        <Button
          text="Ver Matrículas"
          size="sm"
          onClick={() => handleOpenDetails(row)}
        />
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-end mb-4">
        <Button
          text="Nova Matrícula"
          onClick={() => setCreateModalOpen(true)}
        />
      </div>

      {isLoading ? (
        <Spinner />
      ) : (
        <Table columns={columns} data={criancasComMatriculas} />
      )}

      <Modal
        title="Nova Matrícula"
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        showFooter={false}>
        <ModalCriarMatricula
          setModalOpen={setCreateModalOpen}
          fetchMatriculas={fetchMatriculas}
        />
      </Modal>

      <Modal
        title="Histórico de Matrículas"
        isOpen={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        showFooter={false}
        size="fullscreen">
        <ModalDetalhesMatriculasPorCrianca
          criancaComMatriculas={selectedCrianca}
          fetchMatriculas={fetchMatriculas}
        />
      </Modal>
    </>
  );
};
