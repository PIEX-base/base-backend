import { Module } from "@nestjs/common";
import { ProdutoService } from "./produto.service";
import { ProdutoController } from "./produto.controller";
import { ProdutoRepository } from "./repositories/produto.repository";
import { PrismaModule } from "../prisma/prisma.module";
import { SnowflakeModule } from "../snowflake/snowflake.module";

@Module({
  imports: [PrismaModule, SnowflakeModule],
  providers: [ProdutoService, ProdutoRepository],
  controllers: [ProdutoController],
  exports: [ProdutoService],
})
export class ProdutoModule {}
