import { useState, useCallback, useEffect } from "react";
import { getAllPessoas } from "~/api/pessoa/getAllPessoas";
import { Spinner } from "~/components/ui/Spinner";
import { Table } from "~/components/ui/Table";
import { Button } from "~/components/ui/Button";
import { Modal } from "~/components/ui/Modal";
import { ModalCriarPessoa } from "./ModalCriarPessoa";
import { ModalDetalhesPessoa } from "./ModalDetalhePessoa";
import type { Pessoa } from "~/interfaces/pessoa";
import { deletePessoa } from "~/api/pessoa/deletePessoa";
import { useToast } from "~/contexts/ToastContext";
import { ModalEditarPessoa } from "./ModalEditarPessoa";

export const PessoasComponent: React.FC = () => {
  const { showToast } = useToast();
  const [pessoas, setPessoas] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPessoa, setSelectedPessoa] = useState<Pessoa | null>(null);

  // estados modal
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  const fetchPessoas = useCallback(async () => {
    try {
      const data = await getAllPessoas();
      setPessoas(data);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchPessoas().finally(() => setIsLoading(false));
  }, [fetchPessoas]);

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
      render: (_: any, row: Pessoa) => (
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
              void handleDelete(row.id_pessoa);
            }}
          />
        </div>
      ),
    },
  ];

  const handleOpenDetails = (pessoa: Pessoa) => {
    setSelectedPessoa(pessoa);
    setDetailsModalOpen(true);
  };
  const handleOpenEdit = (pessoa: Pessoa) => {
    setSelectedPessoa(pessoa);
    setEditModalOpen(true);
  };

  const handleDelete = async (pessoaId: string) => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir esta pessoa? A ação não pode ser desfeita."
      )
    ) {
      try {
        await deletePessoa(pessoaId);
        showToast("success", "Pessoa excluída com sucesso.");
        fetchPessoas();
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
        <h1 className="text-2xl font-bold mb-4">Pessoas</h1>
        <Button
          text={"Adicionar pessoa"}
          size="sm"
          onClick={() => setCreateModalOpen(true)}
        />
      </div>
      {isLoading ? (
        <Spinner size="md" />
      ) : (
        <Table columns={columns} data={pessoas} />
      )}

      <Modal
        title="Criar nova pessoa"
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        showFooter={false}>
        <ModalCriarPessoa
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          setModalOpen={setCreateModalOpen}
          fetchPessoas={fetchPessoas}
        />
      </Modal>

      <Modal
        title="Detalhes da Pessoa"
        isOpen={detailsModalOpen}
        showFooter={false}
        onClose={() => setDetailsModalOpen(false)}>
        {selectedPessoa && <ModalDetalhesPessoa pessoa={selectedPessoa} />}
      </Modal>

      {selectedPessoa && (
        <Modal
          title="Editar Pessoa"
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          showFooter={false}>
          <ModalEditarPessoa
            pessoa={selectedPessoa}
            setModalOpen={setEditModalOpen}
            fetchPessoas={fetchPessoas}
          />
        </Modal>
      )}
    </>
  );
};
