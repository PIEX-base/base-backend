import { Logger, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

// Middleware para auditoria das requisições HTTP
// Define a interface ampliada para Request com usuário opcional
interface RequestWithUser extends Request {
  user?: {
    perfil: any;
    email?: string;
  };
}
// Middleware que faz log das requisições recebidas
export class AuditMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuditMiddleware.name);
  // Define a informação do usuário para log, ou "Anonymous" se não autenticado

  use(req: RequestWithUser, res: Response, next: NextFunction) {
    const userInfo = req.user ? `${req.user.email} (${req.user.perfil})` : "Anonymous";

    const logData = {
      timestamp: new Date().toISOString(), // Timestamp do log
      method: req.method, // Método HTTP
      url: req.url, // URL da requisição
      userAgent: req.get("User-Agent"), // User-Agent do cliente
      ip: req.ip, // IP do cliente
      user: userInfo, // Informação do usuário
    };
    // Para ações críticas, futuramente pode salvar log no banco para ações de modificação
    this.logger.log(`${logData.method} ${logData.url} - User: ${logData.user}`);

    // Para ações críticas, salvar no banco
    if (req.method !== "GET") {
      // TODO: Implementar log no banco para ações de modificação
    }
    // Continua para o próximo middleware/controlador
    next();
  }
}
