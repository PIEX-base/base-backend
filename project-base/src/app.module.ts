import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { AuthModule } from './auth/auth.module';
import { ProtectedController } from "./auth/protected.controller";
import { AuthGuard } from "./auth/jwt-auth.guard";
import { AuthService } from "./auth/auth.service";

@Module({
  imports: [AuthModule],
  controllers: [AppController, ProtectedController],
  providers: [AppService, AuthGuard, AuthService],
})
export class AppModule {}
