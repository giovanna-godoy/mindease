import { Observable } from 'rxjs';
import { AuthRepository, User } from '../interfaces/auth.repository.interface';

export class AuthUseCase {
  constructor(private repository: AuthRepository) {}

  login(email: string, password: string): Observable<User> {
    if (!this.isValidEmail(email)) {
      throw new Error('Email inválido');
    }
    if (!this.isValidPassword(password)) {
      throw new Error('Senha deve ter no mínimo 6 caracteres');
    }
    return this.repository.login(email, password);
  }

  register(email: string, password: string): Observable<User> {
    if (!this.isValidEmail(email)) {
      throw new Error('Email inválido');
    }
    if (!this.isValidPassword(password)) {
      throw new Error('Senha deve ter no mínimo 6 caracteres');
    }
    return this.repository.register(email, password);
  }

  logout(): Observable<void> {
    return this.repository.logout();
  }

  getCurrentUser(): User | null {
    return this.repository.getCurrentUser();
  }

  isAuthenticated(): boolean {
    return this.repository.isLoggedIn();
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  private isValidPassword(password: string): boolean {
    return password.length >= 6;
  }
}
