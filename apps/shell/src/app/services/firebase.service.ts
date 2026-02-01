import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User } from 'firebase/auth';
import { getFirestore, Firestore, doc, setDoc, getDoc } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { environment } from '../../environments/environment';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private app = initializeApp(environment.firebase);
  public auth: Auth = getAuth(this.app);
  public firestore: Firestore = getFirestore(this.app);
  private analytics = getAnalytics(this.app);

  constructor() {}

  // Authentication
  login(email: string, password: string): Observable<User> {
    return from(signInWithEmailAndPassword(this.auth, email, password).then(result => result.user));
  }

  register(email: string, password: string): Observable<User> {
    return from(createUserWithEmailAndPassword(this.auth, email, password).then(result => result.user));
  }

  logout(): Observable<void> {
    return from(signOut(this.auth));
  }

  getCurrentUser(): User | null {
    return this.auth.currentUser;
  }

  // User Profile
  async saveUserProfile(userId: string, profileData: any): Promise<void> {
    const userRef = doc(this.firestore, 'users', userId);
    await setDoc(userRef, profileData, { merge: true });
  }

  async getUserProfile(userId: string): Promise<any> {
    const userRef = doc(this.firestore, 'users', userId);
    const docSnap = await getDoc(userRef);
    return docSnap.exists() ? docSnap.data() : null;
  }

  // Tasks
  async saveTasks(userId: string, tasks: any[]): Promise<void> {
    const userRef = doc(this.firestore, 'users', userId);
    await setDoc(userRef, { tasks }, { merge: true });
  }

  async getUserTasks(userId: string): Promise<any[]> {
    const userRef = doc(this.firestore, 'users', userId);
    const docSnap = await getDoc(userRef);
    return docSnap.exists() ? docSnap.data()?.['tasks'] || [] : [];
  }

  // Settings
  async saveSettings(userId: string, settings: any): Promise<void> {
    const userRef = doc(this.firestore, 'users', userId);
    await setDoc(userRef, { settings }, { merge: true });
  }

  async getUserSettings(userId: string): Promise<any> {
    const userRef = doc(this.firestore, 'users', userId);
    const docSnap = await getDoc(userRef);
    return docSnap.exists() ? docSnap.data()?.['settings'] || {} : {};
  }
}