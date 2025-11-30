import { Module } from "@nestjs/common";
import { ServicoPrestadoService } from "./servico-prestado.service";
import { ServicoPrestadoController } from "./servico-prestado.controller";
import { ServicoPrestadoRepository } from "./repositories/servico-prestado.repository";
import { PrismaModule } from "../prisma/prisma.module";
import { SnowflakeModule } from "../snowflake/snowflake.module";

@Module({
  imports: [PrismaModule, SnowflakeModule],
  providers: [ServicoPrestadoService, ServicoPrestadoRepository],
  controllers: [ServicoPrestadoController],
  exports: [ServicoPrestadoService],
})
export class ServicoPrestadoModule {}
