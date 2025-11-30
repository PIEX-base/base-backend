import { Module, NestModule, MiddlewareConsumer } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { PrismaModule } from "./prisma/prisma.module";
import { UserModule } from "./user/user.module";
import { CriancaModule } from "./crianca/crianca.module";
import { ResponsavelModule } from "./responsavel/responsavel.module";
import { VoluntarioModule } from "./voluntario/voluntario.module";
import { FamiliaModule } from "./familia/familia.module";
import { AuthModule } from "./auth/auth.module";
import { AuditMiddleware } from "./auth/auditMiddleware";
import { PessoaModule } from "./pessoa/pessoa.module";
import { DoacaoModule } from "./doacao/doacao.module";
import { ItemDoadoModule } from "./item-doado/item-doado.module";
import { AtividadeModule } from "./atividade/atividade.module";
import { AtividadeVoluntarioModule } from "./atividade-voluntario/atividade-voluntario.module";


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PessoaModule,
    AuthModule,
    PrismaModule,
    UserModule,
    CriancaModule,
    ResponsavelModule,
    VoluntarioModule,
    FamiliaModule,
    PessoaModule,
    BeneficiarioExternoModule,
    ParceiroModule,
    DoacaoModule,
    ItemDoadoModule,
    AtividadeVoluntarioModule,
    ServicoPrestadoModule,
    ProdutoModule,
    ProdutoCestaModule,
    AtividadeModule,
    MateriaModule,
    CestaBasicaModule,
    FrequenciaModule,
    DoacaoModule,
    ItemDoadoModule,
    AtividadeVoluntarioModule,
    AtividadeModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuditMiddleware).forRoutes("*"); // Aplica o middleware em todas as rotas
  }
}
