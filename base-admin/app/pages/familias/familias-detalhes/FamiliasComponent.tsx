import { useState, useCallback, useEffect } from "react";
import { deleteFamilia } from "~/api/familias/deleteFamilia";
import { getAllFamilias } from "~/api/familias/getAllFamilias";
import { getFamiliaDetalhes } from "~/api/familias/getFamiliaDetalhes";
import { Button } from "~/components/ui/Button";
import { Modal } from "~/components/ui/Modal";
import { Spinner } from "~/components/ui/Spinner";
import { Table } from "~/components/ui/Table";
import { useToast } from "~/contexts/ToastContext";
import type { Familia, FamiliaDetalhes } from "~/interfaces/familias";
import { DetalhesFamiliaModal } from "./DetalhesFamiliaModal";
import { ModalCriarFamilia } from "./ModalCriarFamilia";
import { ModalEditarFamilia } from "./ModalEditarFamillia";

export const FamiliasComponent: React.FC = () => {
  const { showToast } = useToast();
  const [familias, setFamilias] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // modal states
  const [modalOpen, setModalOpen] = useState(false); // modal criação de família
  const [detalhesModal, setDetalhesModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedFamilia, setSelectedFamilia] = useState<Familia | null>(null);
  const [familiaDetalhes, setFamiliaDetalhes] =
    useState<FamiliaDetalhes | null>(null);

  const fetchFamilias = useCallback(async () => {
    const data = await getAllFamilias();
    setFamilias(data);
  }, []);

  const fetchFamiliasDetalhes = useCallback(async (id: number) => {
    const data = await getFamiliaDetalhes(id);
    console.log("Fetched family details:", data);

    setFamiliaDetalhes(data);
    setDetalhesModal(true);
  }, []);

  useEffect(() => {
    try {
      setIsLoading(true);
      fetchFamilias();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchFamilias]);

  const columns = [
    { key: "nome", label: "Nome" },
    { key: "numero_dependentes", label: "Número de Dependentes" },
    {
      key: "id_responsavel",
      label: "Responsável",
      render: (value: string, row: Familia) => row.responsavel?.nome || "-",
    },
    // { key: "observacoes", label: "Observações" },
    {
      key: "data_cadastro",
      label: "Data de Cadastro",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: "actions",
      label: "Ações",
      render: (_: any, row: Familia) => (
        <div className="flex gap-2">
          <Button
            text="Detalhes"
            size="sm"
            variant="success"
            onClick={() => {
              fetchFamiliasDetalhes(Number(row.id_familia));
            }}
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
              void handleDelete(row.id_familia);
            }}
          />
        </div>
      ),
    },
  ];

  const handleOpenEdit = (familia: Familia) => {
    setSelectedFamilia(familia);
    setEditModalOpen(true);
  };

  const handleDelete = async (familiaId: string) => {
    if (
      window.confirm(
        "Tem certeza que deseja excluir esta família? A ação não pode ser desfeita."
      )
    ) {
      try {
        await deleteFamilia(familiaId);
        showToast("success", "Família excluída com sucesso.");
        fetchFamilias();
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
        <h1 className="text-2xl font-bold mb-4">Famílias</h1>
        <Button
          text={"Adicionar família"}
          size="sm"
          onClick={() => setModalOpen(true)}
        />
      </div>
      {isLoading ? (
        <Spinner size="md" />
      ) : (
        <Table columns={columns} data={familias} />
      )}

      <Modal
        title="Criar nova família"
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        showFooter={false}>
        <ModalCriarFamilia
          isSubmitting={isSubmitting}
          setIsSubmitting={setIsSubmitting}
          setModalOpen={setModalOpen}
          fetchFamilias={fetchFamilias}
        />
      </Modal>

      {selectedFamilia && (
        <Modal
          title="Editar Família"
          isOpen={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          showFooter={false}>
          <ModalEditarFamilia
            familia={selectedFamilia}
            setModalOpen={setEditModalOpen}
            fetchFamilias={fetchFamilias}
          />
        </Modal>
      )}

      {familiaDetalhes && (
        <Modal
          size="xl"
          title="Detalhes da Família"
          isOpen={detalhesModal}
          onClose={() => setDetalhesModal(false)}
          showFooter={false}>
          <DetalhesFamiliaModal familia={familiaDetalhes} />
        </Modal>
      )}
    </>
  );
};
