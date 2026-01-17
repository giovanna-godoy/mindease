import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

interface StudyRoutine {
  preferredStartTime: string;
  preferredEndTime: string;
  focusDuration: number;
  breakDuration: number;
}

interface UserProfile {
  name: string;
  email: string;
  studyRoutine: StudyRoutine;
  specificNeeds: string[];
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule],
  templateUrl: './user-profile.component.html',
})
export class UserProfileComponent {
  profile: UserProfile = {
    name: '',
    email: '',
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
    console.log('Profile saved:', this.profile);
    // TODO: Implement actual save logic
  }
}
