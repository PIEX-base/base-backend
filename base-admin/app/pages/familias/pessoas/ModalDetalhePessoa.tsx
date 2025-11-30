import type { ModalDetalhesPessoaProps } from "~/interfaces/pessoa";

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="mt-1 text-md text-white">{value || "-"}</p>
  </div>
);

export const ModalDetalhesPessoa: React.FC<ModalDetalhesPessoaProps> = ({
  pessoa,
}) => {
  return (
    <div className="space-y-4">
      {pessoa.foto_url && (
        <div className="flex justify-center pb-4">
          <img
            src={pessoa.foto_url}
            alt={`Foto de ${pessoa.nome}`}
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-200 shadow-sm"
          />
        </div>
      )}
      <DetailItem label="Nome Completo" value={pessoa.nome} />
      <DetailItem label="CPF" value={pessoa.cpf} />
      <DetailItem label="RG" value={pessoa.rg} />
      <DetailItem
        label="Data de Nascimento"
        value={new Date(pessoa.data_nascimento).toLocaleDateString("pt-BR", {
          timeZone: "UTC",
        })}
      />
      <DetailItem label="Família" value={pessoa.familia?.nome} />
      <DetailItem label="Observações" value={pessoa.observacoes} />
    </div>
  );
};
