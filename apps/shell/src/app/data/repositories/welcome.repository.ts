import { Injectable } from '@angular/core';
import { WelcomeRepository } from '../../domain/interfaces/welcome.repository.interface';

@Injectable({ providedIn: 'root' })
export class LocalStorageWelcomeRepository implements WelcomeRepository {
  private readonly KEY = 'mindease-welcome-seen';

  hasSeenWelcome(): boolean {
    return localStorage.getItem(this.KEY) === 'true';
  }

  markWelcomeAsSeen(): void {
    localStorage.setItem(this.KEY, 'true');
  }
}
