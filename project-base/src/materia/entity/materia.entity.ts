import { Materia } from "@prisma/client";

export class MateriaEntity implements Materia {
  id_materia: bigint;
  id_atividade: bigint;
  nome: string;
  descricao: string | null;
}
