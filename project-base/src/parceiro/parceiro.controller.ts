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
import { ParceiroService } from "./parceiro.service";
import { CreateParceiroDto } from "./dto/create-parceiro.dto";
import { UpdateParceiroDto } from "./dto/update-parceiro.dto";
import { ParceiroEntity } from "./entity/parceiro.entity";
import { JwtAuthGuard } from "../auth/dto/jwt-auth.guard";
import { TipoPessoa } from "@prisma/client";

@ApiTags("Parceiros")
@Controller("parceiro")
export class ParceiroController {
  constructor(private readonly parceiroService: ParceiroService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: "Cadastrar novo parceiro" })
  @ApiResponse({
    status: 201,
    description: "Parceiro cadastrado com sucesso",
    type: ParceiroEntity,
  })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  async create(@Body() createParceiroDto: CreateParceiroDto) {
    return this.parceiroService.create(createParceiroDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: "Listar todos os parceiros" })
  @ApiQuery({ name: "nome", required: false, description: "Filtrar por nome" })
  @ApiQuery({ name: "tipo", required: false, description: "Filtrar por tipo de pessoa (fisica/juridica)" })
  @ApiQuery({ name: "documento", required: false, description: "Filtrar por documento (CPF/CNPJ)" })
  @ApiQuery({ name: "dataInicio", required: false, description: "Data de início para filtro por período de cadastro" })
  @ApiQuery({ name: "dataFim", required: false, description: "Data de fim para filtro por período de cadastro" })
  @ApiQuery({ name: "comDoacoes", required: false, description: "Filtrar parceiros com doações" })
  @ApiQuery({ name: "comServicos", required: false, description: "Filtrar parceiros com serviços prestados" })
  @ApiResponse({
    status: 200,
    description: "Lista de parceiros",
    type: [ParceiroEntity],
  })
  async findAll(
    @Query("nome") nome?: string,
    @Query("tipo") tipo?: TipoPessoa,
    @Query("documento") documento?: string,
    @Query("dataInicio") dataInicio?: string,
    @Query("dataFim") dataFim?: string,
    @Query("comDoacoes") comDoacoes?: string,
    @Query("comServicos") comServicos?: string,
  ) {
    if (nome) {
      return this.parceiroService.findByNome(nome);
    }

    if (tipo) {
      return this.parceiroService.findByTipoPessoa(tipo);
    }

    if (documento) {
      return this.parceiroService.findByDocumento(documento);
    }

    if (dataInicio && dataFim) {
      return this.parceiroService.findByPeriodo(new Date(dataInicio), new Date(dataFim));
    }

    if (comDoacoes === "true") {
      return this.parceiroService.findComDoacoes();
    }

    if (comServicos === "true") {
      return this.parceiroService.findComServicos();
    }

    return this.parceiroService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get("perfil")
  @ApiOperation({ summary: "Visualizar parceiros conforme perfil do usuário" })
  @ApiResponse({
    status: 200,
    description: "Lista de parceiros filtrada pelo perfil do usuário",
    type: [ParceiroEntity],
  })
  async findByProfile(@Req() req: any) {
    const perfil = req.user.perfil;
    return this.parceiroService.findByProfile(perfil);
  }

  @UseGuards(JwtAuthGuard)
  @Get("relatorio")
  @ApiOperation({ summary: "Gerar relatórios de parceiros" })
  @ApiQuery({ name: "tipo_pessoa", required: false, description: "Filtrar por tipo de pessoa" })
  @ApiQuery({ name: "dataCadastroInicio", required: false, description: "Data de início para filtro" })
  @ApiQuery({ name: "dataCadastroFim", required: false, description: "Data de fim para filtro" })
  @ApiQuery({ name: "nome", required: false, description: "Filtrar por nome" })
  @ApiQuery({ name: "comDoacoes", required: false, description: "Filtrar parceiros com doações" })
  @ApiQuery({ name: "comServicos", required: false, description: "Filtrar parceiros com serviços prestados" })
  @ApiResponse({
    status: 200,
    description: "Relatório de parceiros gerado com sucesso",
    type: [ParceiroEntity],
  })
  async generateReport(
    @Query("tipo_pessoa") tipo_pessoa?: TipoPessoa,
    @Query("dataCadastroInicio") dataCadastroInicio?: string,
    @Query("dataCadastroFim") dataCadastroFim?: string,
    @Query("nome") nome?: string,
    @Query("comDoacoes") comDoacoes?: string,
    @Query("comServicos") comServicos?: string,
  ) {
    const filter = {
      tipo_pessoa,
      dataCadastroInicio,
      dataCadastroFim,
      nome,
      comDoacoes,
      comServicos,
    };
    return this.parceiroService.generateReport(filter);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  @ApiOperation({ summary: "Buscar parceiro por ID" })
  @ApiParam({ name: "id", description: "ID do parceiro" })
  @ApiResponse({
    status: 200,
    description: "Parceiro encontrado",
    type: ParceiroEntity,
  })
  @ApiResponse({ status: 404, description: "Parceiro não encontrado" })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.parceiroService.findOne(BigInt(id));
  }

  @UseGuards(JwtAuthGuard)
  @Put(":id")
  @ApiOperation({ summary: "Atualizar parceiro" })
  @ApiParam({ name: "id", description: "ID do parceiro" })
  @ApiResponse({
    status: 200,
    description: "Parceiro atualizado com sucesso",
    type: ParceiroEntity,
  })
  @ApiResponse({ status: 404, description: "Parceiro não encontrado" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  async update(@Param("id", ParseIntPipe) id: number, @Body() updateParceiroDto: UpdateParceiroDto) {
    return this.parceiroService.update(BigInt(id), updateParceiroDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remover parceiro" })
  @ApiParam({ name: "id", description: "ID do parceiro" })
  @ApiResponse({ status: 204, description: "Parceiro removido com sucesso" })
  @ApiResponse({ status: 404, description: "Parceiro não encontrado" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.parceiroService.remove(BigInt(id));
  }
}
