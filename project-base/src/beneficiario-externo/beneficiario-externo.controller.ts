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
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from "@nestjs/swagger";
import { BeneficiarioExternoService } from "./beneficiario-externo.service";
import { CreateBeneficiarioExternoDto } from "./dto/create-beneficiario-externo.dto";
import { UpdateBeneficiarioExternoDto } from "./dto/update-beneficiario-externo.dto";
import { BeneficiarioExternoEntity } from "./entity/beneficiario-externo.entity";

@ApiTags("Beneficiário Externo")
@Controller("beneficiario-externo")
export class BeneficiarioExternoController {
  constructor(private readonly beneficiarioExternoService: BeneficiarioExternoService) {}

  @Post()
  @ApiOperation({ summary: "Criar um novo beneficiário externo" })
  @ApiResponse({
    status: 201,
    description: "Beneficiário externo criado com sucesso",
    type: BeneficiarioExternoEntity,
  })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  async create(@Body() createBeneficiarioExternoDto: CreateBeneficiarioExternoDto) {
    return this.beneficiarioExternoService.create(createBeneficiarioExternoDto);
  }

  @Get()
  @ApiOperation({ summary: "Listar todos os beneficiários externos" })
  @ApiQuery({ name: "nome", required: false, description: "Filtrar por nome" })
  @ApiResponse({
    status: 200,
    description: "Lista de beneficiários externos",
    type: [BeneficiarioExternoEntity],
  })
  async findAll(@Query("nome") nome?: string) {
    if (nome) {
      return this.beneficiarioExternoService.findByNome(nome);
    }
    return this.beneficiarioExternoService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Buscar beneficiário externo por ID" })
  @ApiParam({ name: "id", description: "ID do beneficiário externo" })
  @ApiResponse({
    status: 200,
    description: "Beneficiário externo encontrado",
    type: BeneficiarioExternoEntity,
  })
  @ApiResponse({ status: 404, description: "Beneficiário externo não encontrado" })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.beneficiarioExternoService.findOne(BigInt(id));
  }

  @Patch(":id")
  @ApiOperation({ summary: "Atualizar beneficiário externo" })
  @ApiParam({ name: "id", description: "ID do beneficiário externo" })
  @ApiResponse({
    status: 200,
    description: "Beneficiário externo atualizado com sucesso",
    type: BeneficiarioExternoEntity,
  })
  @ApiResponse({ status: 404, description: "Beneficiário externo não encontrado" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  async update(
    @Param("id", ParseIntPipe) id: number,
    @Body() updateBeneficiarioExternoDto: UpdateBeneficiarioExternoDto,
  ) {
    return this.beneficiarioExternoService.update(BigInt(id), updateBeneficiarioExternoDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remover beneficiário externo" })
  @ApiParam({ name: "id", description: "ID do beneficiário externo" })
  @ApiResponse({ status: 204, description: "Beneficiário externo removido com sucesso" })
  @ApiResponse({ status: 404, description: "Beneficiário externo não encontrado" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.beneficiarioExternoService.remove(BigInt(id));
  }
}
