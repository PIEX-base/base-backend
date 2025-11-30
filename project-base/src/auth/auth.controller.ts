import { Controller, Post, Body, HttpCode, HttpStatus, UseGuards, Request, Get } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { LocalAuthGuard } from "./local-auth.guard";
import { JwtAuthGuard } from "./dto/jwt-auth.guard";
import { RolesGuard } from "./roles.guard";
import { Roles, UserRole } from "./roles.decorator";
// Controller responsável pelas rotas de autenticação
@Controller("auth") // Define o prefixo da rota como /auth
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Endpoint de login protegido pelo LocalAuthGuard (validação das credenciais)
  @HttpCode(HttpStatus.OK)
  @UseGuards(LocalAuthGuard)
  @Post("login")
  async login(@Request() req: any, @Body() loginDto: LoginDto) {
    // Gera o token JWT para o usuário autenticado
    const result = await this.authService.generateToken(req.user);
    // Retorna o token e dados públicos do usuário
    return {
      ...result,
      user: {
        id: req.user.id_usuario,
        email: req.user.email,
        perfil: req.user.perfil,
        nome: req.user.nome,
      },
    };
  }

  // Rota protegida que retorna o perfil do usuário autenticado
  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Request() req: any) {
    return {
      id_usuario: req.user.id_usuario,
      email: req.user.email,
      perfil: req.user.perfil,
      nome: req.user.nome,
    };
  }

  // Endpoint acessível apenas por administradores protegidos por guardas JWT e RolesGuard
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get("admin-dashboard")
  adminDashboard(@Request() req: any) {
    return {
      message: "Acesso ao painel administrativo da ONG",
      user: req.user,
      permissions: ["manage_children", "manage_volunteers", "manage_reports"], // Permissões de administração
    };
  }

  // Endpoint para coordenadores, com múltiplos perfis permitidos
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get("coordenador-dashboard")
  coordenadorDashboard(@Request() req: any) {
    return {
      message: "Acesso ao painel de coordenação",
      user: req.user,
      permissions: ["view_children", "manage_activities", "view_reports"], // Permissões de coordenação
    };
  }

  // Endpoint para voluntários, protegido e com permissões específicas
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USUARIO, UserRole.ADMIN) // Permite tanto voluntários quanto administradores
  @Get("voluntario-area")
  voluntarioArea(@Request() req: any) {
    return {
      message: "Área do voluntário",
      user: req.user,
      permissions: ["view_assigned_children", "mark_attendance"], // Permissões dos voluntários
    };
  }

  // Endpoint para responsáveis/famílias
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.USUARIO, UserRole.ADMIN) // Permite tanto famílias quanto administradores
  @Get("familia-area")
  familiaArea(@Request() req: any) {
    return {
      message: "Área da família",
      user: req.user,
      permissions: ["view_children_progress", "update_family_info"], // Permissões familiares
    };
  }

  // Endpoint para logout autenticado
  @Post("logout")
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req: any) {
    // TODO: Implementar blacklist de tokens se necessário
    return { message: "Logout realizado com sucesso" };
  }
}
