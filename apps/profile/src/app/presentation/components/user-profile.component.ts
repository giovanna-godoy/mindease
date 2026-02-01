import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

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

  commonNeeds = [
    'TDAH',
    'TEA (Autismo)',
    'Dislexia',
    'Ansiedade',
    'Sobrecarga Sensorial',
    'Dificuldade de Foco',
    'Burnout',
  ];

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

  saveProfile(): void {
    localStorage.setItem('mindease-user-profile', JSON.stringify(this.profile));
    console.log('Profile saved to localStorage:', this.profile);
  }

  loadProfile(): void {
    const saved = localStorage.getItem('mindease-user-profile');
    if (saved) {
      this.profile = { ...this.profile, ...JSON.parse(saved) };
    }
  }

  ngOnInit(): void {
    this.loadProfile();
  }
}
