import { AuthService } from './auth.service';
import { of } from 'rxjs';

describe('AuthService', () => {
  let service: AuthService;
  let mockFirebaseService: any;

  beforeEach(() => {
    mockFirebaseService = {
      login: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      getCurrentUser: jest.fn(),
      auth: { onAuthStateChanged: jest.fn() }
    };
    service = new AuthService(mockFirebaseService);
  });

  test('login calls firebase login', (done) => {
    mockFirebaseService.login.mockReturnValue(of({ uid: 'u1' }));
    service.login('test@test.com', 'pass').subscribe(user => {
      expect(user.uid).toBe('u1');
      done();
    });
  });

  test('register calls firebase register', (done) => {
    mockFirebaseService.register.mockReturnValue(of({ uid: 'u2' }));
    service.register('test@test.com', 'pass').subscribe(user => {
      expect(user.uid).toBe('u2');
      done();
    });
  });

  test('logout calls firebase logout', (done) => {
    mockFirebaseService.logout.mockReturnValue(of(undefined));
    service.logout().subscribe(() => {
      expect(mockFirebaseService.logout).toHaveBeenCalled();
      done();
    });
  });

  test('getCurrentUser returns firebase current user', () => {
    mockFirebaseService.getCurrentUser.mockReturnValue({ uid: 'u3' });
    expect(service.getCurrentUser()).toEqual({ uid: 'u3' });
  });
});
