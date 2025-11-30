import { useCallback, useEffect, useState } from "react";
import { getAllVolunteers } from "~/api/voluntarios/getAllVoluntarios";
import { PageContainer } from "~/components/layout/PageContainer";
import { Button } from "~/components/ui/Button";
import { Spinner } from "~/components/ui/Spinner";
import { Table } from "~/components/ui/Table";
import { useToast } from "~/contexts/ToastContext";
import type {
  CreateVolunteerPayload,
  Voluntario,
} from "~/interfaces/volunteers";
import { Modal } from "~/components/ui/Modal";
import { createVolunteer } from "~/api/voluntarios/createVolunteer";
import { deleteVolunteer } from "~/api/voluntarios/deleteVolunteer";
import { updateVolunteer } from "~/api/voluntarios/updateVolunteer";
import { CreateModal } from "./CreateModal";
import { UpdateModal } from "./UpdateModal";

export const VolunteersPage = () => {
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [volunteers, setVolunteers] = useState<Voluntario[]>([]);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Voluntario | null>(
    null
  );
  const [modalOpen, setModalOpen] = useState({
    createModal: false,
    updateModal: false,
  });

  const fetchVolunteers = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await getAllVolunteers();
      setVolunteers(response);
    } catch (error) {
      showToast(
        "danger",
        error instanceof Error
          ? error.message
          : "Erro ao carregar dados de voluntários."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  const handleCreate = async (payload: CreateVolunteerPayload) => {
    try {
      setIsSubmitting(true);
      await createVolunteer(payload);
      showToast("success", "Voluntário criado com sucesso!");
      setModalOpen({ ...modalOpen, createModal: false });
      await fetchVolunteers();
    } catch (error) {
      showToast(
        "danger",
        error instanceof Error ? error.message : "Erro ao criar voluntário."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (payload: Partial<Voluntario>) => {
    if (!selectedVolunteer) return;
    try {
      setIsSubmitting(true);
      await updateVolunteer(selectedVolunteer.id_voluntario, payload);
      showToast("success", "Voluntário atualizado com sucesso!");
      setModalOpen({ ...modalOpen, updateModal: false });
      await fetchVolunteers();
    } catch (error) {
      showToast(
        "danger",
        error instanceof Error ? error.message : "Erro ao atualizar voluntário."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (volunteerId: string) => {
    try {
      setIsSubmitting(true);
      await deleteVolunteer(volunteerId);
      showToast("success", "Voluntário removido com sucesso!");
      setModalOpen({ ...modalOpen, updateModal: false });
      await fetchVolunteers();
    } catch (error) {
      showToast(
        "danger",
        error instanceof Error ? error.message : "Erro ao remover voluntário."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { key: "nome", label: "Nome" },
    { key: "email", label: "E-mail" },
    { key: "telefone", label: "Telefone" },
    {
      key: "data_cadastro",
      label: "Data cadastro",
      render: (value: string) => new Date(value).toLocaleDateString("pt-BR"),
    },
    {
      key: "actions",
      label: "Ações",
      render: (_: any, row: Voluntario) => (
        <div className="flex gap-2">
          <Button
            text="Editar"
            size="sm"
            disabled={isLoading}
            onClick={() => {
              setSelectedVolunteer(row);
              setModalOpen({ ...modalOpen, updateModal: true });
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <PageContainer
      title="Voluntários"
      actions={
        <Button
          text="Adicionar Voluntário"
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
          data={volunteers}
          className="w-full"
          sortKey="data_cadastro"
          sortDirection="desc"
        />
      </div>

      <Modal
        title="Adicionar Novo Voluntário"
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
        title="Editar Voluntário"
        showFooter={false}
        isOpen={modalOpen.updateModal}
        onClose={() => setModalOpen({ ...modalOpen, updateModal: false })}>
        {selectedVolunteer ? (
          <UpdateModal
            volunteer={selectedVolunteer}
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
