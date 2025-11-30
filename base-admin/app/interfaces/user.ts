export interface User {
  id_usuario: number;
  nome: string;
  email: string;
  perfil: string;
  data_cadastro: string;
}

export interface UserUpdatePayload {
  nome?: string;
  email?: string;
  senha_atual?: string;
  nova_senha?: string;
}

export interface UserCreatePayload {
  nome: string;
  email: string;
  senha: string;
  perfil: string;
}

export interface LoginCredentials {
  email: string;
  senha: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    id: string;
    nome: string;
    email: string;
    perfil: string;
  };
}
