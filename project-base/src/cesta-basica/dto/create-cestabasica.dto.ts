import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsOptional, IsString, IsArray, ValidateNested, IsNumber } from "class-validator";
import { Type } from "class-transformer";

export class CreateProdutoCestaDto {
  @ApiProperty({
    description: "ID do produto",
    example: "1234567890",
  })
  @IsNotEmpty()
  @IsNumber()
  id_produto: bigint;

  @ApiProperty({
    description: "Quantidade do produto",
    example: 2,
  })
  @IsNotEmpty()
  @IsNumber()
  quantidade: number;
}

export class CreateCestaBasicaDto {
  @ApiPropertyOptional({
    description: "ID do responsável que receberá a cesta",
    example: "1234567890",
    required: false,
  })
  @IsOptional()
  @IsNumber()
  id_responsavel?: bigint;

  @ApiPropertyOptional({
    description: "ID do beneficiário externo que receberá a cesta",
    example: "1234567890",
    required: false,
  })
  @IsOptional()
  @IsNumber()
  id_beneficiario?: bigint;

  @ApiPropertyOptional({
    description: "ID da doação que originou a cesta",
    example: "1234567890",
    required: false,
  })
  @IsOptional()
  @IsNumber()
  id_doacao?: bigint;

  @ApiProperty({
    description: "Data de entrega da cesta",
    example: "2023-01-01T14:00:00Z",
  })
  @IsNotEmpty()
  @IsDateString()
  data_entrega: Date;

  @ApiPropertyOptional({
    description: "Observações sobre a cesta",
    example: "Entrega realizada na residência do beneficiário",
    required: false,
  })
  @IsOptional()
  @IsString()
  observacoes?: string;

  @ApiPropertyOptional({
    description: "Lista de produtos que compõem a cesta",
    type: [CreateProdutoCestaDto],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateProdutoCestaDto)
  produtos?: CreateProdutoCestaDto[];
}
