import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { SnowflakeModule } from "../snowflake/snowflake.module";
import { MatriculaAtividadeController } from "./matriculaAtividade.controller";
import { MatriculaAtividadeService } from "./matriculaAtividade.service";
import { MatriculaAtividadeRepository } from "./repositories/matriculaAtividade.repository";

@Module({
  imports: [PrismaModule, SnowflakeModule],
  controllers: [MatriculaAtividadeController],
  providers: [MatriculaAtividadeService, MatriculaAtividadeRepository],
  exports: [MatriculaAtividadeService],
})
export class MatriculaAtividadeModule {}
