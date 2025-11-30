import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, IsNumber, IsOptional } from "class-validator";

export class CreateItemDoadoDto {
  @ApiProperty({
    description: "ID da doação",
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  id_doacao: bigint;

  @ApiProperty({
    description: "Nome do item doado",
    example: "Arroz",
  })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({
    description: "Quantidade do item",
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  quantidade: number;

  @ApiProperty({
    description: "Unidade de medida",
    example: "kg",
    required: false,
  })
  @IsOptional()
  @IsString()
  unidade_medida?: string;
}
