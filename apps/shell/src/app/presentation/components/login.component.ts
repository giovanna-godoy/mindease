import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  isLoginMode = true;
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Preencha todos os campos';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Digite um e-mail válido';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'A senha deve ter pelo menos 6 caracteres';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const authMethod = this.isLoginMode 
      ? this.authService.login(this.email, this.password)
      : this.authService.register(this.email, this.password);

    authMethod.subscribe({
      next: (user) => {
        this.isLoading = false;
        this.authService.syncUserData();
      },
      error: (error) => {
        this.errorMessage = this.getErrorMessage(error.code);
        this.isLoading = false;
      }
    });
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
    this.email = '';
    this.password = '';
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/invalid-credential':
        return 'Credenciais inválidas. Verifique seu e-mail e senha.';
      case 'auth/user-not-found':
        return 'Usuário não encontrado. Verifique seu e-mail.';
      case 'auth/wrong-password':
        return 'Senha incorreta. Tente novamente.';
      case 'auth/email-already-in-use':
        return 'Este e-mail já está em uso. Tente fazer login.';
      case 'auth/weak-password':
        return 'Senha muito fraca. Use pelo menos 6 caracteres.';
      case 'auth/invalid-email':
        return 'E-mail inválido. Verifique o formato.';
      case 'auth/too-many-requests':
        return 'Muitas tentativas. Tente novamente mais tarde.';
      case 'auth/network-request-failed':
        return 'Erro de conexão. Verifique sua internet.';
      case 'auth/user-disabled':
        return 'Esta conta foi desabilitada.';
      case 'auth/operation-not-allowed':
        return 'Operação não permitida. Contate o suporte.';
      default:
        return `Erro na autenticação: ${errorCode || 'Tente novamente.'}`;
    }
  }
}