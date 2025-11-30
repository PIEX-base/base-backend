import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { UpdateProdutoDto } from "../dto/update-produto.dto";
import { ProdutoEntity } from "../entity/produto.entity";
import { Prisma } from "@prisma/client";

@Injectable()
export class ProdutoRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<ProdutoEntity[]> {
    return this.prisma.produto.findMany({
      include: {
        produtos_cesta: true,
      },
      orderBy: {
        nome: "asc",
      },
    });
  }

  async findOne(id: bigint): Promise<ProdutoEntity> {
    const produto = await this.prisma.produto.findUnique({
      where: { id_produto: id },
      include: {
        produtos_cesta: true,
      },
    });

    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }

    return produto;
  }

  async create(produtoData: Prisma.ProdutoCreateInput): Promise<ProdutoEntity> {
    return this.prisma.produto.create({
      data: produtoData,
      include: {
        produtos_cesta: true,
      },
    });
  }

  async update(id: bigint, updateProdutoDto: UpdateProdutoDto): Promise<ProdutoEntity> {
    // Verificar se o produto existe
    await this.findOne(id);

    return this.prisma.produto.update({
      where: { id_produto: id },
      data: updateProdutoDto,
      include: {
        produtos_cesta: true,
      },
    });
  }

  async remove(id: bigint): Promise<ProdutoEntity> {
    // Verificar se o produto existe
    await this.findOne(id);

    return this.prisma.produto.delete({
      where: { id_produto: id },
    });
  }

  async findByNome(nome: string): Promise<ProdutoEntity[]> {
    return this.prisma.produto.findMany({
      where: {
        nome: {
          contains: nome,
          mode: "insensitive",
        },
      },
      include: {
        produtos_cesta: true,
      },
      orderBy: {
        nome: "asc",
      },
    });
  }

  async findByDescricao(descricao: string): Promise<ProdutoEntity[]> {
    return this.prisma.produto.findMany({
      where: {
        descricao: {
          contains: descricao,
          mode: "insensitive",
        },
      },
      include: {
        produtos_cesta: true,
      },
      orderBy: {
        nome: "asc",
      },
    });
  }

  async findBasicos(isBasico: boolean): Promise<ProdutoEntity[]> {
    return this.prisma.produto.findMany({
      where: { is_basico: isBasico },
      include: {
        produtos_cesta: true,
      },
      orderBy: {
        nome: "asc",
      },
    });
  }

  async findByUnidadeMedida(unidadeMedida: string): Promise<ProdutoEntity[]> {
    return this.prisma.produto.findMany({
      where: {
        unidade_medida: {
          contains: unidadeMedida,
          mode: "insensitive",
        },
      },
      include: {
        produtos_cesta: true,
      },
      orderBy: {
        nome: "asc",
      },
    });
  }

  async findProdutosEmCestas(): Promise<ProdutoEntity[]> {
    return this.prisma.produto.findMany({
      where: {
        produtos_cesta: {
          some: {},
        },
      },
      include: {
        produtos_cesta: true,
      },
      orderBy: {
        nome: "asc",
      },
    });
  }
}
