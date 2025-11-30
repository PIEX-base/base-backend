import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { ItemDoadoEntity } from "../entity/item-doado.entity";
import { CreateItemDoadoDto } from "../dto/create-item-doado.dto";
import { UpdateItemDoadoDto } from "../dto/update-item-doado.dto";

@Injectable()
export class ItemDoadoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateItemDoadoDto & { id_item: bigint }): Promise<ItemDoadoEntity> {
    const item = await this.prisma.itemDoado.create({
      data,
      include: {
        doacao: true,
      },
    });

    return new ItemDoadoEntity(item);
  }

  async findAll(): Promise<ItemDoadoEntity[]> {
    const itens = await this.prisma.itemDoado.findMany({
      include: {
        doacao: true,
      },
      orderBy: {
        nome: "asc",
      },
    });

    return itens.map(item => new ItemDoadoEntity(item));
  }

  async findOne(id: bigint): Promise<ItemDoadoEntity | null> {
    const item = await this.prisma.itemDoado.findUnique({
      where: { id_item: id },
      include: {
        doacao: true,
      },
    });

    if (!item) {
      return null;
    }

    return new ItemDoadoEntity(item);
  }

  async update(id: bigint, data: UpdateItemDoadoDto): Promise<ItemDoadoEntity> {
    const item = await this.prisma.itemDoado.update({
      where: { id_item: id },
      data,
      include: {
        doacao: true,
      },
    });

    return new ItemDoadoEntity(item);
  }

  async remove(id: bigint): Promise<ItemDoadoEntity> {
    const item = await this.prisma.itemDoado.delete({
      where: { id_item: id },
      include: {
        doacao: true,
      },
    });

    return new ItemDoadoEntity(item);
  }

  async findByDoacao(id_doacao: bigint): Promise<ItemDoadoEntity[]> {
    const itens = await this.prisma.itemDoado.findMany({
      where: { id_doacao },
      include: {
        doacao: true,
      },
      orderBy: {
        nome: "asc",
      },
    });

    return itens.map(item => new ItemDoadoEntity(item));
  }

  async findByNome(nome: string): Promise<ItemDoadoEntity[]> {
    const itens = await this.prisma.itemDoado.findMany({
      where: {
        nome: {
          contains: nome,
          mode: "insensitive",
        },
      },
      include: {
        doacao: true,
      },
      orderBy: {
        nome: "asc",
      },
    });

    return itens.map(item => new ItemDoadoEntity(item));
  }
}
