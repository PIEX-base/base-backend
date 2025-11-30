import { Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { SnowflakeModule } from "../snowflake/snowflake.module";
import { DoacaoController } from "./doacao.controller";
import { DoacaoService } from "./doacao.service";
import { DoacaoRepository } from "./repositories/doacao.repositories";

/**
 * Módulo de Doações
 * Gerencia tudo relacionado às doações recebidas pela organização.
 * Inclui doações monetárias e de materiais.
 */
@Module({
  imports: [PrismaModule, SnowflakeModule], // Conecta com o banco de dados e gera IDs únicos
  controllers: [DoacaoController], // Recebe as requisições HTTP
  providers: [DoacaoService, DoacaoRepository], // Lógica de negócio e acesso ao banco
  exports: [DoacaoService], // Permite que outros módulos usem o serviço de doações
})
export class DoacaoModule {}
