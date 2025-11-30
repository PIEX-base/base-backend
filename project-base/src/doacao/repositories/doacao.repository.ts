import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { DoacaoEntity } from "../entity/doacao.entity";
import { UpdateDoacaoDto } from "../dto/update-doacao.dto";
import { Prisma, TipoDoacao } from "@prisma/client";

@Injectable()
export class DoacaoRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<DoacaoEntity[]> {
    return await this.prisma.doacao.findMany({
      include: {
        parceiro: true,
        itens_doados: true,
        cestas_geradas: true,
      },
      orderBy: {
        data_recebimento: "desc",
      },
    });
  }

  async findOne(id: bigint): Promise<DoacaoEntity> {
    const doacao = await this.prisma.doacao.findUnique({
      where: { id_doacao: id },
      include: {
        parceiro: true,
        itens_doados: true,
        cestas_geradas: true,
      },
    });

    if (!doacao) {
      throw new NotFoundException(`Doação com ID ${id} não encontrada`);
    }

    return doacao;
  }

  async create(doacaoData: Prisma.DoacaoCreateInput): Promise<DoacaoEntity> {
    return await this.prisma.doacao.create({
      data: doacaoData,
    });
  }

  async update(id: bigint, updateData: UpdateDoacaoDto): Promise<DoacaoEntity> {
    // Verificar se a doação existe
    await this.findOne(id);

    return await this.prisma.doacao.update({
      where: { id_doacao: id },
      data: {
        ...updateData,
        valor: updateData.valor ? updateData.valor : null,
      },
      include: {
        parceiro: true,
        itens_doados: true,
        cestas_geradas: true,
      },
    });
  }

  async remove(id: bigint): Promise<DoacaoEntity> {
    // Verificar se a doação existe
    await this.findOne(id);

    return this.prisma.doacao.delete({
      where: { id_doacao: id },
    });
  }

  async findByParceiro(id_parceiro: bigint): Promise<DoacaoEntity[]> {
    return await this.prisma.doacao.findMany({
      where: { id_parceiro },
      include: {
        parceiro: true,
        itens_doados: true,
        cestas_geradas: true,
      },
      orderBy: {
        data_recebimento: "desc",
      },
    });
  }

  async findByTipo(tipo: TipoDoacao): Promise<DoacaoEntity[]> {
    return await this.prisma.doacao.findMany({
      where: { tipo },
      include: {
        parceiro: true,
        itens_doados: true,
        cestas_geradas: true,
      },
      orderBy: {
        data_recebimento: "desc",
      },
    });
  }

  async findAnonimas(): Promise<DoacaoEntity[]> {
    return await this.prisma.doacao.findMany({
      where: { is_anonima: true },
      include: {
        parceiro: true,
        itens_doados: true,
        cestas_geradas: true,
      },
      orderBy: {
        data_recebimento: "desc",
      },
    });
  }
}
