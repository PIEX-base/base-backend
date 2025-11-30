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
  ParseIntPipe,
  HttpCode,
  HttpStatus,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from "@nestjs/swagger";
import { FrequenciaService } from "./frequencia.service";
import { CreateFrequenciaDto } from "./dto/create-frequencia.dto";
import { UpdateFrequenciaDto } from "./dto/update-frequencia.dto";
import { FrequenciaEntity } from "./entity/frequencia.entity";
import { JwtAuthGuard } from "../auth/dto/jwt-auth.guard";

@ApiTags("Frequências")
@Controller("frequencia")
export class FrequenciaController {
  constructor(private readonly frequenciaService: FrequenciaService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: "Registrar nova frequência" })
  @ApiResponse({
    status: 201,
    description: "Frequência registrada com sucesso",
    type: FrequenciaEntity,
  })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  async create(@Body() createFrequenciaDto: CreateFrequenciaDto) {
    return this.frequenciaService.create(createFrequenciaDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: "Listar todas as frequências" })
  @ApiQuery({ name: "pessoa", required: false, description: "Filtrar por ID da pessoa" })
  @ApiQuery({ name: "atividade", required: false, description: "Filtrar por ID da atividade" })
  @ApiQuery({ name: "dataInicio", required: false, description: "Data de início para filtro" })
  @ApiQuery({ name: "dataFim", required: false, description: "Data de fim para filtro" })
  @ApiQuery({ name: "presenca", required: false, description: "Filtrar por presença (true/false)" })
  @ApiResponse({
    status: 200,
    description: "Lista de frequências",
    type: [FrequenciaEntity],
  })
  async findAll(
    @Query("pessoa") idPessoa?: string,
    @Query("atividade") idAtividade?: string,
    @Query("dataInicio") dataInicio?: string,
    @Query("dataFim") dataFim?: string,
    @Query("presenca") presenca?: string,
  ) {
    if (idPessoa) {
      return this.frequenciaService.findByPessoa(BigInt(idPessoa));
    }

    if (idAtividade) {
      return this.frequenciaService.findByAtividade(BigInt(idAtividade));
    }

    if (dataInicio && dataFim) {
      return this.frequenciaService.findByPeriodo(new Date(dataInicio), new Date(dataFim));
    }

    if (presenca !== undefined) {
      return this.frequenciaService.findByPresenca(presenca === "true");
    }

    return this.frequenciaService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get("perfil")
  @ApiOperation({ summary: "Visualizar frequências conforme perfil do usuário" })
  @ApiResponse({
    status: 200,
    description: "Lista de frequências filtrada pelo perfil do usuário",
    type: [FrequenciaEntity],
  })
  async findByProfile(@Req() req: any) {
    const perfil = req.user.perfil;
    const userId = BigInt(req.user.id_usuario);
    return this.frequenciaService.findByProfile(perfil, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get("relatorio")
  @ApiOperation({ summary: "Gerar relatórios de frequência" })
  @ApiQuery({ name: "id_pessoa", required: false, description: "ID da pessoa para filtro" })
  @ApiQuery({ name: "id_atividade", required: false, description: "ID da atividade para filtro" })
  @ApiQuery({ name: "dataInicio", required: false, description: "Data de início para filtro" })
  @ApiQuery({ name: "dataFim", required: false, description: "Data de fim para filtro" })
  @ApiQuery({ name: "presenca", required: false, description: "Filtrar por presença (true/false)" })
  @ApiResponse({
    status: 200,
    description: "Relatório de frequências gerado com sucesso",
    type: [FrequenciaEntity],
  })
  async generateReport(
    @Query("id_pessoa") id_pessoa?: string,
    @Query("id_atividade") id_atividade?: string,
    @Query("dataInicio") dataInicio?: string,
    @Query("dataFim") dataFim?: string,
    @Query("presenca") presenca?: string,
  ) {
    const filter = {
      id_pessoa,
      id_atividade,
      dataInicio,
      dataFim,
      presenca,
    };
    return this.frequenciaService.generateReport(filter);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  @ApiOperation({ summary: "Buscar frequência por ID" })
  @ApiParam({ name: "id", description: "ID da frequência" })
  @ApiResponse({
    status: 200,
    description: "Frequência encontrada",
    type: FrequenciaEntity,
  })
  @ApiResponse({ status: 404, description: "Frequência não encontrada" })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.frequenciaService.findOne(BigInt(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  @ApiOperation({ summary: "Atualizar frequência" })
  @ApiParam({ name: "id", description: "ID da frequência" })
  @ApiResponse({
    status: 200,
    description: "Frequência atualizada com sucesso",
    type: FrequenciaEntity,
  })
  @ApiResponse({ status: 404, description: "Frequência não encontrada" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  async update(@Param("id", ParseIntPipe) id: number, @Body() updateFrequenciaDto: UpdateFrequenciaDto) {
    return this.frequenciaService.update(BigInt(id), updateFrequenciaDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remover frequência" })
  @ApiParam({ name: "id", description: "ID da frequência" })
  @ApiResponse({ status: 204, description: "Frequência removida com sucesso" })
  @ApiResponse({ status: 404, description: "Frequência não encontrada" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.frequenciaService.remove(BigInt(id));
  }
}
