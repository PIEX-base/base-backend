import { useState, useCallback, useEffect } from "react";
import { Spinner } from "~/components/ui/Spinner";
import { Table } from "~/components/ui/Table";
import { Button } from "~/components/ui/Button";
import { Modal } from "~/components/ui/Modal";
import { useToast } from "~/contexts/ToastContext";
import { getAllProdutos } from "~/api/produto/getAllProdutos";
import { CriarProdutoModal } from "./CriarProdutoModal";
import type { Produto } from "~/interfaces/produto";
import { EditarProdutoModal } from "./EditarProdutoModal";

export const ProdutosComponent: React.FC = () => {
  const { showToast } = useToast();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState<Produto | null>(null);

  const fetchProdutos = useCallback(async () => {
    try {
      const data = await getAllProdutos();
      setProdutos(data);
    } catch (error) {
      showToast(
        "danger",
        error instanceof Error ? error.message : "Erro ao buscar produtos."
      );
    }
  }, [showToast]);

  useEffect(() => {
    setIsLoading(true);
    fetchProdutos().finally(() => setIsLoading(false));
  }, [fetchProdutos]);

  const columns = [
    { key: "nome", label: "Nome" },
    { key: "descricao", label: "Descrição" },
    {
      key: "is_basico",
      label: "Básico?",
      render: (value: boolean) => (value ? "Sim" : "Não"),
    },
    { key: "unidade_medida", label: "Unidade" },
    {
      key: "editar",
      label: "Editar",
      render: (_: any, row: Produto) => (
        <Button
          text="Editar"
          size="sm"
          onClick={() => {
            setSelectedProduto(row);
            setUpdateModalOpen(true);
          }}
        />
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between py-2">
        <h1 className="text-2xl font-bold mb-4">Produtos</h1>
        <Button
          text={"Adicionar produto"}
          size="sm"
          onClick={() => setCreateModalOpen(true)}
        />
      </div>
      {isLoading ? (
        <Spinner size="md" />
      ) : (
        <Table columns={columns} data={produtos} />
      )}

      <Modal
        title="Criar novo produto"
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        showFooter={false}>
        <CriarProdutoModal
          fetchProdutos={fetchProdutos}
          onClose={() => setCreateModalOpen(false)}
        />
      </Modal>

      {selectedProduto && (
        <Modal
          title="Editar produto"
          isOpen={updateModalOpen}
          onClose={() => setUpdateModalOpen(false)}
          showFooter={false}>
          <EditarProdutoModal
            onClose={() => setUpdateModalOpen(false)}
            fetchProdutos={fetchProdutos}
            produto={selectedProduto!}
          />
        </Modal>
      )}
    </>
  );
};
