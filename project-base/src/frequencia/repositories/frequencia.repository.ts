import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { UpdateFrequenciaDto } from "../dto/update-frequencia.dto";
import { FrequenciaEntity } from "../entity/frequencia.entity";
import { Prisma } from "@prisma/client";

@Injectable()
export class FrequenciaRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<FrequenciaEntity[]> {
    return this.prisma.frequencia.findMany({
      include: {
        matricula: true,
      },
      orderBy: {
        data: "desc",
      },
    });
  }

  async findOne(id: bigint): Promise<FrequenciaEntity> {
    const frequencia = await this.prisma.frequencia.findUnique({
      where: { id_frequencia: id },
      include: {
        matricula: true,
      },
    });

    if (!frequencia) {
      throw new NotFoundException(`Frequência com ID ${id} não encontrada`);
    }

    return frequencia;
  }

  async create(frequenciaData: Prisma.FrequenciaCreateInput): Promise<FrequenciaEntity> {
    return this.prisma.frequencia.create({
      data: frequenciaData,
      include: {
        matricula: true,
      },
    });
  }

  async update(id: bigint, updateFrequenciaDto: UpdateFrequenciaDto): Promise<FrequenciaEntity> {
    // Verificar se a frequência existe
    await this.findOne(id);

    return this.prisma.frequencia.update({
      where: { id_frequencia: id },
      data: updateFrequenciaDto,
      include: {
        matricula: true,
      },
    });
  }

  async remove(id: bigint): Promise<FrequenciaEntity> {
    // Verificar se a frequência existe
    await this.findOne(id);

    return this.prisma.frequencia.delete({
      where: { id_frequencia: id },
    });
  }

  async findByPessoa(id_pessoa: bigint): Promise<FrequenciaEntity[]> {
    const pessoaExiste = await this.prisma.pessoa.findUnique({
      where: { id_pessoa },
    });

    if (!pessoaExiste) {
      throw new NotFoundException(`Pessoa com ID ${id_pessoa} não encontrada`);
    }

    return this.prisma.frequencia.findMany({
      where: {
        matricula: {
          id_pessoa: id_pessoa,
        },
      },
      include: {
        matricula: true,
      },
      orderBy: {
        data: "desc",
      },
    });
  }

  async findByAtividade(id_atividade: bigint): Promise<FrequenciaEntity[]> {
    const atividadeExiste = await this.prisma.atividade.findUnique({
      where: { id_atividade },
    });

    if (!atividadeExiste) {
      throw new NotFoundException(`Atividade com ID ${id_atividade} não encontrada`);
    }

    return this.prisma.frequencia.findMany({
      where: { matricula: { id_atividade } },
      include: {
        matricula: true,
      },
      orderBy: {
        data: "desc",
      },
    });
  }

  async findByPeriodo(dataInicio: Date, dataFim: Date): Promise<FrequenciaEntity[]> {
    return this.prisma.frequencia.findMany({
      where: {
        data: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
      include: {
        matricula: true,
      },
      orderBy: {
        data: "desc",
      },
    });
  }

  async findByPresenca(presenca: boolean): Promise<FrequenciaEntity[]> {
    return this.prisma.frequencia.findMany({
      where: { presenca },
      include: {
        matricula: true,
      },
      orderBy: {
        data: "desc",
      },
    });
  }
}
