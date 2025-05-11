import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  private readonly JWT_SECRET = 'secreta_chave';
  private readonly users = [
    { username: 'usuario1', password: '$2a$12$4FW2geW4b9a1NrTTjPCnReha5cnq30pOVM4Ej9e8GVTECMa3iWuMC' }, // senha123 criptografada
  ];

  async login(username: string, password: string) {
    const user = this.users.find(u => u.username === username);
    if (!user) {
      throw new Error('Usuário não encontrado');
    }

    console.log(password)

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Senha incorreta');
    }

    const token = jwt.sign({ username: user.username }, this.JWT_SECRET, { expiresIn: '1h' });
    return { message: 'Login bem-sucedido', token };
  }

  async validateToken(token: string) {
    try {
      return jwt.verify(token, this.JWT_SECRET);
    } catch (error) {
      throw new Error('Token inválido ou expirado');
    }
  }
}