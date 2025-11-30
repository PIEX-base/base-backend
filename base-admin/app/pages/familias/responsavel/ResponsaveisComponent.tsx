import { useState, useCallback, useEffect } from "react";
import { Spinner } from "~/components/ui/Spinner";
import { Table } from "~/components/ui/Table";
import { Button } from "~/components/ui/Button";
import { Modal } from "~/components/ui/Modal";
import { useToast } from "~/contexts/ToastContext";
import { getAllResponsaveis } from "~/api/responsavel/getAllResponsaveis";
import type { Responsavel } from "~/interfaces/responsavel";
import { ModalCriarResponsavel } from "./CreateResponsavelModal";
import { deleteResponsavel } from "~/api/responsavel/deleteResponsavel";
import { ModalDetalhesResponsavel } from "./DetalhesResponsavelModal";
import { ModalEditarResponsavel } from "./EditResponsavelModal";

export const ResponsaveisComponent: React.FC = () => {
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedResponsavel, setSelectedResponsavel] =
    useState<Responsavel | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const { showToast } = useToast();

  const fetchResponsaveis = useCallback(async () => {
    try {
      const data = await getAllResponsaveis();

      setResponsaveis(data);
    } catch (error) {
      showToast("danger", "Erro ao carregar responsáveis.");
    }
  }, [showToast]);

  useEffect(() => {
    setIsLoading(true);
    fetchResponsaveis().finally(() => setIsLoading(false));
  }, [fetchResponsaveis]);

  const handleOpenDetails = (responsavel: Responsavel) => {
    setSelectedResponsavel(responsavel);
    setDetailsModalOpen(true);
  };

  const handleOpenEdit = (responsavel: Responsavel) => {
    setSelectedResponsavel(responsavel);
    setEditModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir este responsável?")) {
      try {
        await deleteResponsavel(id);
        fetchResponsaveis();
        showToast("success", "Responsável excluído com sucesso.");
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
    { key: "cpf", label: "CPF" },
    { key: "telefone", label: "Telefone" },
    {
      key: "actions",
      label: "Ações",
      render: (_: any, row: Responsavel) => (
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
              void handleDelete(row.id_responsavel);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between py-2">
        <h1 className="text-2xl font-bold mb-4">Responsáveis</h1>
        <Button
          text={"Adicionar Responsável"}
          size="sm"
          onClick={() => setCreateModalOpen(true)}
        />
      </div>

      {isLoading ? (
        <Spinner size="md" />
      ) : (
        <Table columns={columns} data={responsaveis} />
      )}

      <Modal
        title="Criar Novo Responsável"
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        showFooter={false}>
        <ModalCriarResponsavel
          setModalOpen={setCreateModalOpen}
          fetchResponsaveis={fetchResponsaveis}
        />
      </Modal>

      {selectedResponsavel && (
        <>
          <Modal
            title="Detalhes do Responsável"
            isOpen={detailsModalOpen}
            showFooter={false}
            onClose={() => setDetailsModalOpen(false)}>
            <ModalDetalhesResponsavel responsavel={selectedResponsavel} />
          </Modal>

          <Modal
            title="Editar Responsável"
            isOpen={editModalOpen}
            onClose={() => setEditModalOpen(false)}
            showFooter={false}>
            <ModalEditarResponsavel
              responsavel={selectedResponsavel}
              setModalOpen={setEditModalOpen}
              fetchResponsaveis={fetchResponsaveis}
            />
          </Modal>
        </>
      )}
    </>
  );
};
