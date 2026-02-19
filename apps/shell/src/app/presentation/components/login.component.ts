import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';

interface AccessibilitySettings {
  focusMode: boolean;
  contrastLevel: 'normal' | 'high' | 'very-high';
  spacingLevel: 'normal' | 'wide' | 'extra-wide';
  fontSize: 'normal' | 'large' | 'extra-large';
}

interface NavigationProfile {
  preferredNavigation: 'mouse' | 'keyboard' | 'both';
  enableShortcuts: boolean;
  reduceAnimations: boolean;
}

interface StudyRoutine {
  preferredStartTime: string;
  preferredEndTime: string;
  focusDuration: number;
  breakDuration: number;
}

interface UserProfile {
  name: string;
  email: string;
  accessibilitySettings: AccessibilitySettings;
  navigationProfile: NavigationProfile;
  studyRoutine: StudyRoutine;
  specificNeeds: string[];
}

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
  name = '';
  isLoginMode = true;
  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService) {}

  onSubmit(): void {
    if (this.isLoginMode) {
      this.handleLogin();
    } else {
      this.handleRegister();
    }
  }
  
  private handleLogin(): void {
    if (!this.email || !this.password) {
      this.errorMessage = 'Preencha todos os campos';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Digite um e-mail válido';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.email, this.password).subscribe({
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
  
  private handleRegister(): void {
    if (!this.name || !this.email || !this.password) {
      this.errorMessage = 'Preencha todos os campos obrigatórios';
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

    this.authService.register(this.email, this.password).subscribe({
      next: async (user) => {
        const basicProfile = {
          name: this.name,
          email: this.email
        };
        
        if (typeof window !== 'undefined') {
          const firebaseService = (window as any).firebaseService;
          if (firebaseService) {
            try {
              await firebaseService.saveUserProfile(user.uid, basicProfile);
            } catch (error) {
              localStorage.setItem('mindease-user-profile', JSON.stringify(basicProfile));
            }
          }
        }
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
    this.name = '';
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