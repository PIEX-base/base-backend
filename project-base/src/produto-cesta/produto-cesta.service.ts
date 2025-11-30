import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { ProdutoCestaRepository } from "./repositories/produto-cesta.respository";
import { CreateProdutoCestaDto } from "./dto/create-produto-cesta.dto";
import { UpdateProdutoCestaDto } from "./dto/update-produto-cesta.dto";
import { Prisma } from "@prisma/client";
import { SnowflakeService } from "../snowflake/snowflake.service";

@Injectable()
export class ProdutoCestaService {
  constructor(
    private readonly repository: ProdutoCestaRepository,
    private readonly snowflakeService: SnowflakeService,
  ) {}

  async create(createProdutoCestaDto: CreateProdutoCestaDto) {
    // Verificar se já existe o mesmo produto na mesma cesta
    const existente = await this.repository.findByProdutoAndCesta(
      BigInt(createProdutoCestaDto.id_produto),
      BigInt(createProdutoCestaDto.id_cesta),
    );

    if (existente) {
      throw new ConflictException(
        `Este produto já está adicionado a esta cesta. Use update para alterar a quantidade.`,
      );
    }

    const id = this.snowflakeService.generate();

    const produtoCestaData: Prisma.ProdutoCestaCreateInput = {
      id_produto_cesta: id,
      quantidade: createProdutoCestaDto.quantidade,
      cesta: {
        connect: {
          id_cesta: BigInt(createProdutoCestaDto.id_cesta),
        },
      },
      produto: {
        connect: {
          id_produto: BigInt(createProdutoCestaDto.id_produto),
        },
      },
    };

    return this.repository.create(produtoCestaData);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: bigint) {
    return this.repository.findOne(id);
  }

  async update(id: bigint, updateProdutoCestaDto: UpdateProdutoCestaDto) {
    // Se está tentando alterar o produto ou a cesta, verificar se não há conflito
    if (updateProdutoCestaDto.id_produto && updateProdutoCestaDto.id_cesta) {
      const existente = await this.repository.findByProdutoAndCesta(
        BigInt(updateProdutoCestaDto.id_produto),
        BigInt(updateProdutoCestaDto.id_cesta),
      );

      if (existente && existente.id_produto_cesta !== id) {
        throw new ConflictException(`Este produto já está adicionado a esta cesta.`);
      }
    }

    return this.repository.update(id, updateProdutoCestaDto);
  }

  async remove(id: bigint) {
    return this.repository.remove(id);
  }

  async findByCesta(id_cesta: bigint) {
    return this.repository.findByCesta(id_cesta);
  }

  async findByProduto(id_produto: bigint) {
    return this.repository.findByProduto(id_produto);
  }

  async findByQuantidadeMinima(quantidade: number) {
    return this.repository.findByQuantidadeMinima(quantidade);
  }

  async updateQuantidade(id: bigint, quantidade: number) {
    if (quantidade <= 0) {
      throw new BadRequestException("A quantidade deve ser maior que zero.");
    }

    return this.repository.update(id, { quantidade });
  }

  async adicionarOuAtualizarProdutoCesta(createDto: CreateProdutoCestaDto) {
    const existente = await this.repository.findByProdutoAndCesta(
      BigInt(createDto.id_produto),
      BigInt(createDto.id_cesta),
    );

    if (existente) {
      // Atualiza a quantidade
      const novaQuantidade = existente.quantidade + createDto.quantidade;
      return this.repository.update(existente.id_produto_cesta, { quantidade: novaQuantidade });
    } else {
      // Cria novo
      return this.create(createDto);
    }
  }

  async findByProfile(perfil: string) {
    // Neste caso, talvez não precise fazer distinção por perfil
    // Mas podemos implementar alguma lógica se necessário
    return this.findAll();
  }

  async generateReport(filter: any) {
    const { id_cesta, id_produto, quantidadeMinima } = filter;

    if (id_cesta) {
      return this.findByCesta(BigInt(id_cesta));
    }

    if (id_produto) {
      return this.findByProduto(BigInt(id_produto));
    }

    if (quantidadeMinima !== undefined) {
      return this.findByQuantidadeMinima(Number(quantidadeMinima));
    }

    return this.findAll();
  }
}
