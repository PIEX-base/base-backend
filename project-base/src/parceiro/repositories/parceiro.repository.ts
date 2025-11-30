import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { UpdateParceiroDto } from "../dto/update-parceiro.dto";
import { ParceiroEntity } from "../entity/parceiro.entity";
import { Prisma, TipoPessoa } from "@prisma/client";

@Injectable()
export class ParceiroRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<ParceiroEntity[]> {
    return this.prisma.parceiro.findMany({
      include: {
        doacoes: true,
        servicosPrestados: true,
      },
      orderBy: {
        nome: "asc",
      },
    });
  }

  async findOne(id: bigint): Promise<ParceiroEntity> {
    const parceiro = await this.prisma.parceiro.findUnique({
      where: { id_parceiro: id },
      include: {
        doacoes: true,
        servicosPrestados: true,
      },
    });

    if (!parceiro) {
      throw new NotFoundException(`Parceiro com ID ${id} não encontrado`);
    }

    return parceiro;
  }

  async create(parceiroData: Prisma.ParceiroCreateInput): Promise<ParceiroEntity> {
    return this.prisma.parceiro.create({
      data: parceiroData,
      include: {
        doacoes: true,
        servicosPrestados: true,
      },
    });
  }

  async update(id: bigint, updateParceiroDto: UpdateParceiroDto): Promise<ParceiroEntity> {
    // Verificar se o parceiro existe
    await this.findOne(id);

    return this.prisma.parceiro.update({
      where: { id_parceiro: id },
      data: updateParceiroDto,
      include: {
        doacoes: true,
        servicosPrestados: true,
      },
    });
  }

  async remove(id: bigint): Promise<ParceiroEntity> {
    // Verificar se o parceiro existe
    await this.findOne(id);

    return this.prisma.parceiro.delete({
      where: { id_parceiro: id },
    });
  }

  async findByTipoPessoa(tipo_pessoa: TipoPessoa): Promise<ParceiroEntity[]> {
    return this.prisma.parceiro.findMany({
      where: { tipo_pessoa },
      include: {
        doacoes: true,
        servicosPrestados: true,
      },
      orderBy: {
        nome: "asc",
      },
    });
  }

  async findByDocumento(documento: string): Promise<ParceiroEntity[]> {
    return this.prisma.parceiro.findMany({
      where: {
        documento: {
          contains: documento,
          mode: "insensitive",
        },
      },
      include: {
        doacoes: true,
        servicosPrestados: true,
      },
    });
  }

  async findByNome(nome: string): Promise<ParceiroEntity[]> {
    return this.prisma.parceiro.findMany({
      where: {
        nome: {
          contains: nome,
          mode: "insensitive",
        },
      },
      include: {
        doacoes: true,
        servicosPrestados: true,
      },
      orderBy: {
        nome: "asc",
      },
    });
  }

  async findByPeriodo(dataInicio: Date, dataFim: Date): Promise<ParceiroEntity[]> {
    return this.prisma.parceiro.findMany({
      where: {
        data_cadastro: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
      include: {
        doacoes: true,
        servicosPrestados: true,
      },
      orderBy: {
        data_cadastro: "desc",
      },
    });
  }

  async findComDoacoes(): Promise<ParceiroEntity[]> {
    return this.prisma.parceiro.findMany({
      where: {
        doacoes: {
          some: {},
        },
      },
      include: {
        doacoes: true,
        servicosPrestados: true,
      },
      orderBy: {
        nome: "asc",
      },
    });
  }

  async findComServicos(): Promise<ParceiroEntity[]> {
    return this.prisma.parceiro.findMany({
      where: {
        servicosPrestados: {
          some: {},
        },
      },
      include: {
        doacoes: true,
        servicosPrestados: true,
      },
      orderBy: {
        nome: "asc",
      },
    });
  }
}
