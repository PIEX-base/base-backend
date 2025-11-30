import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateMateriaDto {
  @ApiProperty({
    description: "ID da atividade relacionada à matéria",
    example: "1234567890",
  })
  @IsNotEmpty()
  @IsNumber()
  id_atividade: bigint;

  @ApiProperty({
    description: "Nome da matéria",
    example: "Matemática",
  })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiPropertyOptional({
    description: "Descrição detalhada da matéria",
    example: "Conteúdo de matemática básica para reforço escolar",
    required: false,
  })
  @IsOptional()
  @IsString()
  descricao?: string;
}
