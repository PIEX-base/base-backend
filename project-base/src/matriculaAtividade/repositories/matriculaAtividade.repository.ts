import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { Prisma } from "@prisma/client";
import { UpdateMatriculaAtividadeDto } from "../dto/update-matriculaAtividade.dto";
import { MatriculaAtividadeEntity } from "../entity/matriculaAtividade.entity";

@Injectable()
export class MatriculaAtividadeRepository {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.MatriculaAtividadeCreateInput): Promise<MatriculaAtividadeEntity> {
    return await this.prisma.matriculaAtividade.create({
      data,
      include: { pessoa: true, atividade: true, crianca: true },
    });
  }

  async findAll(): Promise<MatriculaAtividadeEntity[]> {
    return await this.prisma.matriculaAtividade.findMany({
      include: { pessoa: true, atividade: true, crianca: true },
      orderBy: { data_matricula: "desc" },
    });
  }

  async findOne(id: bigint): Promise<MatriculaAtividadeEntity> {
    const matricula = await this.prisma.matriculaAtividade.findUnique({
      where: { id_matricula: id },
      include: { pessoa: true, atividade: true },
    });
    if (!matricula) {
      throw new NotFoundException(`Matrícula com ID ${id} não encontrada.`);
    }
    return matricula;
  }

  async update(id: bigint, data: UpdateMatriculaAtividadeDto): Promise<MatriculaAtividadeEntity> {
    await this.findOne(id);
    return this.prisma.matriculaAtividade.update({
      where: { id_matricula: id },
      data,
      include: { pessoa: true, atividade: true },
    });
  }

  async remove(id: bigint): Promise<MatriculaAtividadeEntity> {
    await this.findOne(id);
    return this.prisma.matriculaAtividade.delete({
      where: { id_matricula: id },
    });
  }

  async findByPessoa(id_pessoa: bigint): Promise<MatriculaAtividadeEntity[]> {
    return await this.prisma.matriculaAtividade.findMany({
      where: { id_pessoa },
      include: { atividade: true },
    });
  }

  async findByAtividade(id_atividade: bigint): Promise<MatriculaAtividadeEntity[]> {
    return await this.prisma.matriculaAtividade.findMany({
      where: { id_atividade },
      include: { pessoa: true },
    });
  }
}
