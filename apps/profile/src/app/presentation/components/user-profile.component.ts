import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';

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
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
  profile: UserProfile = {
    name: '',
    email: '',
    accessibilitySettings: {
      focusMode: false,
      contrastLevel: 'normal',
      spacingLevel: 'normal',
      fontSize: 'normal',
    },
    navigationProfile: {
      preferredNavigation: 'both',
      enableShortcuts: true,
      reduceAnimations: false,
    },
    studyRoutine: {
      preferredStartTime: '09:00',
      preferredEndTime: '18:00',
      focusDuration: 25,
      breakDuration: 5,
    },
    specificNeeds: [],
  };

  newNeed = '';
  private subscription?: Subscription;

  commonNeeds = [
    'TDAH',
    'TEA (Autismo)',
    'Dislexia',
    'Ansiedade',
    'Sobrecarga Sensorial',
    'Dificuldade de Foco',
    'Burnout',
  ];

  constructor(private router: Router, private cdr: ChangeDetectorRef) {}

  toggleNeed(need: string): void {
    if (this.profile.specificNeeds.includes(need)) {
      this.removeNeed(need);
    } else {
      this.profile.specificNeeds.push(need);
    }
  }

  removeNeed(need: string): void {
    this.profile.specificNeeds = this.profile.specificNeeds.filter(n => n !== need);
  }

  addCustomNeed(): void {
    if (this.newNeed.trim() && !this.profile.specificNeeds.includes(this.newNeed.trim())) {
      this.profile.specificNeeds.push(this.newNeed.trim());
      this.newNeed = '';
    }
  }

  ngOnInit(): void {
    this.loadProfile();
    this.subscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd && event.url.includes('/profile')) {
        setTimeout(() => this.loadProfile(), 0);
      }
    });
  }

  async saveProfile(): Promise<void> {
    if (typeof window !== 'undefined') {
      const firebaseService = (window as any).firebaseService;
      if (firebaseService) {
        const user = await firebaseService.waitForUser();
        if (user) {
          try {
            await firebaseService.saveUserProfile(user.uid, this.profile);
            this.showSuccessMessage();
          } catch (error) {
            console.error('Error saving profile:', error);
          }
        }
      }
    }
  }

  private showSuccessMessage(): void {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('showNotification', {
        detail: {
          type: 'success',
          message: 'Perfil salvo com sucesso!',
          duration: 3000
        }
      });
      window.dispatchEvent(event);
    }
  }

  async loadProfile(): Promise<void> {
    if (typeof window !== 'undefined') {
      const firebaseService = (window as any).firebaseService;
      if (firebaseService) {
        const user = await firebaseService.waitForUser();
        if (user) {
          this.profile.email = user.email || '';
          
          try {
            const profileData = await firebaseService.getUserProfile(user.uid);
            if (profileData) {
              this.profile = { ...this.profile, ...profileData, email: user.email };
            }
          } catch (error) {
            console.error('Error loading profile:', error);
          }
          this.cdr.detectChanges();
        }
      }
    }
  }


}
