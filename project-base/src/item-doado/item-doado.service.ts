import { Injectable, NotFoundException } from "@nestjs/common";
import { ItemDoadoRepository } from "./repositories/item-doado.repositories";
import { CreateItemDoadoDto } from "./dto/create-item-doado.dto";
import { UpdateItemDoadoDto } from "./dto/update-item-doado.dto";
import { SnowflakeService } from "../snowflake/snowflake.service";

@Injectable()
export class ItemDoadoService {
  constructor(
    private readonly repository: ItemDoadoRepository,
    private readonly snowflakeService: SnowflakeService,
  ) {}

  async create(createItemDoadoDto: CreateItemDoadoDto) {
    const id = this.snowflakeService.generate();

    const itemData = {
      ...createItemDoadoDto,
      id_item: id,
    };

    return this.repository.create(itemData);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: bigint) {
    const item = await this.repository.findOne(id);

    if (!item) {
      throw new NotFoundException(`Item doado com ID ${id} não encontrado`);
    }

    return item;
  }

  async update(id: bigint, updateItemDoadoDto: UpdateItemDoadoDto) {
    // Verificar se o item existe
    await this.findOne(id);

    return this.repository.update(id, updateItemDoadoDto);
  }

  async remove(id: bigint) {
    // Verificar se o item existe
    await this.findOne(id);

    return this.repository.remove(id);
  }

  async findByDoacao(id_doacao: bigint) {
    return this.repository.findByDoacao(id_doacao);
  }

  async findByNome(nome: string) {
    return this.repository.findByNome(nome);
  }
}
