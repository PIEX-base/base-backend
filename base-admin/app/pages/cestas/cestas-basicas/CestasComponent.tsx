import { useState, useCallback, useEffect } from "react";
import { Spinner } from "~/components/ui/Spinner";
import { Table } from "~/components/ui/Table";
import { Button } from "~/components/ui/Button";
import { Modal } from "~/components/ui/Modal";
import { useToast } from "~/contexts/ToastContext";
import { CriarCestaModal } from "./CriarCestaModal";
import type { CestaBasica } from "~/interfaces/cesta";
import { getAllCestasByParams } from "~/api/cesta/getAllCestas";
import { CestaDetalhesModal } from "./CestaDetalhesModal";
import { getAllResponsaveis } from "~/api/responsavel/getAllResponsaveis";
import type { Responsavel } from "~/interfaces/responsavel";

export const CestasComponent: React.FC = () => {
  const { showToast } = useToast();
  // const [cestas, setCestas] = useState<CestaBasica[]>([]);
  const [responsaveis, setResponsaveis] = useState<Responsavel[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedResponsavel, setSelectedResponsavel] = useState<string | null>(
    null
  );

  const fetchResponsaveis = useCallback(async () => {
    try {
      const data = await getAllResponsaveis();
      console.log("Responsáveis:", data);

      setResponsaveis(data);
    } catch (error) {
      showToast("danger", "Erro ao buscar responsáveis.");
    }
  }, [showToast]);

  useEffect(() => {
    setIsLoading(true);
    fetchResponsaveis().finally(() => setIsLoading(false));
  }, [fetchResponsaveis]);

  const columns = [
    {
      key: "beneficiario",
      label: "Beneficiário",
      render: (_: any, row: Responsavel) => row.nome || "-",
    },

    {
      key: "familia",
      label: "Família",
      render: (_: any, row: Responsavel) => row.familia?.nome || "-",
    },

    {
      key: "actions",
      label: "Ações",
      render: (_: any, row: Responsavel) => (
        <div className="flex gap-2">
          <Button
            text="Ver detalhes"
            size="sm"
            variant="success"
            onClick={() => {
              setSelectedResponsavel(row.id_responsavel ?? null);
              setDetailsModalOpen(true);
            }}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="flex justify-between py-2">
        <h1 className="text-2xl font-bold mb-4">Cestas Básicas</h1>
        <Button
          text="Nova Cesta"
          size="sm"
          onClick={() => setCreateModalOpen(true)}
        />
      </div>

      {isLoading ? (
        <Spinner size="md" />
      ) : (
        <Table columns={columns} data={responsaveis ?? []} />
      )}

      <Modal
        title="Nova Cesta Básica"
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        showFooter={false}
        size="xl">
        <CriarCestaModal onClose={() => setCreateModalOpen(false)} />
      </Modal>

      {selectedResponsavel && (
        <Modal
          title="Detalhes da Cesta"
          isOpen={detailsModalOpen}
          onClose={() => setDetailsModalOpen(false)}
          showFooter={false}
          size="lg">
          <CestaDetalhesModal responsavelId={selectedResponsavel} />
        </Modal>
      )}
    </>
  );
};
