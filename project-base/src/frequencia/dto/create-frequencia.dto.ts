import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateFrequenciaDto {
  @ApiProperty({
    description: "ID da matrícula associada à frequência",
    example: "1234567890",
  })
  @IsNotEmpty()
  @IsNumber()
  id_matricula: bigint;

  @ApiProperty({
    description: "Data da frequência",
    example: "2023-05-19T14:00:00Z",
  })
  @IsNotEmpty()
  @IsDateString()
  data: Date;

  @ApiProperty({
    description: "Status de presença",
    example: true,
  })
  @IsNotEmpty()
  @IsBoolean()
  presenca: boolean;

  @ApiPropertyOptional({
    description: "Justificativa em caso de falta",
    example: "Atestado médico",
    required: false,
  })
  @IsOptional()
  @IsString()
  justificativa?: string;
}
