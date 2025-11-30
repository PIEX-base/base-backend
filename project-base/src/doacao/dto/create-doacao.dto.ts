import { ApiProperty } from "@nestjs/swagger";
import { TipoDoacao } from "@prisma/client";
import { Type } from "class-transformer";
import { IsNotEmpty, IsString, IsEnum, IsOptional, IsNumber, IsBoolean, IsUrl, IsDate } from "class-validator";

export class CreateDoacaoDto {
  @ApiProperty({
    description: "ID do parceiro que fez a doação",
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  id_parceiro?: bigint;

  @ApiProperty({
    description: "Tipo da doação",
    enum: TipoDoacao,
    example: TipoDoacao.monetaria,
  })
  @IsNotEmpty()
  @IsEnum(TipoDoacao)
  tipo: TipoDoacao;

  @ApiProperty({
    description: "Valor da doação (obrigatório para doações monetárias)",
    example: 100.5,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  valor?: number;

  @ApiProperty({
    description: "Descrição da doação",
    example: "Doação mensal de alimentos",
  })
  @IsNotEmpty()
  @IsString()
  descricao: string;

  @ApiProperty({
    description: "Data de recebimento da doação",
    example: "2023-10-01T10:00:00Z",
    default: new Date().toISOString(),
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  data_recebimento: Date;

  @ApiProperty({
    description: "URL do comprovante da doação",
    example: "https://example.com/comprovante.pdf",
    required: false,
  })
  @IsOptional()
  @IsUrl()
  comprovante_url?: string;

  @ApiProperty({
    description: "Indica se a doação é anônima",
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  is_anonima?: boolean;
}
