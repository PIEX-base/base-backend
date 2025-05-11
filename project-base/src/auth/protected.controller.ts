import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '../auth/jwt-auth.guard';

@UseGuards(AuthGuard)
@Controller('protegido')
export class ProtectedController {
    @Get()
    getProtectedData(@Req() req) {
        return {
            message: 'Rota protegida acessada.',
            user: req.decodedData,
        };
    }
}