import { Injectable } from "@nestjs/common";
import { ProdutoRepository } from "./repositories/produto.repository";
import { CreateProdutoDto } from "./dto/create-produto.dto";
import { UpdateProdutoDto } from "./dto/update-produto.dto";
import { Prisma } from "@prisma/client";
import { SnowflakeService } from "../snowflake/snowflake.service";

@Injectable()
export class ProdutoService {
  constructor(
    private readonly repository: ProdutoRepository,
    private readonly snowflakeService: SnowflakeService,
  ) {}

  async create(createProdutoDto: CreateProdutoDto) {
    const id = this.snowflakeService.generate();

    const produtoData: Prisma.ProdutoCreateInput = {
      id_produto: id,
      nome: createProdutoDto.nome,
      descricao: createProdutoDto.descricao || null,
      is_basico: createProdutoDto.is_basico !== undefined ? createProdutoDto.is_basico : true,
      unidade_medida: createProdutoDto.unidade_medida || null,
    };

    return this.repository.create(produtoData);
  }

  async findAll() {
    return this.repository.findAll();
  }

  async findOne(id: bigint) {
    return this.repository.findOne(id);
  }

  async update(id: bigint, updateProdutoDto: UpdateProdutoDto) {
    return this.repository.update(id, updateProdutoDto);
  }

  async remove(id: bigint) {
    return this.repository.remove(id);
  }

  async findByNome(nome: string) {
    return this.repository.findByNome(nome);
  }

  async findByDescricao(descricao: string) {
    return this.repository.findByDescricao(descricao);
  }

  async findBasicos(isBasico: boolean) {
    return this.repository.findBasicos(isBasico);
  }

  async findByUnidadeMedida(unidadeMedida: string) {
    return this.repository.findByUnidadeMedida(unidadeMedida);
  }

  async findProdutosEmCestas() {
    return this.repository.findProdutosEmCestas();
  }

  async findByProfile(perfil: string) {
    // Nesse caso, podemos permitir que qualquer perfil veja todos os produtos
    // mas podemos customizar isso conforme necessário
    return this.findAll();
  }

  async generateReport(filter: any) {
    const { nome, descricao, isBasico, unidadeMedida, emCestas } = filter;

    if (nome) {
      return this.findByNome(nome);
    }

    if (descricao) {
      return this.findByDescricao(descricao);
    }

    if (isBasico !== undefined) {
      return this.findBasicos(isBasico === "true");
    }

    if (unidadeMedida) {
      return this.findByUnidadeMedida(unidadeMedida);
    }

    if (emCestas === "true") {
      return this.findProdutosEmCestas();
    }

    return this.findAll();
  }
}
