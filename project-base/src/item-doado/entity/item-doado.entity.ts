export class ItemDoadoEntity {
  id_item: bigint;
  id_doacao: bigint;
  nome: string;
  quantidade: number;
  unidade_medida: string | null;

  constructor(partial: Partial<ItemDoadoEntity>) {
    Object.assign(this, partial);
  }
}
