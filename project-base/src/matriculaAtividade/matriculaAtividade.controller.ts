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
  HttpStatus,
  HttpCode,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/dto/jwt-auth.guard";
import { CreateMatriculaAtividadeDto } from "./dto/create-matriculaAtividade.dto";
import { UpdateMatriculaAtividadeDto } from "./dto/update-matriculaAtividade.dto";
import { MatriculaAtividadeEntity } from "./entity/matriculaAtividade.entity";
import { MatriculaAtividadeService } from "./matriculaAtividade.service";

@ApiTags("Matrícula em Atividades")
@Controller("matricula-atividade")
@UseGuards(JwtAuthGuard)
export class MatriculaAtividadeController {
  constructor(private readonly matriculaAtividadeService: MatriculaAtividadeService) {}

  @Post()
  @ApiOperation({ summary: "Matricular uma pessoa em uma atividade" })
  @ApiResponse({ status: 201, description: "Matrícula criada com sucesso", type: MatriculaAtividadeEntity })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @ApiResponse({ status: 409, description: "Pessoa já matriculada na atividade" })
  create(@Body() createMatriculaAtividadeDto: CreateMatriculaAtividadeDto) {
    return this.matriculaAtividadeService.create(createMatriculaAtividadeDto);
  }

  @Get()
  @ApiOperation({ summary: "Listar todas as matrículas" })
  @ApiQuery({ name: "pessoaId", required: false, description: "Filtrar por ID da pessoa" })
  @ApiQuery({ name: "atividadeId", required: false, description: "Filtrar por ID da atividade" })
  @ApiResponse({ status: 200, description: "Lista de matrículas", type: [MatriculaAtividadeEntity] })
  findAll(@Query("pessoaId") pessoaId?: string, @Query("atividadeId") atividadeId?: string) {
    if (pessoaId) {
      return this.matriculaAtividadeService.findByPessoa(BigInt(pessoaId));
    }
    if (atividadeId) {
      return this.matriculaAtividadeService.findByAtividade(BigInt(atividadeId));
    }
    return this.matriculaAtividadeService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Buscar matrícula por ID" })
  @ApiParam({ name: "id", description: "ID da matrícula" })
  @ApiResponse({ status: 200, description: "Matrícula encontrada", type: MatriculaAtividadeEntity })
  @ApiResponse({ status: 404, description: "Matrícula não encontrada" })
  findOne(@Param("id") id: string) {
    return this.matriculaAtividadeService.findOne(BigInt(id));
  }

  @Patch(":id")
  @ApiOperation({ summary: "Atualizar uma matrícula (ex: status)" })
  @ApiParam({ name: "id", description: "ID da matrícula" })
  @ApiResponse({ status: 200, description: "Matrícula atualizada com sucesso", type: MatriculaAtividadeEntity })
  @ApiResponse({ status: 404, description: "Matrícula não encontrada" })
  update(@Param("id") id: string, @Body() updateMatriculaAtividadeDto: UpdateMatriculaAtividadeDto) {
    return this.matriculaAtividadeService.update(BigInt(id), updateMatriculaAtividadeDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remover uma matrícula" })
  @ApiParam({ name: "id", description: "ID da matrícula" })
  @ApiResponse({ status: 204, description: "Matrícula removida com sucesso" })
  @ApiResponse({ status: 404, description: "Matrícula não encontrada" })
  remove(@Param("id") id: string) {
    return this.matriculaAtividadeService.remove(BigInt(id));
  }
}
