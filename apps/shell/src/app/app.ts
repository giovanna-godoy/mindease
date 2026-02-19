import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { WelcomeDialogComponent } from './presentation/components/welcome-dialog.component';
import { SidebarComponent } from './presentation/components/sidebar.component';
import { LoginComponent } from './presentation/components/login.component';
import { NotificationComponent } from './presentation/components/notification.component';
import { LofiPlayerComponent } from './presentation/components/lofi-player.component';
import { AuthService } from './services/auth.service';
import { FirebaseService } from './services/firebase.service';
import { AccessibilityService } from './services/accessibility.service';
import { CognitiveAlertsService } from './services/cognitive-alerts.service';
import { Observable } from 'rxjs';
import { User } from 'firebase/auth';

@Component({
  imports: [RouterModule, CommonModule, WelcomeDialogComponent, SidebarComponent, LoginComponent, NotificationComponent, LofiPlayerComponent],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected title = 'shell';
  currentUser$: Observable<User | null>;

  constructor(
    private authService: AuthService,
    private firebaseService: FirebaseService,
    private accessibilityService: AccessibilityService,
    private cognitiveAlertsService: CognitiveAlertsService
  ) {
    this.currentUser$ = this.authService.currentUser$;
    if (typeof window !== 'undefined') {
      (window as any).firebaseService = this.firebaseService;
      (window as any).accessibilityService = this.accessibilityService;
      (window as any).cognitiveAlertsService = this.cognitiveAlertsService;
    }
  }

  ngOnInit(): void {
  }
}
