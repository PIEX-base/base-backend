import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateBeneficiarioExternoDto {
  @ApiProperty({
    description: "Nome do beneficiário externo",
    example: "Maria Santos",
  })
  @IsNotEmpty()
  @IsString()
  nome: string;

  @ApiProperty({
    description: "Telefone do beneficiário externo",
    example: "(11) 99999-9999",
    required: false,
  })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiProperty({
    description: "Endereço do beneficiário externo",
    example: "Rua das Flores, 123",
    required: false,
  })
  @IsOptional()
  @IsString()
  endereco?: string;

  @ApiProperty({
    description: "Origem do beneficiário externo",
    example: "Igreja",
  })
  @IsNotEmpty()
  @IsString()
  origem: string;

  @ApiProperty({
    description: "Observações sobre o beneficiário externo",
    example: "Família em situação de vulnerabilidade",
    required: false,
  })
  @IsOptional()
  @IsString()
  observacoes?: string;
}
