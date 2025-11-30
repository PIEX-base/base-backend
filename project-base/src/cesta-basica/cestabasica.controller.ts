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
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from "@nestjs/swagger";
import { CestaBasicaService } from "./cestabasica.service";
import { CreateCestaBasicaDto } from "./dto/create-cestabasica.dto";
import { UpdateCestaBasicaDto } from "./dto/update-cestabasica.dto";
import { CestaBasicaEntity } from "./entity/cestabasica.entity";
import { JwtAuthGuard } from "src/auth/dto/jwt-auth.guard";

@ApiTags("Cesta Básica")
@Controller("cesta-basica")
export class CestaBasicaController {
  constructor(private readonly cestaBasicaService: CestaBasicaService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: "Criar uma nova cesta básica" })
  @ApiResponse({
    status: 201,
    description: "Cesta básica criada com sucesso",
    type: CestaBasicaEntity,
  })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  async create(@Body() createCestaBasicaDto: CreateCestaBasicaDto) {
    return this.cestaBasicaService.create(createCestaBasicaDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: "Listar todas as cestas básicas" })
  @ApiQuery({ name: "responsavel", required: false, description: "Filtrar por ID do responsável" })
  @ApiQuery({ name: "beneficiario", required: false, description: "Filtrar por ID do beneficiário externo" })
  @ApiQuery({ name: "doacao", required: false, description: "Filtrar por ID da doação de origem" })
  @ApiQuery({ name: "dataInicio", required: false, description: "Data de início para filtro por período" })
  @ApiQuery({ name: "dataFim", required: false, description: "Data de fim para filtro por período" })
  @ApiResponse({
    status: 200,
    description: "Lista de cestas básicas",
    type: [CestaBasicaEntity],
  })
  async findAll(
    @Query("responsavel") idResponsavel?: string,
    @Query("beneficiario") idBeneficiario?: string,
    @Query("doacao") idDoacao?: string,
    @Query("dataInicio") dataInicio?: string,
    @Query("dataFim") dataFim?: string,
  ) {
    if (idResponsavel) {
      return this.cestaBasicaService.findByResponsavel(BigInt(idResponsavel));
    }

    if (idBeneficiario) {
      return this.cestaBasicaService.findByBeneficiario(BigInt(idBeneficiario));
    }

    if (idDoacao) {
      return this.cestaBasicaService.findByDoacao(BigInt(idDoacao));
    }

    if (dataInicio && dataFim) {
      return this.cestaBasicaService.findByPeriodo(new Date(dataInicio), new Date(dataFim));
    }

    return this.cestaBasicaService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get("perfil")
  @ApiOperation({ summary: "Visualizar cestas básicas conforme perfil do usuário" })
  @ApiResponse({
    status: 200,
    description: "Lista de cestas básicas filtrada pelo perfil do usuário",
    type: [CestaBasicaEntity],
  })
  async findByProfile(@Req() req: any) {
    const perfil = req.user.perfil;
    const userId = BigInt(req.user.id_usuario);
    return this.cestaBasicaService.findByProfile(perfil, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("relatorio")
  @ApiOperation({ summary: "Gerar relatórios de cestas básicas" })
  @ApiQuery({ name: "dataInicio", required: false, description: "Data de início para filtro" })
  @ApiQuery({ name: "dataFim", required: false, description: "Data de fim para filtro" })
  @ApiQuery({ name: "idResponsavel", required: false, description: "ID do responsável para filtro" })
  @ApiQuery({ name: "idBeneficiario", required: false, description: "ID do beneficiário para filtro" })
  @ApiQuery({ name: "idDoacao", required: false, description: "ID da doação para filtro" })
  @ApiResponse({
    status: 200,
    description: "Relatório de cestas básicas gerado com sucesso",
    type: [CestaBasicaEntity],
  })
  async generateReport(
    @Query("dataInicio") dataInicio?: string,
    @Query("dataFim") dataFim?: string,
    @Query("idResponsavel") idResponsavel?: string,
    @Query("idBeneficiario") idBeneficiario?: string,
    @Query("idDoacao") idDoacao?: string,
  ) {
    const filter = {
      dataInicio,
      dataFim,
      idResponsavel,
      idBeneficiario,
      idDoacao,
    };
    return this.cestaBasicaService.generateReport(filter);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  @ApiOperation({ summary: "Buscar cesta básica por ID" })
  @ApiParam({ name: "id", description: "ID da cesta básica" })
  @ApiResponse({
    status: 200,
    description: "Cesta básica encontrada",
    type: CestaBasicaEntity,
  })
  @ApiResponse({ status: 404, description: "Cesta básica não encontrada" })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.cestaBasicaService.findOne(BigInt(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  @ApiOperation({ summary: "Atualizar cesta básica" })
  @ApiParam({ name: "id", description: "ID da cesta básica" })
  @ApiResponse({
    status: 200,
    description: "Cesta básica atualizada com sucesso",
    type: CestaBasicaEntity,
  })
  @ApiResponse({ status: 404, description: "Cesta básica não encontrada" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  async update(@Param("id", ParseIntPipe) id: number, @Body() updateCestaBasicaDto: UpdateCestaBasicaDto) {
    return this.cestaBasicaService.update(BigInt(id), updateCestaBasicaDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remover cesta básica" })
  @ApiParam({ name: "id", description: "ID da cesta básica" })
  @ApiResponse({ status: 204, description: "Cesta básica removida com sucesso" })
  @ApiResponse({ status: 404, description: "Cesta básica não encontrada" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.cestaBasicaService.remove(BigInt(id));
  }
}
