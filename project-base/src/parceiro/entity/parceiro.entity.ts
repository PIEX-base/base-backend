import { Parceiro } from "@prisma/client";

export class ParceiroEntity implements Parceiro {
  id_parceiro: bigint;
  nome: string;
  tipo_pessoa: "fisica" | "juridica";
  documento: string | null;
  email: string | null;
  telefone: string | null;
  endereco: string | null;
  data_cadastro: Date;
}
