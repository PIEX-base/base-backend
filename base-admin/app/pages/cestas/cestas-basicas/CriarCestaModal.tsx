import { useState, useEffect } from "react";
import { getAllProdutos } from "~/api/produto/getAllProdutos";
import { Button } from "~/components/ui/Button";
import { InputField } from "~/components/ui/InputField";
import { useToast } from "~/contexts/ToastContext";
import type { Produto } from "~/interfaces/produto";
import { useCallback } from "react";
import { getAllResponsaveis } from "~/api/responsavel/getAllResponsaveis";
import type { Responsavel } from "~/interfaces/responsavel";
import { createCesta } from "~/api/cesta/createCesta";

interface CriarCestaModalProps {
  onClose: () => void;
}

export const CriarCestaModal: React.FC<CriarCestaModalProps> = ({
  onClose,
}) => {
  const { showToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [beneficiarioTipo, setBeneficiarioTipo] = useState<
    "responsavel" | "externo"
  >("responsavel");
  const [responsaveis, setResponsaveis] = useState<Responsavel[]>([]);
  const [responsavelSelecionado, setResponsavelSelecionado] =
    useState<Responsavel | null>(null);
  const [beneficiariosExternos, setBeneficiariosExternos] = useState<any[]>([]);
  const [produtos, setProdutos] = useState([]);
  const [produtosSelecionados, setProdutosSelecionados] = useState<
    Array<{ id: string; quantidade: number }>
  >([]);

  const fetchProdutos = useCallback(async () => {
    const data = await getAllProdutos();
    setProdutos(data);
  }, []);

  const fetchResponsaveis = useCallback(async () => {
    const data = await getAllResponsaveis();
    setResponsaveis(data);
    console.log("Responsáveis:", data);
  }, []);

  useEffect(() => {
    fetchProdutos();
    fetchResponsaveis();
  }, [fetchProdutos]);

  const [formData, setFormData] = useState({
    id_responsavel: "",
    id_beneficiario: "",
    id_doacao: "",
    nome: "",
    telefone: "",
    endereco: "",
    data_entrega: new Date().toISOString().split("T")[0],
    observacoes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      data_entrega: new Date(formData.data_entrega).toISOString(),

      observacoes: formData.observacoes,

      ...(beneficiarioTipo === "responsavel"
        ? { id_responsavel: parseInt(formData.id_responsavel) }
        : { id_beneficiario: parseInt(formData.id_beneficiario) }),

      produtos: produtosSelecionados.map((p) => ({
        id_produto: parseInt(p.id),
        quantidade: p.quantidade,
      })),

      id_beneficiario:
        beneficiarioTipo === "externo"
          ? BigInt(parseInt(formData.id_beneficiario))
          : null,

      id_doacao: null,
      ...(beneficiarioTipo === "responsavel"
        ? { id_responsavel: parseInt(formData.id_responsavel) }
        : {}),
    };

    try {
      await createCesta({
        ...payload,
      });
      onClose();

      showToast("success", "Cesta criada com sucesso.");
    } catch (error) {
      showToast(
        "danger",
        "Erro ao criar cesta: " +
          (typeof error === "object" && error !== null && "message" in error
            ? (error as { message?: string }).message
            : String(error))
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectResponsavel = (respId: string) => {
    const findResp = responsaveis.find(
      (resp) => resp.id_responsavel === respId
    );
    setResponsavelSelecionado(findResp || null);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 min-h-[60vh]">
        <div className="space-y-4">
          <label className="block text-sm font-medium mb-2">
            Tipo de Beneficiário
          </label>
          <select
            value={beneficiarioTipo}
            onChange={(e) =>
              setBeneficiarioTipo(e.target.value as "responsavel" | "externo")
            }
            className="w-full p-2 border rounded">
            <option value="responsavel">Responsável de Família</option>
            <option value="externo">Beneficiário Externo</option>
          </select>
          {beneficiarioTipo === "responsavel" ? (
            <div>
              <label className="block text-sm font-medium mb-2">
                Responsável
              </label>
              <select
                value={formData.id_responsavel}
                onChange={(e) => {
                  handleSelectResponsavel(e.target.value);

                  setFormData((prev) => ({
                    ...prev,
                    id_responsavel: e.target.value,
                  }));
                }}
                className="w-full p-2 border rounded  "
                required>
                <option value="" className="text-black">
                  Selecione um responsável
                </option>
                {responsaveis.map((resp: Responsavel) => (
                  <option
                    className="text-black"
                    key={resp.id_responsavel}
                    value={resp.id_responsavel}>
                    {resp.nome}
                  </option>
                ))}
              </select>
              {responsavelSelecionado && (
                <div className="pt-2">
                  <p className="text-sm text-gray-400">
                    Responsável vinculado à família{" "}
                    <strong>{responsavelSelecionado.familia.nome}</strong>
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium mb-2">
                Beneficiário Externo
              </label>
              <select
                value={formData.id_beneficiario}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    id_beneficiario: e.target.value,
                  }))
                }
                className="w-full p-2 border rounded"
                required>
                <option value="">Selecione um beneficiário</option>
                {beneficiariosExternos?.map((ben: any) => (
                  <option key={ben.id_beneficiario} value={ben.id_beneficiario}>
                    {ben.nome}
                  </option>
                ))}
              </select>
            </div>
          )}
          <InputField
            label="Data de Entrega"
            type="date"
            value={formData.data_entrega}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, data_entrega: e.target.value }))
            }
            required
          />

          <InputField
            label="Observações"
            value={formData.observacoes}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, observacoes: e.target.value }))
            }
          />
        </div>
        {/* Produtos */}
        <div className="space-y-4">
          <label className="block text-sm font-medium mb-2">Produtos</label>
          <div className="space-y-2 overflow-y-auto">
            {produtos.map((produto: Produto) => (
              <div
                key={produto.id_produto}
                className="flex items-center gap-2 p-2 border rounded">
                <input
                  type="checkbox"
                  checked={produtosSelecionados.some(
                    (p) => p.id === produto.id_produto
                  )}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setProdutosSelecionados((prev) => [
                        ...prev,
                        { id: produto.id_produto, quantidade: 1 },
                      ]);
                    } else {
                      setProdutosSelecionados((prev) =>
                        prev.filter((p) => p.id !== produto.id_produto)
                      );
                    }
                  }}
                />
                <span className="flex-1">{produto.nome}</span>
                {produtosSelecionados.some(
                  (p) => p.id === produto.id_produto
                ) && (
                  <input
                    type="number"
                    min="1"
                    className="w-20 p-1 border rounded"
                    value={
                      produtosSelecionados.find(
                        (p) => p.id === produto.id_produto
                      )?.quantidade || 1
                    }
                    onChange={(e) => {
                      setProdutosSelecionados((prev) =>
                        prev.map((p) =>
                          p.id === produto.id_produto
                            ? {
                                ...p,
                                quantidade: parseInt(e.target.value) || 1,
                              }
                            : p
                        )
                      );
                    }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-2 pt-4 h-min mt-auto lg:col-span-2">
          <Button
            text="Cancelar"
            variant="secondary"
            onClick={onClose}
            type="button"
          />
          <Button
            text="Criar Cesta"
            variant="primary"
            type="submit"
            disabled={isSubmitting}
          />
        </div>
      </div>
    </form>
  );
};
