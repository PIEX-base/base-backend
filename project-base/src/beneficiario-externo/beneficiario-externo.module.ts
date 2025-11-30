import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { SnowflakeModule } from "../snowflake/snowflake.module";
import { BeneficiarioExternoController } from "./beneficiario-externo.controller";
import { BeneficiarioExternoService } from "./beneficiario-externo.service";
import { BeneficiarioExternoRepository } from "./repositories/beneficiario-externo.repository";

@Module({
  imports: [PrismaModule, SnowflakeModule],
  controllers: [BeneficiarioExternoController],
  providers: [BeneficiarioExternoService, BeneficiarioExternoRepository],
  exports: [BeneficiarioExternoService],
})
export class BeneficiarioExternoModule {}
