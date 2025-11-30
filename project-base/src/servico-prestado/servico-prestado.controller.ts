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
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery, ApiBody } from "@nestjs/swagger";
import { ServicoPrestadoService } from "./servico-prestado.service";
import { CreateServicoPrestadoDto } from "./dto/create-servico-prestado.dto";
import { UpdateServicoPrestadoDto } from "./dto/update-servico-prestado.dto";
import { ServicoPrestadoEntity } from "./entity/servico-prestado.entity";
import { JwtAuthGuard } from "../auth/dto/jwt-auth.guard";

@ApiTags("Serviços Prestados")
@Controller("servico-prestado")
export class ServicoPrestadoController {
  constructor(private readonly servicoPrestadoService: ServicoPrestadoService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: "Registrar novo serviço prestado" })
  @ApiResponse({
    status: 201,
    description: "Serviço prestado registrado com sucesso",
    type: ServicoPrestadoEntity,
  })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  async create(@Body() createServicoPrestadoDto: CreateServicoPrestadoDto) {
    return this.servicoPrestadoService.create(createServicoPrestadoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: "Listar todos os serviços prestados" })
  @ApiQuery({ name: "parceiro", required: false, description: "Filtrar por ID do parceiro" })
  @ApiQuery({ name: "dataInicio", required: false, description: "Data de início para filtro por período" })
  @ApiQuery({ name: "dataFim", required: false, description: "Data de fim para filtro por período" })
  @ApiQuery({ name: "descricao", required: false, description: "Filtrar por descrição" })
  @ApiQuery({ name: "emAndamento", required: false, description: "Filtrar serviços em andamento (true/false)" })
  @ApiResponse({
    status: 200,
    description: "Lista de serviços prestados",
    type: [ServicoPrestadoEntity],
  })
  async findAll(
    @Query("parceiro") idParceiro?: string,
    @Query("dataInicio") dataInicio?: string,
    @Query("dataFim") dataFim?: string,
    @Query("descricao") descricao?: string,
    @Query("emAndamento") emAndamento?: string,
  ) {
    if (idParceiro) {
      return this.servicoPrestadoService.findByParceiro(BigInt(idParceiro));
    }

    if (dataInicio && dataFim) {
      return this.servicoPrestadoService.findByPeriodo(new Date(dataInicio), new Date(dataFim));
    }

    if (descricao) {
      return this.servicoPrestadoService.findByDescricao(descricao);
    }

    if (emAndamento === "true") {
      return this.servicoPrestadoService.findServicosEmAndamento();
    }

    return this.servicoPrestadoService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get("perfil")
  @ApiOperation({ summary: "Visualizar serviços prestados conforme perfil do usuário" })
  @ApiResponse({
    status: 200,
    description: "Lista de serviços prestados filtrada pelo perfil do usuário",
    type: [ServicoPrestadoEntity],
  })
  async findByProfile(@Req() req: any) {
    const perfil = req.user.perfil;
    return this.servicoPrestadoService.findByProfile(perfil);
  }

  @UseGuards(JwtAuthGuard)
  @Get("relatorio")
  @ApiOperation({ summary: "Gerar relatórios de serviços prestados" })
  @ApiQuery({ name: "id_parceiro", required: false, description: "ID do parceiro para filtro" })
  @ApiQuery({ name: "dataInicio", required: false, description: "Data de início para filtro" })
  @ApiQuery({ name: "dataFim", required: false, description: "Data de fim para filtro" })
  @ApiQuery({ name: "descricao", required: false, description: "Filtrar por descrição" })
  @ApiQuery({ name: "emAndamento", required: false, description: "Filtrar serviços em andamento" })
  @ApiResponse({
    status: 200,
    description: "Relatório de serviços prestados gerado com sucesso",
    type: [ServicoPrestadoEntity],
  })
  async generateReport(
    @Query("id_parceiro") id_parceiro?: string,
    @Query("dataInicio") dataInicio?: string,
    @Query("dataFim") dataFim?: string,
    @Query("descricao") descricao?: string,
    @Query("emAndamento") emAndamento?: string,
  ) {
    const filter = {
      id_parceiro,
      dataInicio,
      dataFim,
      descricao,
      emAndamento,
    };
    return this.servicoPrestadoService.generateReport(filter);
  }

  @UseGuards(JwtAuthGuard)
  @Post(":id/finalizar")
  @ApiOperation({ summary: "Finalizar um serviço prestado" })
  @ApiParam({ name: "id", description: "ID do serviço prestado" })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        data_fim: {
          type: "string",
          format: "date-time",
          example: "2023-07-30T18:00:00Z",
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Serviço finalizado com sucesso",
    type: ServicoPrestadoEntity,
  })
  @ApiResponse({ status: 404, description: "Serviço não encontrado" })
  @ApiResponse({ status: 400, description: "Serviço já finalizado ou dados inválidos" })
  async finalizarServico(@Param("id", ParseIntPipe) id: number, @Body("data_fim") data_fim: string) {
    return this.servicoPrestadoService.finalizarServico(BigInt(id), new Date(data_fim));
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  @ApiOperation({ summary: "Buscar serviço prestado por ID" })
  @ApiParam({ name: "id", description: "ID do serviço prestado" })
  @ApiResponse({
    status: 200,
    description: "Serviço prestado encontrado",
    type: ServicoPrestadoEntity,
  })
  @ApiResponse({ status: 404, description: "Serviço prestado não encontrado" })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.servicoPrestadoService.findOne(BigInt(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  @ApiOperation({ summary: "Atualizar serviço prestado" })
  @ApiParam({ name: "id", description: "ID do serviço prestado" })
  @ApiResponse({
    status: 200,
    description: "Serviço prestado atualizado com sucesso",
    type: ServicoPrestadoEntity,
  })
  @ApiResponse({ status: 404, description: "Serviço prestado não encontrado" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  async update(@Param("id", ParseIntPipe) id: number, @Body() updateServicoPrestadoDto: UpdateServicoPrestadoDto) {
    return this.servicoPrestadoService.update(BigInt(id), updateServicoPrestadoDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remover serviço prestado" })
  @ApiParam({ name: "id", description: "ID do serviço prestado" })
  @ApiResponse({ status: 204, description: "Serviço prestado removido com sucesso" })
  @ApiResponse({ status: 404, description: "Serviço prestado não encontrado" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.servicoPrestadoService.remove(BigInt(id));
  }
}
