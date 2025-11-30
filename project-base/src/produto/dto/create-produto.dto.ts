import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateProdutoDto {
  @ApiProperty({
    description: "Nome do produto",
    example: "Arroz",
  })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiPropertyOptional({
    description: "Descrição detalhada do produto",
    example: "Arroz tipo 1, pacote de 5kg",
    required: false,
  })
  @IsOptional()
  @IsString()
  descricao?: string;

  @ApiPropertyOptional({
    description: "Indica se é um item básico que sempre está presente nas cestas",
    example: true,
    default: true,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  is_basico?: boolean;

  @ApiPropertyOptional({
    description: "Unidade de medida do produto",
    example: "kg",
    required: false,
  })
  @IsOptional()
  @IsString()
  unidade_medida?: string;
}
