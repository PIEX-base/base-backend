import { PartialType } from "@nestjs/swagger";
import { CreateServicoPrestadoDto } from "./create-servico-prestado.dto";

export class UpdateServicoPrestadoDto extends PartialType(CreateServicoPrestadoDto) {}
