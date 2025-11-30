import { useState, useCallback, useEffect } from "react";
import { getAllCriancas } from "~/api/crianca/getAllCriancas";
import { Spinner } from "~/components/ui/Spinner";
import { Table } from "~/components/ui/Table";
import { Button } from "~/components/ui/Button";
import { Modal } from "~/components/ui/Modal";
import type { Pessoa } from "~/interfaces/pessoa";
import { deletePessoa } from "~/api/pessoa/deletePessoa";
import { useToast } from "~/contexts/ToastContext";
import { ModalCriarCrianca } from "./ModalCriarCrianca";
import { ModalDetalhesCrianca } from "./ModalDetalhesCrianca";
import type { Crianca } from "~/interfaces/crianca";
import { ModalEditarCrianca } from "./ModalEditarCrianca";
import { deleteCrianca } from "~/api/crianca/deleteCrianca";

export const CriancasComponent: React.FC = () => {
  const { showToast } = useToast();
  const [criancas, setCriancas] = useState<Crianca[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCrianca, setSelectedCrianca] = useState<Crianca | null>(null);

  // estados modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const fetchCriancas = useCallback(async () => {
    try {
      const data = await getAllCriancas();
      setCriancas(data);
    } catch (error) {
      showToast(
        "danger",
        error instanceof Error ? error.message : "Erro ao buscar crianças."
      );
    }
  }, [showToast]);

  useEffect(() => {
    setIsLoading(true);
    fetchCriancas().finally(() => setIsLoading(false));
  }, [fetchCriancas]);

  const columns = [
    { key: "nome", label: "Nome" },
    { key: "cpf", label: "CPF" },
    {
      key: "data_nascimento",
      label: "Data de Nascimento",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: "familia",
      label: "Família",
      render: (_: any, row: Pessoa) => row.familia?.nome || "-",
    },
    {
      key: "actions",
      label: "Ações",
      render: (_: any, row: Crianca) => (
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
              void handleDelete(row.id_crianca);
            }}
          />
        </div>
      ),
    },
  ];

  const handleOpenDetails = (crianca: Crianca) => {
    setSelectedCrianca(crianca);
    setDetailsModalOpen(true);
  };
  const handleOpenEdit = (crianca: Crianca) => {
    setSelectedCrianca(crianca);
    setEditModalOpen(true);
  };

  const handleDelete = async (criancaId: string) => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir esta criança? A ação não pode ser desfeita."
      )
    ) {
      try {
        await deleteCrianca(criancaId);
        showToast("success", "Criança excluída com sucesso.");
        fetchCriancas();
      } catch (error) {
        showToast(
          "danger",
          error instanceof Error ? error.message : "Erro ao excluir."
        );
      }
    }
  };

  return (
    <>
      <div className="flex justify-between py-2">
        <h1 className="text-2xl font-bold mb-4">Crianças</h1>
        <Button
          text={"Adicionar criança"}
          size="sm"
          onClick={() => setCreateModalOpen(true)}
        />
      </div>
      {isLoading ? (
        <Spinner size="md" />
      ) : (
        <Table columns={columns} data={criancas} />
      )}

      <Modal
        title="Criar nova criança"
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        showFooter={false}>
        <ModalCriarCrianca
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          setModalOpen={setCreateModalOpen}
          fetchPessoas={fetchCriancas}
        />
      </Modal>

      <Modal
        title="Detalhes da Criança"
        isOpen={detailsModalOpen}
        showFooter={false}
        onClose={() => setDetailsModalOpen(false)}>
        {selectedCrianca && <ModalDetalhesCrianca crianca={selectedCrianca} />}
      </Modal>

      {selectedCrianca && (
        <Modal
          title="Editar Criança"
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          showFooter={false}>
          <ModalEditarCrianca
            crianca={selectedCrianca}
            setModalOpen={setEditModalOpen}
            fetchPessoas={fetchCriancas}
          />
        </Modal>
      )}
    </>
  );
};
