import { Module } from "@nestjs/common";
import { CestaBasicaController } from "./cestabasica.controller";
import { CestaBasicaService } from "./cestabasica.service";
import { CestaBasicaRepository } from "./repositories/cestabasica.repository";
import { SnowflakeModule } from "src/snowflake/snowflake.module";
import { PrismaModule } from "src/prisma/prisma.module";

/**
 * Módulo de Cestas Básicas
 * Controla a distribuição de cestas básicas para as famílias cadastradas.
 * Registra entregas, quantidades e observações importantes.
 */
@Module({
  imports: [PrismaModule, SnowflakeModule], // Conecta com o banco de dados e gera IDs únicos
  controllers: [CestaBasicaController], // Recebe as requisições HTTP
  providers: [CestaBasicaService, CestaBasicaRepository], // Lógica de negócio e acesso ao banco
  exports: [CestaBasicaService], // Permite que outros módulos usem o serviço de cestas
})
export class CestaBasicaModule {}
