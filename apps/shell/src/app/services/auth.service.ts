import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from 'firebase/auth';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private firebaseService: FirebaseService) {
    this.firebaseService.auth.onAuthStateChanged(user => {
      this.currentUserSubject.next(user);
      if (user) {
        this.loadUserData(user.uid);
      }
    });
  }

  login(email: string, password: string): Observable<User> {
    return this.firebaseService.login(email, password);
  }

  register(email: string, password: string): Observable<User> {
    return this.firebaseService.register(email, password);
  }

  logout(): Observable<void> {
    return this.firebaseService.logout();
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  private async loadUserData(userId: string): Promise<void> {
    try {
      const profile = await this.firebaseService.getUserProfile(userId);
      const tasks = await this.firebaseService.getUserTasks(userId);
      const settings = await this.firebaseService.getUserSettings(userId);
      
      if (profile) localStorage.setItem('mindease-user-profile', JSON.stringify(profile));
      if (tasks) localStorage.setItem('mindease-tasks', JSON.stringify(tasks));
      if (settings) localStorage.setItem('mindease-settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  }

  async syncUserData(): Promise<void> {
    const user = this.getCurrentUser();
    if (!user) return;

    try {
      const profile = localStorage.getItem('mindease-user-profile');
      if (profile) {
        await this.firebaseService.saveUserProfile(user.uid, JSON.parse(profile));
      }

      const tasks = localStorage.getItem('mindease-tasks');
      if (tasks) {
        await this.firebaseService.saveTasks(user.uid, JSON.parse(tasks));
      }

      const settings = localStorage.getItem('mindease-settings');
      if (settings) {
        await this.firebaseService.saveSettings(user.uid, JSON.parse(settings));
      }
    } catch (error) {
      console.error('Error syncing user data:', error);
    }
  }
}