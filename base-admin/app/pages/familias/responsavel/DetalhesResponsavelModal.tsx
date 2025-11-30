import type { Responsavel } from "~/interfaces/responsavel";

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="mt-1 text-md text-white">{value || "-"}</p>
  </div>
);

interface ModalDetalhesProps {
  responsavel: Responsavel;
}

export const ModalDetalhesResponsavel: React.FC<ModalDetalhesProps> = ({
  responsavel,
}) => {
  return (
    <div className="space-y-4">
      {responsavel.foto_url && (
        <div className="flex justify-center pb-4">
          <img
            src={responsavel.foto_url}
            alt={`Foto de ${responsavel.nome}`}
            className="w-32 h-32 rounded-full object-cover border-2 border-gray-200 shadow-sm"
          />
        </div>
      )}
      <DetailItem label="Nome Completo" value={responsavel.nome} />{" "}
      <DetailItem label="Família" value={responsavel.familia?.nome} />
      <DetailItem label="CPF" value={responsavel.cpf} />
      <DetailItem label="RG" value={responsavel.rg} />
      <DetailItem
        label="Data de Nascimento"
        value={new Date(responsavel.data_nascimento).toLocaleDateString(
          "pt-BR",
          { timeZone: "UTC" }
        )}
      />
      <DetailItem label="Telefone" value={responsavel.telefone} />
      <DetailItem label="Email" value={responsavel.email} />
      <DetailItem label="Ocupação" value={responsavel.ocupacao} />
      <DetailItem label="Endereço" value={responsavel.endereco} />
    </div>
  );
};
