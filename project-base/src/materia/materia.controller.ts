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
import { MateriaService } from "./materia.service";
import { CreateMateriaDto } from "./dto/create-materia.dto";
import { UpdateMateriaDto } from "./dto/update-materia.dto";
import { MateriaEntity } from "./entity/materia.entity";
import { JwtAuthGuard } from "../auth/dto/jwt-auth.guard";

@ApiTags("Matérias")
@Controller("materia")
export class MateriaController {
  constructor(private readonly materiaService: MateriaService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @ApiOperation({ summary: "Criar nova matéria" })
  @ApiResponse({
    status: 201,
    description: "Matéria criada com sucesso",
    type: MateriaEntity,
  })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  async create(@Body() createMateriaDto: CreateMateriaDto) {
    return this.materiaService.create(createMateriaDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOperation({ summary: "Listar todas as matérias" })
  @ApiQuery({ name: "atividade", required: false, description: "Filtrar por ID da atividade" })
  @ApiQuery({ name: "nome", required: false, description: "Filtrar por nome da matéria" })
  @ApiQuery({ name: "tipo", required: false, description: "Filtrar por tipo de atividade" })
  @ApiResponse({
    status: 200,
    description: "Lista de matérias",
    type: [MateriaEntity],
  })
  async findAll(@Query("atividade") idAtividade?: string, @Query("nome") nome?: string, @Query("tipo") tipo?: string) {
    if (idAtividade) {
      return this.materiaService.findByAtividade(BigInt(idAtividade));
    }

    if (nome) {
      return this.materiaService.findByNome(nome);
    }

    if (tipo) {
      return this.materiaService.findByTipoAtividade(tipo);
    }

    return this.materiaService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get("perfil")
  @ApiOperation({ summary: "Visualizar matérias conforme perfil do usuário" })
  @ApiResponse({
    status: 200,
    description: "Lista de matérias filtrada pelo perfil do usuário",
    type: [MateriaEntity],
  })
  async findByProfile(@Req() req: any) {
    const perfil = req.user.perfil;
    return this.materiaService.findByProfile(perfil);
  }

  @UseGuards(JwtAuthGuard)
  @Get("relatorio")
  @ApiOperation({ summary: "Gerar relatórios de matérias" })
  @ApiQuery({ name: "id_atividade", required: false, description: "Filtrar por ID da atividade" })
  @ApiQuery({ name: "nome", required: false, description: "Filtrar por nome da matéria" })
  @ApiQuery({ name: "tipo", required: false, description: "Filtrar por tipo de atividade" })
  @ApiResponse({
    status: 200,
    description: "Relatório de matérias gerado com sucesso",
    type: [MateriaEntity],
  })
  async generateReport(
    @Query("id_atividade") id_atividade?: string,
    @Query("nome") nome?: string,
    @Query("tipo") tipo?: string,
  ) {
    const filter = {
      id_atividade,
      nome,
      tipo,
    };
    return this.materiaService.generateReport(filter);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  @ApiOperation({ summary: "Buscar matéria por ID" })
  @ApiParam({ name: "id", description: "ID da matéria" })
  @ApiResponse({
    status: 200,
    description: "Matéria encontrada",
    type: MateriaEntity,
  })
  @ApiResponse({ status: 404, description: "Matéria não encontrada" })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.materiaService.findOne(BigInt(id));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  @ApiOperation({ summary: "Atualizar matéria" })
  @ApiParam({ name: "id", description: "ID da matéria" })
  @ApiResponse({
    status: 200,
    description: "Matéria atualizada com sucesso",
    type: MateriaEntity,
  })
  @ApiResponse({ status: 404, description: "Matéria não encontrada" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  async update(@Param("id", ParseIntPipe) id: number, @Body() updateMateriaDto: UpdateMateriaDto) {
    return this.materiaService.update(BigInt(id), updateMateriaDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remover matéria" })
  @ApiParam({ name: "id", description: "ID da matéria" })
  @ApiResponse({ status: 204, description: "Matéria removida com sucesso" })
  @ApiResponse({ status: 404, description: "Matéria não encontrada" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.materiaService.remove(BigInt(id));
  }
}
