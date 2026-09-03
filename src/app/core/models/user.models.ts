export type UserRole = 'administrador' | 'administrativo' | 'capacitador' | 'cargador';

export const ROLE_LABELS: Record<UserRole, string> = {
  administrador: 'Administrador',
  administrativo: 'Administrativo',
  capacitador: 'Capacitador',
  cargador: 'Cargador de Eventos',
};

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  role?: UserRole;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
