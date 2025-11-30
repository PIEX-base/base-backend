import { PartialType } from "@nestjs/swagger";
import { CreateProdutoCestaDto } from "./create-produto-cesta.dto";

export class UpdateProdutoCestaDto extends PartialType(CreateProdutoCestaDto) {}
