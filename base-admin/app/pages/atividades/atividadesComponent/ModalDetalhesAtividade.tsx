import { tipoAtividadeLabels } from "~/enums/atividades";
import type { Atividade } from "~/interfaces/atividade";

const DetailItem: React.FC<{ label: string; value: React.ReactNode }> = ({
  label,
  value,
}) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="mt-1 text-md text-white">{value || "-"}</p>
  </div>
);

interface ModalDetalhesAtividadeProps {
  atividade: Atividade;
}

export const ModalDetalhesAtividade: React.FC<ModalDetalhesAtividadeProps> = ({
  atividade,
}) => {
  const parseTipoAtividade = (tipo: keyof typeof tipoAtividadeLabels) => {
    return tipoAtividadeLabels[tipo];
  };

  return (
    <div className="space-y-4">
      <DetailItem label="Nome da Atividade" value={atividade.nome} />
      <DetailItem label="Descrição" value={atividade.descricao} />
      <DetailItem label="Tipo" value={parseTipoAtividade(atividade.tipo)} />
      <DetailItem label="Público Alvo" value={atividade.publico_alvo} />
      <DetailItem
        label="Dias da Semana"
        value={atividade.dias_semana
          .split(",")
          .map(
            (dia) =>
              ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][
                parseInt(dia, 10)
              ] || dia
          )
          .join(", ")}
      />
      <DetailItem
        label="Horário de Início"
        value={new Date(atividade.horario_inicio).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      />
      <DetailItem
        label="Horário de Fim"
        value={new Date(atividade.horario_fim).toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      />
    </div>
  );
};
