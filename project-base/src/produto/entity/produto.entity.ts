import { Produto } from "@prisma/client";

export class ProdutoEntity implements Produto {
  id_produto: bigint;
  nome: string;
  descricao: string | null;
  is_basico: boolean;
  unidade_medida: string | null;
}
