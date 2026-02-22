jest.mock('@angular/common', () => ({ CommonModule: {} }));
jest.mock('@angular/forms', () => ({ FormsModule: {} }));
jest.mock('@angular/material/icon', () => ({ MatIconModule: {} }));
jest.mock('@angular/router', () => ({ Router: function Router() {} }));
jest.mock('../../services/firebase.service');
jest.mock('../../services/auth.service');

import { LoginComponent } from './login.component';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let mockAuthService: any;

  beforeEach(() => {
    mockAuthService = {
      login: jest.fn(),
      register: jest.fn(),
      syncUserData: jest.fn()
    };
    component = new LoginComponent(mockAuthService);
  });

  test('handleLogin success calls syncUserData', (done) => {
    mockAuthService.login.mockReturnValue(of({ uid: 'u1' }));
    component.email = 'test@test.com';
    component.password = 'pass';
    component['handleLogin']();
    setTimeout(() => {
      expect(mockAuthService.syncUserData).toHaveBeenCalled();
      done();
    }, 10);
  });

  test('handleLogin error sets errorMessage', (done) => {
    mockAuthService.login.mockReturnValue(throwError(() => ({ code: 'auth/invalid-credential' })));
    component.email = 'test@test.com';
    component.password = 'pass';
    component['handleLogin']();
    setTimeout(() => {
      expect(component.errorMessage).toBeTruthy();
      done();
    }, 10);
  });

  test('toggleMode switches between login and register', () => {
    expect(component.isLoginMode).toBe(true);
    component.toggleMode();
    expect(component.isLoginMode).toBe(false);
  });
});
