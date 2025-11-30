import { ProdutoCesta } from "@prisma/client";

export class ProdutoCestaEntity implements ProdutoCesta {
  id_produto_cesta: bigint;
  id_cesta: bigint;
  id_produto: bigint;
  quantidade: number;
}
