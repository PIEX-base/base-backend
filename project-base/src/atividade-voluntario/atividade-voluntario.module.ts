import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { SnowflakeModule } from "../snowflake/snowflake.module";
import { AtividadeVoluntarioController } from "./atividade-voluntario.controller";
import { AtividadeVoluntarioService } from "./atividade-voluntario.service";
import { AtividadeVoluntarioRepository } from "./repositories/atividade-voluntario.repository";

@Module({
  imports: [PrismaModule, SnowflakeModule],
  controllers: [AtividadeVoluntarioController],
  providers: [AtividadeVoluntarioService, AtividadeVoluntarioRepository],
  exports: [AtividadeVoluntarioService],
})
export class AtividadeVoluntarioModule {}
