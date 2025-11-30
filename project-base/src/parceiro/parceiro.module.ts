import { Module } from "@nestjs/common";
import { ParceiroService } from "./parceiro.service";
import { ParceiroController } from "./parceiro.controller";
import { ParceiroRepository } from "./repositories/parceiro.repository";
import { PrismaModule } from "../prisma/prisma.module";
import { SnowflakeModule } from "../snowflake/snowflake.module";

@Module({
  imports: [PrismaModule, SnowflakeModule],
  providers: [ParceiroService, ParceiroRepository],
  controllers: [ParceiroController],
  exports: [ParceiroService],
})
export class ParceiroModule {}
