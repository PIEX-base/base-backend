import { PartialType } from "@nestjs/swagger";
import { CreateBeneficiarioExternoDto } from "./create-beneficiario-externo.dto";

export class UpdateBeneficiarioExternoDto extends PartialType(CreateBeneficiarioExternoDto) {}
