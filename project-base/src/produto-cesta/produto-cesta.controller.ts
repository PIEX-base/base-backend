import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  Req,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
  Put,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from "@nestjs/swagger";
import { ProdutoCestaService } from "./produto-cesta.service";
import { CreateProdutoCestaDto } from "./dto/create-produto-cesta.dto";
import { UpdateProdutoCestaDto } from "./dto/update-produto-cesta.dto";
import { ProdutoCestaEntity } from "./entity/produto-cesta.entity";
import { JwtAuthGuard } from "../auth/dto/jwt-auth.guard";

@ApiTags("Produtos em Cestas")
@Controller("produto-cesta")
export class ProdutoCestaController {
  constructor(private readonly produtoCestaService: ProdutoCestaService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: "Adicionar produto a uma cesta" })
  @ApiResponse({
    status: 201,
    description: "Produto adicionado à cesta com sucesso",
    type: ProdutoCestaEntity,
  })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @ApiResponse({ status: 409, description: "Produto já existe nesta cesta" })
  async create(@Body() createProdutoCestaDto: CreateProdutoCestaDto) {
    return this.produtoCestaService.create(createProdutoCestaDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post("adicionar-ou-atualizar")
  @ApiOperation({ summary: "Adicionar produto a uma cesta ou atualizar a quantidade se já existir" })
  @ApiResponse({
    status: 201,
    description: "Produto adicionado ou atualizado na cesta com sucesso",
    type: ProdutoCestaEntity,
  })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  async adicionarOuAtualizar(@Body() createProdutoCestaDto: CreateProdutoCestaDto) {
    return this.produtoCestaService.adicionarOuAtualizarProdutoCesta(createProdutoCestaDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: "Listar todos os produtos em cestas" })
  @ApiQuery({ name: "cesta", required: false, description: "Filtrar por ID da cesta" })
  @ApiQuery({ name: "produto", required: false, description: "Filtrar por ID do produto" })
  @ApiQuery({ name: "quantidadeMinima", required: false, description: "Filtrar por quantidade mínima" })
  @ApiResponse({
    status: 200,
    description: "Lista de produtos em cestas",
    type: [ProdutoCestaEntity],
  })
  async findAll(
    @Query("cesta") idCesta?: string,
    @Query("produto") idProduto?: string,
    @Query("quantidadeMinima") quantidadeMinima?: string,
  ) {
    if (idCesta) {
      return this.produtoCestaService.findByCesta(BigInt(idCesta));
    }

    if (idProduto) {
      return this.produtoCestaService.findByProduto(BigInt(idProduto));
    }

    if (quantidadeMinima) {
      return this.produtoCestaService.findByQuantidadeMinima(Number(quantidadeMinima));
    }

    return this.produtoCestaService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get("perfil")
  @ApiOperation({ summary: "Visualizar produtos em cestas conforme perfil do usuário" })
  @ApiResponse({
    status: 200,
    description: "Lista de produtos em cestas filtrada pelo perfil do usuário",
    type: [ProdutoCestaEntity],
  })
  async findByProfile(@Req() req: any) {
    const perfil = req.user.perfil;
    return this.produtoCestaService.findByProfile(perfil);
  }

  @UseGuards(JwtAuthGuard)
  @Get("relatorio")
  @ApiOperation({ summary: "Gerar relatórios de produtos em cestas" })
  @ApiQuery({ name: "id_cesta", required: false, description: "Filtrar por ID da cesta" })
  @ApiQuery({ name: "id_produto", required: false, description: "Filtrar por ID do produto" })
  @ApiQuery({ name: "quantidadeMinima", required: false, description: "Filtrar por quantidade mínima" })
  @ApiResponse({
    status: 200,
    description: "Relatório de produtos em cestas gerado com sucesso",
    type: [ProdutoCestaEntity],
  })
  async generateReport(
    @Query("id_cesta") id_cesta?: string,
    @Query("id_produto") id_produto?: string,
    @Query("quantidadeMinima") quantidadeMinima?: string,
  ) {
    const filter = {
      id_cesta,
      id_produto,
      quantidadeMinima,
    };
    return this.produtoCestaService.generateReport(filter);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  @ApiOperation({ summary: "Buscar produto em cesta por ID" })
  @ApiParam({ name: "id", description: "ID do produto na cesta" })
  @ApiResponse({
    status: 200,
    description: "Produto em cesta encontrado",
    type: ProdutoCestaEntity,
  })
  @ApiResponse({ status: 404, description: "Produto em cesta não encontrado" })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.produtoCestaService.findOne(BigInt(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  @ApiOperation({ summary: "Atualizar produto em cesta" })
  @ApiParam({ name: "id", description: "ID do produto na cesta" })
  @ApiResponse({
    status: 200,
    description: "Produto em cesta atualizado com sucesso",
    type: ProdutoCestaEntity,
  })
  @ApiResponse({ status: 404, description: "Produto em cesta não encontrado" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @ApiResponse({ status: 409, description: "Conflito: produto já existe nesta cesta" })
  async update(@Param("id", ParseIntPipe) id: number, @Body() updateProdutoCestaDto: UpdateProdutoCestaDto) {
    return this.produtoCestaService.update(BigInt(id), updateProdutoCestaDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id/quantidade")
  @ApiOperation({ summary: "Atualizar apenas a quantidade de um produto em cesta" })
  @ApiParam({ name: "id", description: "ID do produto na cesta" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        quantidade: {
          type: "number",
          example: 5,
          minimum: 1,
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Quantidade atualizada com sucesso",
    type: ProdutoCestaEntity,
  })
  @ApiResponse({ status: 404, description: "Produto em cesta não encontrado" })
  @ApiResponse({ status: 400, description: "Quantidade inválida" })
  async updateQuantidade(@Param("id", ParseIntPipe) id: number, @Body("quantidade") quantidade: number) {
    return this.produtoCestaService.updateQuantidade(BigInt(id), quantidade);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remover produto de uma cesta" })
  @ApiParam({ name: "id", description: "ID do produto na cesta" })
  @ApiResponse({ status: 204, description: "Produto removido da cesta com sucesso" })
  @ApiResponse({ status: 404, description: "Produto em cesta não encontrado" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.produtoCestaService.remove(BigInt(id));
  }
}
