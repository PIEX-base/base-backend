import type { Crianca } from "~/interfaces/crianca";

interface ModalDetalhesCriancaProps {
  crianca: Crianca | null;
}

const DetailItem: React.FC<{ label: string; value?: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div>
    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
      {label}
    </p>
    <p className="mt-1 text-md text-gray-900 dark:text-white">
      {value || "Não informado"}
    </p>
  </div>
);

export const ModalDetalhesCrianca: React.FC<ModalDetalhesCriancaProps> = ({
  crianca,
}) => {
  if (!crianca) return null;

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
        <DetailItem label="Nome Completo" value={crianca.nome} />
        <DetailItem label="Família" value={crianca.familia?.nome} />
        <DetailItem
          label="Data de Nascimento"
          value={new Date(crianca.data_nascimento).toLocaleDateString("pt-BR")}
        />
        <DetailItem label="RG" value={crianca.rg} />
        <DetailItem label="CPF" value={crianca.cpf} />
        <DetailItem label="Observações" value={crianca.observacoes} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border p-4 rounded-lg bg-gray-50 dark:bg-gray-700">
        <DetailItem
          label="Matriculada na Escola?"
          value={crianca.matriculada_escola ? "Sim" : "Não"}
        />
        {crianca.matriculada_escola && (
          <DetailItem label="Nome da Escola" value={crianca.nome_escola} />
        )}
      </div>
    </div>
  );
};
