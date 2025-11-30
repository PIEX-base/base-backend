import { Module } from "@nestjs/common";
import { FrequenciaService } from "./frequencia.service";
import { FrequenciaController } from "./frequencia.controller";
import { FrequenciaRepository } from "./repositories/frequencia.repository";
import { PrismaModule } from "../prisma/prisma.module";
import { SnowflakeModule } from "../snowflake/snowflake.module";

@Module({
  imports: [PrismaModule, SnowflakeModule],
  providers: [FrequenciaService, FrequenciaRepository],
  controllers: [FrequenciaController],
  exports: [FrequenciaService],
})
export class FrequenciaModule {}
