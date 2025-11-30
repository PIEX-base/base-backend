import { useCallback, useEffect, useState } from "react";
import { PageContainer } from "~/components/layout/PageContainer";
import { Button } from "~/components/ui/Button";
import { Spinner } from "~/components/ui/Spinner";
import { Table } from "~/components/ui/Table";
import { useToast } from "~/contexts/ToastContext";
import type { Doacao } from "~/interfaces/doacao";
import { Modal } from "~/components/ui/Modal";
import { getAllDoacoes } from "~/api/doacoes/getAllDoacoes";
import { createDoacao } from "~/api/doacoes/createDoacao";
import { deleteDoacao } from "~/api/doacoes/deleteDoacao";
import { updateDoacao } from "~/api/doacoes/updateDoacao";
import { CreateModal } from "./CreateModal";
import { UpdateModal } from "./UpdateModal";

export const DoacoesPage = () => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [doacoes, setDoacoes] = useState<Doacao[]>([]);
  const [selectedDoacao, setSelectedDoacao] = useState<Doacao | null>(null);
  const [modalOpen, setModalOpen] = useState({
    createModal: false,
    updateModal: false,
  });

  const fetchDoacoes = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getAllDoacoes();
      setDoacoes(response);
    } catch (error) {
      showToast(
        "danger",
        error instanceof Error
          ? error.message
          : "Erro ao carregar dados de doações."
      );
    } finally {
      setIsLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchDoacoes();
  }, [fetchDoacoes]);

  const handleCreate = async (payload: Omit<Doacao, "id_doacao">) => {
    try {
      setIsSubmitting(true);
      await createDoacao(payload);
      showToast("success", "Doação criada com sucesso!");
      setModalOpen({ ...modalOpen, createModal: false });
      await fetchDoacoes();
    } catch (error) {
      showToast(
        "danger",
        error instanceof Error ? error.message : "Erro ao criar doação."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (payload: Partial<Doacao>) => {
    if (!selectedDoacao) return;
    try {
      setIsSubmitting(true);
      await updateDoacao(selectedDoacao.id_doacao, payload);
      showToast("success", "Doação atualizada com sucesso!");
      setModalOpen({ ...modalOpen, updateModal: false });
      await fetchDoacoes();
    } catch (error) {
      showToast(
        "danger",
        error instanceof Error ? error.message : "Erro ao atualizar doação."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (doacaoId: string) => {
    try {
      setIsSubmitting(true);
      await deleteDoacao(doacaoId);
      showToast("success", "Doação removida com sucesso!");
      setModalOpen({ ...modalOpen, updateModal: false });
      await fetchDoacoes();
    } catch (error) {
      showToast(
        "danger",
        error instanceof Error ? error.message : "Erro ao remover doação."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { key: "descricao", label: "Descrição" },
    { key: "tipo", label: "Tipo" },
    {
      key: "valor",
      label: "Valor",
      render: (value: number | null) => (value ? `R$ ${Number(value)}` : "N/A"),
    },
    {
      key: "data_recebimento",
      label: "Data Recebimento",
      render: (value: string) => new Date(value).toLocaleDateString("pt-BR"),
    },
    {
      key: "actions",
      label: "Ações",
      render: (_: any, row: Doacao) => (
        <div className="flex gap-2">
          <Button
            text="Editar"
            size="sm"
            disabled={isLoading}
            onClick={() => {
              setSelectedDoacao(row);
              setModalOpen({ ...modalOpen, updateModal: true });
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      title="Doações"
      actions={
        <Button
          text="Adicionar Doação"
          size="sm"
          disabled={isLoading}
          onClick={() => setModalOpen({ ...modalOpen, createModal: true })}
        />
      }>
      {isLoading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}

      <div className="mt-4">
        <Table
          columns={columns}
          data={doacoes}
          className="w-full"
          sortKey="data_recebimento"
          sortDirection="desc"
        />
      </div>

      <Modal
        title="Adicionar Nova Doação"
        showFooter={false}
        isOpen={modalOpen.createModal}
        onClose={() => setModalOpen({ ...modalOpen, createModal: false })}>
        <CreateModal
          onCreate={handleCreate}
          onCancel={() => setModalOpen({ ...modalOpen, createModal: false })}
          isDisabled={isSubmitting}
        />
      </Modal>

      <Modal
        title="Editar Doação"
        showFooter={false}
        isOpen={modalOpen.updateModal}
        onClose={() => setModalOpen({ ...modalOpen, updateModal: false })}>
        {selectedDoacao ? (
          <UpdateModal
            doacao={selectedDoacao}
            onSave={handleUpdate}
            onDelete={handleDelete}
            onCancel={() => setModalOpen({ ...modalOpen, updateModal: false })}
            isSubmitting={isSubmitting}
          />
        ) : null}
      </Modal>
    </PageContainer>
  );
};
