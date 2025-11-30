import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { UpdateServicoPrestadoDto } from "../dto/update-servico-prestado.dto";
import { ServicoPrestadoEntity } from "../entity/servico-prestado.entity";
import { Prisma } from "@prisma/client";

@Injectable()
export class ServicoPrestadoRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<ServicoPrestadoEntity[]> {
    return this.prisma.servicoPrestado.findMany({
      include: {
        parceiro: true,
      },
      orderBy: {
        data_inicio: "desc",
      },
    });
  }

  async findOne(id: bigint): Promise<ServicoPrestadoEntity> {
    const servicoPrestado = await this.prisma.servicoPrestado.findUnique({
      where: { id_servico: id },
      include: {
        parceiro: true,
      },
    });

    if (!servicoPrestado) {
      throw new NotFoundException(`Serviço prestado com ID ${id} não encontrado`);
    }

    return servicoPrestado;
  }

  async create(servicoPrestadoData: Prisma.ServicoPrestadoCreateInput): Promise<ServicoPrestadoEntity> {
    return this.prisma.servicoPrestado.create({
      data: servicoPrestadoData,
      include: {
        parceiro: true,
      },
    });
  }

  async update(id: bigint, updateServicoPrestadoDto: UpdateServicoPrestadoDto): Promise<ServicoPrestadoEntity> {
    // Verificar se o serviço prestado existe
    await this.findOne(id);

    return this.prisma.servicoPrestado.update({
      where: { id_servico: id },
      data: updateServicoPrestadoDto,
      include: {
        parceiro: true,
      },
    });
  }

  async remove(id: bigint): Promise<ServicoPrestadoEntity> {
    // Verificar se o serviço prestado existe
    await this.findOne(id);

    return this.prisma.servicoPrestado.delete({
      where: { id_servico: id },
    });
  }

  async findByParceiro(id_parceiro: bigint): Promise<ServicoPrestadoEntity[]> {
    return this.prisma.servicoPrestado.findMany({
      where: { id_parceiro },
      include: {
        parceiro: true,
      },
      orderBy: {
        data_inicio: "desc",
      },
    });
  }

  async findByPeriodo(dataInicio: Date, dataFim: Date): Promise<ServicoPrestadoEntity[]> {
    return this.prisma.servicoPrestado.findMany({
      where: {
        data_inicio: {
          gte: dataInicio,
        },
        data_fim: {
          lte: dataFim,
        },
      },
      include: {
        parceiro: true,
      },
      orderBy: {
        data_inicio: "desc",
      },
    });
  }

  async findServicosEmAndamento(): Promise<ServicoPrestadoEntity[]> {
    return this.prisma.servicoPrestado.findMany({
      where: {
        data_fim: null,
      },
      include: {
        parceiro: true,
      },
      orderBy: {
        data_inicio: "desc",
      },
    });
  }

  async findByDescricao(descricao: string): Promise<ServicoPrestadoEntity[]> {
    return this.prisma.servicoPrestado.findMany({
      where: {
        descricao: {
          contains: descricao,
          mode: "insensitive",
        },
      },
      include: {
        parceiro: true,
      },
      orderBy: {
        data_inicio: "desc",
      },
    });
  }
}
