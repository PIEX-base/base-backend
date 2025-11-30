import { Doacao, TipoDoacao } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export class DoacaoEntity implements Doacao {
  id_doacao: bigint;
  id_parceiro: bigint | null;
  tipo: TipoDoacao;
  valor: Decimal | null;
  descricao: string;
  data_recebimento: Date;
  comprovante_url: string | null;
  is_anonima: boolean;
}
