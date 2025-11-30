import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { BeneficiarioExternoEntity } from "../entity/beneficiario-externo.entity";
import { CreateBeneficiarioExternoDto } from "../dto/create-beneficiario-externo.dto";
import { UpdateBeneficiarioExternoDto } from "../dto/update-beneficiario-externo.dto";

@Injectable()
export class BeneficiarioExternoRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<BeneficiarioExternoEntity[]> {
    return await this.prisma.beneficiarioExterno.findMany({
      orderBy: {
        nome: "asc",
      },
    });
  }

  async findOne(id: bigint): Promise<BeneficiarioExternoEntity> {
    const beneficiarioExterno = await this.prisma.beneficiarioExterno.findUnique({
      where: { id_beneficiario: id },
    });

    if (!beneficiarioExterno) {
      throw new NotFoundException(`Beneficiário Externo com ID ${id} não encontrado`);
    }

    return beneficiarioExterno;
  }

  async create(data: CreateBeneficiarioExternoDto & { id_beneficiario: bigint }): Promise<BeneficiarioExternoEntity> {
    return await this.prisma.beneficiarioExterno.create({
      data,
    });
  }

  async update(id: bigint, data: UpdateBeneficiarioExternoDto): Promise<BeneficiarioExternoEntity> {
    // Verificar se o beneficiário externo existe
    await this.findOne(id);

    return await this.prisma.beneficiarioExterno.update({
      where: { id_beneficiario: id },
      data,
    });
  }

  async remove(id: bigint): Promise<BeneficiarioExternoEntity> {
    // Verificar se o beneficiário externo existe
    await this.findOne(id);

    return await this.prisma.beneficiarioExterno.delete({
      where: { id_beneficiario: id },
    });
  }

  async findByNome(nome: string): Promise<BeneficiarioExternoEntity[]> {
    return await this.prisma.beneficiarioExterno.findMany({
      where: {
        nome: {
          contains: nome,
          mode: "insensitive",
        },
      },
      orderBy: {
        nome: "asc",
      },
    });
  }
}
