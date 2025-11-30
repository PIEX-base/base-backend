export enum StatusMatricula {
  ATIVA = "ATIVA",
  INATIVA = "INATIVA",
  CONCLUIDA = "CONCLUIDA",
}

export const statusMatriculaOptions = [
  { value: StatusMatricula.ATIVA, label: "Ativa" },
  { value: StatusMatricula.INATIVA, label: "Inativa" },
  { value: StatusMatricula.CONCLUIDA, label: "Concluída" },
];

export const statusMatriculaBadge: Record<StatusMatricula, string> = {
  [StatusMatricula.ATIVA]: "bg-green-100 text-green-800",
  [StatusMatricula.INATIVA]: "bg-red-100 text-red-800",
  [StatusMatricula.CONCLUIDA]: "bg-blue-100 text-blue-800",
};
