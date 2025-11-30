import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { UpdateCestaBasicaDto } from "../dto/update-cestabasica.dto";
import { CestaBasicaEntity } from "../entity/cestabasica.entity";
import { Prisma } from "@prisma/client";
import { CreateProdutoCestaDto } from "../dto/create-cestabasica.dto";

@Injectable()
export class CestaBasicaRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<CestaBasicaEntity[]> {
    return await this.prisma.cestaBasica.findMany({
      orderBy: {
        data_entrega: "desc",
      },
      include: {
        responsavel: true,
        beneficiario_externo: true,
        doacao_origem: true,
        produtos: {
          include: {
            produto: true,
          },
        },
      },
    });
  }

  async findOne(id: bigint): Promise<CestaBasicaEntity> {
    const cestaBasica = await this.prisma.cestaBasica.findUnique({
      where: { id_cesta: id },
      include: {
        responsavel: true,
        beneficiario_externo: true,
        doacao_origem: true,
        produtos: {
          include: {
            produto: true,
          },
        },
      },
    });

    if (!cestaBasica) {
      throw new NotFoundException(`Cesta Básica com ID ${id} não encontrada`);
    }

    return cestaBasica;
  }

  async create(
    cestaBasicaData: Prisma.CestaBasicaCreateInput,
    produtos?: CreateProdutoCestaDto[],
  ): Promise<CestaBasicaEntity> {
    const cestaBasica = await this.prisma.cestaBasica.create({
      data: cestaBasicaData,
      include: {
        responsavel: true,
        beneficiario_externo: true,
        doacao_origem: true,
      },
    });

    // Se há produtos, adiciona-os à cesta
    if (produtos && produtos.length > 0) {
      await this.prisma.produtoCesta.createMany({
        data: produtos.map(produto => ({
          id_produto_cesta: BigInt(Date.now() + Math.floor(Math.random() * 1000)),
          id_cesta: cestaBasica.id_cesta,
          id_produto: BigInt(produto.id_produto),
          quantidade: produto.quantidade,
        })),
      });
    }

    // Retorna a cesta com os produtos adicionados
    return this.findOne(cestaBasica.id_cesta);
  }

  async update(id: bigint, updateData: UpdateCestaBasicaDto): Promise<CestaBasicaEntity> {
    // Verificar se a cesta básica existe
    await this.findOne(id);

    // Extrai os produtos do DTO
    const { produtos, ...cestaData } = updateData;

    // Atualiza a cesta básica
    await this.prisma.cestaBasica.update({
      where: { id_cesta: id },
      data: cestaData,
    });

    // Se há produtos para atualizar
    if (produtos && produtos.length > 0) {
      // Remove todos os produtos atuais
      await this.prisma.produtoCesta.deleteMany({
        where: { id_cesta: id },
      });

      // Adiciona os novos produtos
      for (const produto of produtos) {
        await this.addProduto(id, produto);
      }
    }

    // Retorna a cesta atualizada
    return this.findOne(id);
  }

  async remove(id: bigint): Promise<CestaBasicaEntity> {
    // Verificar se a cesta básica existe
    await this.findOne(id);

    // Remove todos os produtos relacionados à cesta
    await this.prisma.produtoCesta.deleteMany({
      where: { id_cesta: id },
    });

    // Remove a cesta básica
    return this.prisma.cestaBasica.delete({
      where: { id_cesta: id },
    });
  }

  async findByResponsavel(id_responsavel: bigint): Promise<CestaBasicaEntity[]> {
    return await this.prisma.cestaBasica.findMany({
      where: { id_responsavel },
      include: {
        responsavel: {
          include: {
            familia: true,
          },
        },
        beneficiario_externo: true,
        doacao_origem: true,
        produtos: {
          include: {
            produto: true,
          },
        },
      },
      orderBy: {
        data_entrega: "desc",
      },
    });
  }

  async findByBeneficiario(id_beneficiario: bigint): Promise<CestaBasicaEntity[]> {
    return await this.prisma.cestaBasica.findMany({
      where: { id_beneficiario },
      include: {
        responsavel: true,
        beneficiario_externo: true,
        doacao_origem: true,
        produtos: {
          include: {
            produto: true,
          },
        },
      },
      orderBy: {
        data_entrega: "desc",
      },
    });
  }

  async findByDoacao(id_doacao: bigint): Promise<CestaBasicaEntity[]> {
    return await this.prisma.cestaBasica.findMany({
      where: { id_doacao },
      include: {
        responsavel: true,
        beneficiario_externo: true,
        doacao_origem: true,
        produtos: {
          include: {
            produto: true,
          },
        },
      },
      orderBy: {
        data_entrega: "desc",
      },
    });
  }

  async findByPeriodo(dataInicio: Date, dataFim: Date): Promise<CestaBasicaEntity[]> {
    return await this.prisma.cestaBasica.findMany({
      where: {
        data_entrega: {
          gte: dataInicio,
          lte: dataFim,
        },
      },
      include: {
        responsavel: true,
        beneficiario_externo: true,
        doacao_origem: true,
        produtos: {
          include: {
            produto: true,
          },
        },
      },
      orderBy: {
        data_entrega: "desc",
      },
    });
  }

  private async addProduto(id_cesta: bigint, produto: CreateProdutoCestaDto): Promise<void> {
    const id = BigInt(Date.now() + Math.floor(Math.random() * 1000));
    await this.prisma.produtoCesta.create({
      data: {
        id_produto_cesta: id,
        id_cesta,
        id_produto: BigInt(produto.id_produto),
        quantidade: produto.quantidade,
      },
    });
  }
}
