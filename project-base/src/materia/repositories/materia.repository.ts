import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { UpdateMateriaDto } from "../dto/update-materia.dto";
import { MateriaEntity } from "../entity/materia.entity";
import { Prisma } from "@prisma/client";

@Injectable()
export class MateriaRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<MateriaEntity[]> {
    return this.prisma.materia.findMany({
      include: {
        atividade: true,
      },
      orderBy: {
        nome: "asc",
      },
    });
  }

  async findOne(id: bigint): Promise<MateriaEntity> {
    const materia = await this.prisma.materia.findUnique({
      where: { id_materia: id },
      include: {
        atividade: true,
      },
    });

    if (!materia) {
      throw new NotFoundException(`Matéria com ID ${id} não encontrada`);
    }

    return materia;
  }

  async create(materiaData: Prisma.MateriaCreateInput): Promise<MateriaEntity> {
    return this.prisma.materia.create({
      data: materiaData,
      include: {
        atividade: true,
      },
    });
  }

  async update(id: bigint, updateMateriaDto: UpdateMateriaDto): Promise<MateriaEntity> {
    // Verificar se a matéria existe
    await this.findOne(id);

    return this.prisma.materia.update({
      where: { id_materia: id },
      data: updateMateriaDto,
      include: {
        atividade: true,
      },
    });
  }

  async remove(id: bigint): Promise<MateriaEntity> {
    // Verificar se a matéria existe
    await this.findOne(id);

    return this.prisma.materia.delete({
      where: { id_materia: id },
    });
  }

  async findByAtividade(id_atividade: bigint): Promise<MateriaEntity[]> {
    const atividadeExiste = await this.prisma.atividade.findUnique({
      where: { id_atividade },
    });

    if (!atividadeExiste) {
      throw new NotFoundException(`Atividade com ID ${id_atividade} não encontrada`);
    }

    return this.prisma.materia.findMany({
      where: { id_atividade },
      include: {
        atividade: true,
      },
      orderBy: {
        nome: "asc",
      },
    });
  }

  async findByNome(nome: string): Promise<MateriaEntity[]> {
    return this.prisma.materia.findMany({
      where: {
        nome: {
          contains: nome,
          mode: "insensitive",
        },
      },
      include: {
        atividade: true,
      },
      orderBy: {
        nome: "asc",
      },
    });
  }

  async findByTipoAtividade(tipo: string): Promise<MateriaEntity[]> {
    return this.prisma.materia.findMany({
      where: {
        atividade: {
          tipo: tipo as any,
        },
      },
      include: {
        atividade: true,
      },
      orderBy: {
        nome: "asc",
      },
    });
  }
}
