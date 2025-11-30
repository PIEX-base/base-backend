import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, Min } from "class-validator";

export class CreateProdutoCestaDto {
  @ApiProperty({
    description: "ID da cesta básica",
    example: "1234567890",
  })
  @IsNotEmpty()
  @IsNumber()
  id_cesta: bigint;

  @ApiProperty({
    description: "ID do produto",
    example: "1234567890",
  })
  @IsNotEmpty()
  @IsNumber()
  id_produto: bigint;

  @ApiProperty({
    description: "Quantidade do produto na cesta",
    example: 2,
    minimum: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  quantidade: number;
}
