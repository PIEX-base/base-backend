import { PartialType } from "@nestjs/swagger";
import { CreateItemDoadoDto } from "./create-item-doado.dto";

export class UpdateItemDoadoDto extends PartialType(CreateItemDoadoDto) {}
