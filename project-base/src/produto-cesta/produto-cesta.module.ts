import { Module } from "@nestjs/common";
import { ProdutoCestaService } from "./produto-cesta.service";
import { ProdutoCestaController } from "./produto-cesta.controller";
import { ProdutoCestaRepository } from "./repositories/produto-cesta.repository";
import { PrismaModule } from "../prisma/prisma.module";
import { SnowflakeModule } from "../snowflake/snowflake.module";

@Module({
  imports: [PrismaModule, SnowflakeModule],
  providers: [ProdutoCestaService, ProdutoCestaRepository],
  controllers: [ProdutoCestaController],
  exports: [ProdutoCestaService],
})
export class ProdutoCestaModule {}
