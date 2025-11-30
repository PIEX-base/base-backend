import { useState, useCallback, useEffect } from "react";
import { deleteAtividade } from "~/api/atividades/deleteAtividade";
import { getAllAtividades } from "~/api/atividades/getAllAtividades";
import { Button } from "~/components/ui/Button";
import { Modal } from "~/components/ui/Modal";
import { Spinner } from "~/components/ui/Spinner";
import { Table } from "~/components/ui/Table";
import { useToast } from "~/contexts/ToastContext";
import type { Atividade } from "~/interfaces/atividade";
import { ModalCriarAtividade } from "./ModalCriarAtividade";
import { ModalDetalhesAtividade } from "./ModalDetalhesAtividade";
import { ModalEditarAtividade } from "./ModalEditarAtividade";

export const AtividadesComponent: React.FC = () => {
  const [atividades, setAtividades] = useState<Atividade[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAtividade, setSelectedAtividade] = useState<Atividade | null>(
    null
  );
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { showToast } = useToast();

  const fetchAtividades = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getAllAtividades();
      setAtividades(data);
    } catch (error) {
      showToast(
        "danger",
        error instanceof Error ? error.message : "Erro ao buscar atividades"
      );
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchAtividades();
  }, [fetchAtividades]);

  const handleOpenDetails = (atividade: Atividade) => {
    setSelectedAtividade(atividade);
    setDetailsModalOpen(true);
  };

  const handleOpenEdit = (atividade: Atividade) => {
    setSelectedAtividade(atividade);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta atividade?")) {
      try {
        await deleteAtividade(id);
        fetchAtividades();
        showToast("success", "Atividade excluída com sucesso.");
      } catch (error) {
        showToast(
          "danger",
          error instanceof Error ? error.message : "Erro ao excluir."
        );
      }
    }
  };

  const columns = [
    { key: "nome", label: "Nome" },
    // { key: "descricao", label: "Descrição" },
    // { key: "tipo", label: "Tipo" },
    // { key: "publico_alvo", label: "Público Alvo" },
    {
      key: "dias_semana",
      label: "Dias da Semana",
      render: (value: string) =>
        value
          .split(",")
          .map(
            (dia) =>
              ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][
                parseInt(dia, 10)
              ] || dia
          )
          .join(", "),
    },
    {
      key: "horario_inicio",
      label: "Início",
      render: (value: string) =>
        new Date(value).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      key: "horario_fim",
      label: "Fim",
      render: (value: string) =>
        new Date(value).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    {
      key: "actions",
      label: "Ações",
      render: (_: any, row: Atividade) => (
        <div className="flex gap-2">
          <Button
            text="Detalhes"
            size="sm"
            variant="secondary"
            onClick={() => handleOpenDetails(row)}
          />
          <Button
            text="Editar"
            size="sm"
            variant="primary"
            onClick={() => handleOpenEdit(row)}
          />
          <Button
            text="Excluir"
            size="sm"
            variant="danger"
            onClick={() => {
              void handleDelete(row.id_atividade);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold mb-4">Atividades</h1>
        <Button
          text="Nova Atividade"
          onClick={() => setCreateModalOpen(true)}
        />
      </div>
      {isLoading ? (
        <Spinner size="md" />
      ) : (
        <Table columns={columns} data={atividades} />
      )}

      {selectedAtividade && (
        <>
          <Modal
            title="Detalhes da Atividade"
            isOpen={detailsModalOpen}
            showFooter={false}
            onClose={() => setDetailsModalOpen(false)}>
            <ModalDetalhesAtividade atividade={selectedAtividade} />
          </Modal>

          <Modal
            title="Editar Atividade"
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            showFooter={false}>
            <ModalEditarAtividade
              atividade={selectedAtividade}
              setModalOpen={setEditModalOpen}
              fetchAtividades={fetchAtividades}
            />
          </Modal>
        </>
      )}

      <Modal
        title="Criar Nova Atividade"
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        showFooter={false}
        size="xl">
        <ModalCriarAtividade
          setModalOpen={setCreateModalOpen}
          fetchAtividades={fetchAtividades}
        />
      </Modal>
    </>
  );
};
