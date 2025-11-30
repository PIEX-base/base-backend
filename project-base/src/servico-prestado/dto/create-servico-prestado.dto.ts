import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsDateString, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateServicoPrestadoDto {
  @ApiProperty({
    description: "ID do parceiro que prestou o serviço",
    example: "1234567890",
  })
  @IsNotEmpty()
  @IsNumber()
  id_parceiro: bigint;

  @ApiProperty({
    description: "Descrição do serviço prestado",
    example: "Manutenção elétrica na sede",
  })
  @IsNotEmpty()
  @IsString()
  descricao: string;

  @ApiProperty({
    description: "Data de início do serviço",
    example: "2023-05-15T08:00:00Z",
  })
  @IsNotEmpty()
  @IsDateString()
  data_inicio: Date;

  @ApiPropertyOptional({
    description: "Data de finalização do serviço",
    example: "2023-05-16T17:00:00Z",
    required: false,
  })
  @IsOptional()
  @IsDateString()
  data_fim?: Date;

  @ApiPropertyOptional({
    description: "Observações sobre o serviço",
    example: "Serviço incluiu troca de disjuntores e revisão da fiação",
    required: false,
  })
  @IsOptional()
  @IsString()
  observacoes?: string;
}
