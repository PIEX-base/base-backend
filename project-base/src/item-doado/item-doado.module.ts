import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { SnowflakeModule } from "../snowflake/snowflake.module";
import { ItemDoadoController } from "./item-doado.controller";
import { ItemDoadoService } from "./item-doado.service";
import { ItemDoadoRepository } from "./repositories/item-doado.repositories";

@Module({
  imports: [PrismaModule, SnowflakeModule],
  controllers: [ItemDoadoController],
  providers: [ItemDoadoService, ItemDoadoRepository],
  exports: [ItemDoadoService],
})
export class ItemDoadoModule {}
