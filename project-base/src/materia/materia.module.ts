import { Module } from "@nestjs/common";
import { MateriaService } from "./materia.service";
import { MateriaController } from "./materia.controller";
import { MateriaRepository } from "./repositories/materia.repository";
import { PrismaModule } from "../prisma/prisma.module";
import { SnowflakeModule } from "../snowflake/snowflake.module";

@Module({
  imports: [PrismaModule, SnowflakeModule],
  providers: [MateriaService, MateriaRepository],
  controllers: [MateriaController],
  exports: [MateriaService],
})
export class MateriaModule {}
