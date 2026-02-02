import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WelcomeDialogComponent } from './presentation/components/welcome-dialog.component';
import { SidebarComponent } from './presentation/components/sidebar.component';
import { LoginComponent } from './presentation/components/login.component';
import { AuthService } from './services/auth.service';
import { FirebaseService } from './services/firebase.service';
import { Observable } from 'rxjs';
import { User } from 'firebase/auth';

@Component({
  imports: [RouterModule, CommonModule, WelcomeDialogComponent, SidebarComponent, LoginComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected title = 'shell';
  currentUser$: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private firebaseService: FirebaseService
  ) {
    this.currentUser$ = this.authService.currentUser$;
    if (typeof window !== 'undefined') {
      (window as any).firebaseService = this.firebaseService;
    }
  }

  ngOnInit(): void {
  }
}
