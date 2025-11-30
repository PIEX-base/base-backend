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
import { ItemDoadoService } from "./item-doado.service";
import { CreateItemDoadoDto } from "./dto/create-item-doado.dto";
import { UpdateItemDoadoDto } from "./dto/update-item-doado.dto";
import { ItemDoadoEntity } from "./entity/item-doado.entity";

@ApiTags("Item Doado")
@Controller("item-doado")
export class ItemDoadoController {
  constructor(private readonly itemDoadoService: ItemDoadoService) {}

  @Post()
  @ApiOperation({ summary: "Criar um novo item doado" })
  @ApiResponse({
    status: 201,
    description: "Item doado criado com sucesso",
    type: ItemDoadoEntity,
  })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  async create(@Body() createItemDoadoDto: CreateItemDoadoDto) {
    return this.itemDoadoService.create(createItemDoadoDto);
  }

  @Get()
  @ApiOperation({ summary: "Listar todos os itens doados" })
  @ApiQuery({ name: "nome", required: false, description: "Filtrar por nome" })
  @ApiQuery({ name: "doacao", required: false, description: "Filtrar por ID da doação" })
  @ApiResponse({
    status: 200,
    description: "Lista de itens doados",
    type: [ItemDoadoEntity],
  })
  async findAll(@Query("nome") nome?: string, @Query("doacao") doacao?: string) {
    if (nome) {
      return this.itemDoadoService.findByNome(nome);
    }

    if (doacao) {
      return this.itemDoadoService.findByDoacao(BigInt(doacao));
    }

    return this.itemDoadoService.findAll();
  }

  @Get(":id")
  @ApiOperation({ summary: "Buscar item doado por ID" })
  @ApiParam({ name: "id", description: "ID do item doado" })
  @ApiResponse({
    status: 200,
    description: "Item doado encontrado",
    type: ItemDoadoEntity,
  })
  @ApiResponse({ status: 404, description: "Item doado não encontrado" })
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return this.itemDoadoService.findOne(BigInt(id));
  }

  @Patch(":id")
  @ApiOperation({ summary: "Atualizar item doado" })
  @ApiParam({ name: "id", description: "ID do item doado" })
  @ApiResponse({
    status: 200,
    description: "Item doado atualizado com sucesso",
    type: ItemDoadoEntity,
  })
  @ApiResponse({ status: 404, description: "Item doado não encontrado" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  async update(@Param("id", ParseIntPipe) id: number, @Body() updateItemDoadoDto: UpdateItemDoadoDto) {
    return this.itemDoadoService.update(BigInt(id), updateItemDoadoDto);
  }

  @Delete(":id")
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: "Remover item doado" })
  @ApiParam({ name: "id", description: "ID do item doado" })
  @ApiResponse({ status: 204, description: "Item doado removido com sucesso" })
  @ApiResponse({ status: 404, description: "Item doado não encontrado" })
  async remove(@Param("id", ParseIntPipe) id: number) {
    await this.itemDoadoService.remove(BigInt(id));
  }
}
