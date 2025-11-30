import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from "@nestjs/swagger";
import { DoacaoService } from "./doacao.service";
import { CreateDoacaoDto } from "./dto/create-doacao.dto";
import { UpdateDoacaoDto } from "./dto/update-doacao.dto";
import { DoacaoEntity } from "./entity/doacao.entity";
import { TipoDoacao } from "./repositories/doacao.repositories";
import { JwtAuthGuard } from "src/auth/dto/jwt-auth.guard";

@ApiTags("Doação")
@Controller("doacao")
export class DoacaoController {
  constructor(private readonly doacaoService: DoacaoService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: "Criar uma nova doação" })
  @ApiResponse({
    status: 201,
    description: "Doação criada com sucesso",
    type: DoacaoEntity,
  })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  async create(@Body() createDoacaoDto: CreateDoacaoDto) {
    return this.doacaoService.create(createDoacaoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: "Listar todas as doações" })
  @ApiQuery({ name: "tipo", required: false, enum: TipoDoacao, description: "Filtrar por tipo" })
  @ApiQuery({ name: "parceiro", required: false, description: "Filtrar por ID do parceiro" })
  @ApiQuery({ name: "anonimas", required: false, description: "Filtrar doações anônimas" })
  @ApiResponse({
    status: 200,
    description: "Lista de doações",
    type: [DoacaoEntity],
  })
  async findAll(
    @Query("tipo") tipo?: TipoDoacao,
    @Query("parceiro") parceiro?: string,
    @Query("anonimas") anonimas?: string,
  ) {
    if (tipo) {
      return this.doacaoService.findByTipo(tipo);
    }

    if (parceiro) {
      return this.doacaoService.findByParceiro(BigInt(parceiro));
    }

    if (anonimas === "true") {
      return this.doacaoService.findAnonimas();
    }

    return this.doacaoService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  @ApiOperation({ summary: "Buscar doação por ID" })
  @ApiParam({ name: "id", description: "ID da doação" })
  @ApiResponse({
    status: 200,
    description: "Doação encontrada",
    type: DoacaoEntity,
  })
  @ApiResponse({ status: 404, description: "Doação não encontrada" })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.doacaoService.findOne(BigInt(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  @ApiOperation({ summary: "Atualizar doação" })
  @ApiParam({ name: "id", description: "ID da doação" })
  @ApiResponse({
    status: 200,
    description: "Doação atualizada com sucesso",
    type: DoacaoEntity,
  })
  @ApiResponse({ status: 404, description: "Doação não encontrada" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  async update(@Param("id", ParseIntPipe) id: number, @Body() updateDoacaoDto: UpdateDoacaoDto) {
    return this.doacaoService.update(BigInt(id), updateDoacaoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remover doação" })
  @ApiParam({ name: "id", description: "ID da doação" })
  @ApiResponse({ status: 204, description: "Doação removida com sucesso" })
  @ApiResponse({ status: 404, description: "Doação não encontrada" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.doacaoService.remove(BigInt(id));
  }

  @UseGuards(JwtAuthGuard)
  @Get("relatorio/periodo")
  @ApiOperation({ summary: "Listar doações por período" })
  @ApiQuery({ name: "dataInicio", required: true, description: "Data de início (YYYY-MM-DD)" })
  @ApiQuery({ name: "dataFim", required: true, description: "Data de fim (YYYY-MM-DD)" })
  @ApiQuery({ name: "tipo", required: false, enum: TipoDoacao, description: "Filtrar por tipo de doação" })
  @ApiResponse({
    status: 200,
    description: "Lista de doações no período especificado",
    type: [DoacaoEntity],
  })
  @ApiResponse({ status: 400, description: "Parâmetros de data inválidos" })
  async findByPeriodo(
    @Query("dataInicio") dataInicio: string,
    @Query("dataFim") dataFim: string,
    @Query("tipo") tipo?: TipoDoacao,
  ) {
    if (tipo) {
      return this.doacaoService.findByPeriodoComTipo(dataInicio, dataFim, tipo);
    }
    return this.doacaoService.findByPeriodo(dataInicio, dataFim);
  }

  @UseGuards(JwtAuthGuard)
  @Get("relatorio/estatisticas")
  @ApiOperation({ summary: "Obter estatísticas de doações por período" })
  @ApiQuery({ name: "dataInicio", required: true, description: "Data de início (YYYY-MM-DD)" })
  @ApiQuery({ name: "dataFim", required: true, description: "Data de fim (YYYY-MM-DD)" })
  @ApiResponse({
    status: 200,
    description: "Estatísticas das doações no período especificado",
  })
  @ApiResponse({ status: 400, description: "Parâmetros de data inválidos" })
  async getEstatisticasPorPeriodo(
    @Query("dataInicio") dataInicio: string,
    @Query("dataFim") dataFim: string,
  ) {
    return this.doacaoService.getEstatisticasPorPeriodo(dataInicio, dataFim);
  }
}
