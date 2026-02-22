import { Observable } from 'rxjs';

export interface User {
  uid: string;
  email: string | null;
}

export interface AuthRepository {
  login(email: string, password: string): Observable<User>;
  register(email: string, password: string): Observable<User>;
  logout(): Observable<void>;
  getCurrentUser(): User | null;
  isLoggedIn(): boolean;
}
