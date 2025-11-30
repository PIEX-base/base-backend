import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Query,
  Req,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from "@nestjs/swagger";
import { ProdutoService } from "./produto.service";
import { CreateProdutoDto } from "./dto/create-produto.dto";
import { UpdateProdutoDto } from "./dto/update-produto.dto";
import { ProdutoEntity } from "./entity/produto.entity";
import { JwtAuthGuard } from "../auth/dto/jwt-auth.guard";

@ApiTags("Produtos")
@Controller("produto")
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: "Criar novo produto" })
  @ApiResponse({
    status: 201,
    description: "Produto criado com sucesso",
    type: ProdutoEntity,
  })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  async create(@Body() createProdutoDto: CreateProdutoDto) {
    return this.produtoService.create(createProdutoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: "Listar todos os produtos" })
  @ApiQuery({ name: "nome", required: false, description: "Filtrar por nome" })
  @ApiQuery({ name: "descricao", required: false, description: "Filtrar por descrição" })
  @ApiQuery({ name: "basico", required: false, description: "Filtrar por itens básicos (true/false)" })
  @ApiQuery({ name: "unidadeMedida", required: false, description: "Filtrar por unidade de medida" })
  @ApiQuery({ name: "emCestas", required: false, description: "Filtrar produtos utilizados em cestas (true)" })
  @ApiResponse({
    status: 200,
    description: "Lista de produtos",
    type: [ProdutoEntity],
  })
  async findAll(
    @Query("nome") nome?: string,
    @Query("descricao") descricao?: string,
    @Query("basico") basico?: string,
    @Query("unidadeMedida") unidadeMedida?: string,
    @Query("emCestas") emCestas?: string,
  ) {
    if (nome) {
      return this.produtoService.findByNome(nome);
    }

    if (descricao) {
      return this.produtoService.findByDescricao(descricao);
    }

    if (basico !== undefined) {
      return this.produtoService.findBasicos(basico === "true");
    }

    if (unidadeMedida) {
      return this.produtoService.findByUnidadeMedida(unidadeMedida);
    }

    if (emCestas === "true") {
      return this.produtoService.findProdutosEmCestas();
    }

    return this.produtoService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get("perfil")
  @ApiOperation({ summary: "Visualizar produtos conforme perfil do usuário" })
  @ApiResponse({
    status: 200,
    description: "Lista de produtos filtrada pelo perfil do usuário",
    type: [ProdutoEntity],
  })
  async findByProfile(@Req() req: any) {
    const perfil = req.user.perfil;
    return this.produtoService.findByProfile(perfil);
  }

  @UseGuards(JwtAuthGuard)
  @Get("relatorio")
  @ApiOperation({ summary: "Gerar relatórios de produtos" })
  @ApiQuery({ name: "nome", required: false, description: "Filtrar por nome" })
  @ApiQuery({ name: "descricao", required: false, description: "Filtrar por descrição" })
  @ApiQuery({ name: "isBasico", required: false, description: "Filtrar por itens básicos (true/false)" })
  @ApiQuery({ name: "unidadeMedida", required: false, description: "Filtrar por unidade de medida" })
  @ApiQuery({ name: "emCestas", required: false, description: "Filtrar produtos utilizados em cestas" })
  @ApiResponse({
    status: 200,
    description: "Relatório de produtos gerado com sucesso",
    type: [ProdutoEntity],
  })
  async generateReport(
    @Query("nome") nome?: string,
    @Query("descricao") descricao?: string,
    @Query("isBasico") isBasico?: string,
    @Query("unidadeMedida") unidadeMedida?: string,
    @Query("emCestas") emCestas?: string,
  ) {
    const filter = {
      nome,
      descricao,
      isBasico,
      unidadeMedida,
      emCestas,
    };
    return this.produtoService.generateReport(filter);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  @ApiOperation({ summary: "Buscar produto por ID" })
  @ApiParam({ name: "id", description: "ID do produto" })
  @ApiResponse({
    status: 200,
    description: "Produto encontrado",
    type: ProdutoEntity,
  })
  @ApiResponse({ status: 404, description: "Produto não encontrado" })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.produtoService.findOne(BigInt(id));
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  @ApiOperation({ summary: "Atualizar produto" })
  @ApiParam({ name: "id", description: "ID do produto" })
  @ApiResponse({
    status: 200,
    description: "Produto atualizado com sucesso",
    type: ProdutoEntity,
  })
  @ApiResponse({ status: 404, description: "Produto não encontrado" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  async update(@Param("id", ParseIntPipe) id: number, @Body() updateProdutoDto: UpdateProdutoDto) {
    return this.produtoService.update(BigInt(id), updateProdutoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remover produto" })
  @ApiParam({ name: "id", description: "ID do produto" })
  @ApiResponse({ status: 204, description: "Produto removido com sucesso" })
  @ApiResponse({ status: 404, description: "Produto não encontrado" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.produtoService.remove(BigInt(id));
  }
}
