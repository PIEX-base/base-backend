import { useState, useEffect } from "react";
import { getAllCestasByParams } from "~/api/cesta/getAllCestas";
import { Spinner } from "~/components/ui/Spinner";
import type { CestaBasicaDetalhes } from "~/interfaces/cesta";

interface DetalhesCestaModalProps {
  responsavelId: string | null;
}

const CestaItem: React.FC<{
  cesta: CestaBasicaDetalhes;
  isOpen: boolean;
  onToggle: () => void;
}> = ({ cesta, isOpen, onToggle }) => (
  <div className="border p-4 rounded-lg bg-gray-50 dark:bg-gray-700 space-y-2">
    <button
      className="w-full text-left font-bold text-gray-900 dark:text-white flex justify-between items-center"
      onClick={onToggle}>
      <span>
        Data de Entrega:{" "}
        {new Date(cesta.data_entrega).toLocaleDateString("pt-BR")}
      </span>
      <span>{isOpen ? "▲" : "▼"}</span>
    </button>
    {isOpen && (
      <div className="space-y-4 mt-2">
        {cesta.observacoes && (
          <p className="text-sm text-gray-600 dark:text-gray-400">
            <strong>Observações:</strong> {cesta.observacoes}
          </p>
        )}
        <div>
          <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
            Produtos ({cesta.produtos.length}):
          </h4>
          <ul className="list-disc list-inside text-sm space-y-1">
            {cesta.produtos.map((item) => (
              <li key={item.id_produto_cesta}>
                {item.quantidade} {item.produto.unidade_medida || "un"} -{" "}
                {item.produto.nome}
              </li>
            ))}
          </ul>
        </div>
      </div>
    )}
  </div>
);

export const CestaDetalhesModal: React.FC<DetalhesCestaModalProps> = ({
  responsavelId,
}) => {
  const [cestas, setCestas] = useState<CestaBasicaDetalhes[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [openIds, setOpenIds] = useState<string[]>([]);

  useEffect(() => {
    if (!responsavelId) {
      setIsLoading(false);
      return;
    }

    const fetchCestaDetalhes = async () => {
      try {
        setIsLoading(true);
        const data = await getAllCestasByParams({
          responsavel: responsavelId,
        });
        setCestas(data);
      } catch (error) {
        console.error("Erro ao buscar detalhes das cestas:", error);
        setCestas([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCestaDetalhes();
  }, [responsavelId]);

  const beneficiarioNome = cestas?.[0]?.responsavel?.nome || "Beneficiário";

  const handleToggle = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4 min-h-[70vh]">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
        Histórico de Cestas para: {beneficiarioNome}
      </h3>

      {isLoading ? (
        <div className="flex justify-center p-8">
          <Spinner />
        </div>
      ) : cestas && cestas.length > 0 ? (
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {cestas.map((cesta) => (
            <CestaItem
              key={cesta.id_cesta}
              cesta={cesta}
              isOpen={openIds.includes(cesta.id_cesta)}
              onToggle={() => handleToggle(cesta.id_cesta)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center p-8 text-gray-500 dark:text-gray-400">
          Nenhuma cesta encontrada para este responsável.
        </div>
      )}
    </div>
  );
};
