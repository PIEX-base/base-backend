import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { UpdateProdutoCestaDto } from "../dto/update-produto-cesta.dto";
import { ProdutoCestaEntity } from "../entity/produto-cesta.entity";
import { Prisma } from "@prisma/client";

@Injectable()
export class ProdutoCestaRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<ProdutoCestaEntity[]> {
    return this.prisma.produtoCesta.findMany({
      include: {
        cesta: true,
        produto: true,
      },
      orderBy: {
        id_cesta: "asc",
      },
    });
  }

  async findOne(id: bigint): Promise<ProdutoCestaEntity> {
    const produtoCesta = await this.prisma.produtoCesta.findUnique({
      where: { id_produto_cesta: id },
      include: {
        cesta: true,
        produto: true,
      },
    });

    if (!produtoCesta) {
      throw new NotFoundException(`Produto na cesta com ID ${id} não encontrado`);
    }

    return produtoCesta;
  }

  async create(produtoCestaData: Prisma.ProdutoCestaCreateInput): Promise<ProdutoCestaEntity> {
    return this.prisma.produtoCesta.create({
      data: produtoCestaData,
      include: {
        cesta: true,
        produto: true,
      },
    });
  }

  async update(id: bigint, updateProdutoCestaDto: UpdateProdutoCestaDto): Promise<ProdutoCestaEntity> {
    // Verificar se o produto-cesta existe
    await this.findOne(id);

    return this.prisma.produtoCesta.update({
      where: { id_produto_cesta: id },
      data: updateProdutoCestaDto,
      include: {
        cesta: true,
        produto: true,
      },
    });
  }

  async remove(id: bigint): Promise<ProdutoCestaEntity> {
    // Verificar se o produto-cesta existe
    await this.findOne(id);

    return this.prisma.produtoCesta.delete({
      where: { id_produto_cesta: id },
    });
  }

  async findByCesta(id_cesta: bigint): Promise<ProdutoCestaEntity[]> {
    return this.prisma.produtoCesta.findMany({
      where: { id_cesta },
      include: {
        cesta: true,
        produto: true,
      },
      orderBy: {
        id_produto: "asc",
      },
    });
  }

  async findByProduto(id_produto: bigint): Promise<ProdutoCestaEntity[]> {
    return this.prisma.produtoCesta.findMany({
      where: { id_produto },
      include: {
        cesta: true,
        produto: true,
      },
      orderBy: {
        id_cesta: "asc",
      },
    });
  }

  async findByProdutoAndCesta(id_produto: bigint, id_cesta: bigint): Promise<ProdutoCestaEntity | null> {
    return this.prisma.produtoCesta.findFirst({
      where: {
        id_produto,
        id_cesta,
      },
      include: {
        cesta: true,
        produto: true,
      },
    });
  }

  async findByQuantidadeMinima(quantidade: number): Promise<ProdutoCestaEntity[]> {
    return this.prisma.produtoCesta.findMany({
      where: {
        quantidade: {
          gte: quantidade,
        },
      },
      include: {
        cesta: true,
        produto: true,
      },
      orderBy: {
        quantidade: "desc",
      },
    });
  }
}
