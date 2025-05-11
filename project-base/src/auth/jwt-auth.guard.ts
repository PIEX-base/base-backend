// src/auth/auth.guard.ts
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly authService: AuthService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    if (!authorization || authorization.trim() === '') {
      throw new UnauthorizedException('Please provide token');
    }

    const authToken = authorization.replace(/bearer/gim, '').trim();

    try {
      const decoded = await this.authService.validateToken(authToken);
      request.user = decoded;
      return true;
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
