import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getAuth, Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, User, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore, Firestore, doc, setDoc, getDoc, collection, query, where, getDocs, addDoc, updateDoc, deleteDoc } from 'firebase/firestore';
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

  constructor() {
    setPersistence(this.auth, browserLocalPersistence).catch(() => {});
  }

  login(email: string, password: string): Observable<User> {
    return from(signInWithEmailAndPassword(this.auth, email.trim(), password).then(result => result.user));
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

  waitForUser(): Promise<User | null> {
    return new Promise((resolve) => {
      if (this.auth.currentUser) {
        resolve(this.auth.currentUser);
      } else {
        const unsubscribe = this.auth.onAuthStateChanged(user => {
          unsubscribe();
          resolve(user);
        });
      }
    });
  }

  async saveUserProfile(userId: string, profileData: any): Promise<void> {
    const userRef = doc(this.firestore, 'users', userId);
    await setDoc(userRef, profileData, { merge: true });
  }

  async getUserProfile(userId: string): Promise<any> {
    const userRef = doc(this.firestore, 'users', userId);
    const docSnap = await getDoc(userRef);
    return docSnap.exists() ? docSnap.data() : null;
  }

  async saveTask(userId: string, task: any): Promise<string> {
    const tasksRef = collection(this.firestore, 'tasks');
    if (task.id && task.id.startsWith('task_')) {
      const taskRef = doc(this.firestore, 'tasks', task.id);
      await updateDoc(taskRef, { ...task, userId, updatedAt: new Date() });
      return task.id;
    } else {
      const docRef = await addDoc(tasksRef, { ...task, userId, createdAt: new Date(), updatedAt: new Date() });
      return docRef.id;
    }
  }

  async getUserTasks(userId: string): Promise<any[]> {
    const tasksRef = collection(this.firestore, 'tasks');
    const q = query(tasksRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  async deleteTask(userId: string, taskId: string): Promise<void> {
    const taskRef = doc(this.firestore, 'tasks', taskId);
    await deleteDoc(taskRef);
  }

  async saveTasks(userId: string, tasks: any[]): Promise<void> {
    for (const task of tasks) {
      await this.saveTask(userId, task);
    }
  }

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