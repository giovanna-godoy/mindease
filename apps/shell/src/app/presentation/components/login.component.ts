import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
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

    this.isLoading = true;
    this.errorMessage = '';

    const authMethod = this.isLoginMode 
      ? this.authService.login(this.email, this.password)
      : this.authService.register(this.email, this.password);

    authMethod.subscribe({
      next: (user) => {
        console.log('Authentication successful:', user);
        this.isLoading = false;
        this.authService.syncUserData();
      },
      error: (error) => {
        console.error('Authentication error:', error);
        this.errorMessage = this.getErrorMessage(error.code);
        this.isLoading = false;
      }
    });
  }

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMessage = '';
  }

  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'Usuário não encontrado';
      case 'auth/wrong-password':
        return 'Senha incorreta';
      case 'auth/email-already-in-use':
        return 'E-mail já está em uso';
      case 'auth/weak-password':
        return 'Senha muito fraca';
      case 'auth/invalid-email':
        return 'E-mail inválido';
      default:
        return 'Erro na autenticação. Tente novamente.';
    }
  }
}