import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString } from "class-validator";
import { TipoPessoa } from "@prisma/client";

export class CreateParceiroDto {
  @ApiProperty({
    description: "Nome do parceiro",
    example: "Empresa XYZ",
  })
  @IsString()
  @IsNotEmpty()
  nome: string;

  @ApiProperty({
    description: "Tipo de pessoa (física ou jurídica)",
    example: "juridica",
    enum: TipoPessoa,
  })
  @IsEnum(TipoPessoa)
  @IsNotEmpty()
  tipo_pessoa: TipoPessoa;

  @ApiPropertyOptional({
    description: "Documento (CPF ou CNPJ)",
    example: "12.345.678/0001-90",
    required: false,
  })
  @IsOptional()
  @IsString()
  documento?: string;

  @ApiPropertyOptional({
    description: "Email do parceiro",
    example: "contato@empresaxyz.com",
    required: false,
  })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional({
    description: "Telefone de contato",
    example: "(11) 98765-4321",
    required: false,
  })
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiPropertyOptional({
    description: "Endereço do parceiro",
    example: "Rua das Empresas, 123 - São Paulo/SP",
    required: false,
  })
  @IsOptional()
  @IsString()
  endereco?: string;
}
