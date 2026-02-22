jest.mock('@angular/common', () => ({ CommonModule: {} }));
jest.mock('@angular/forms', () => ({ FormsModule: {} }));
jest.mock('@angular/material/icon', () => ({ MatIconModule: {} }));
jest.mock('@angular/router', () => ({ Router: function Router() {} }));

import { LoginComponent } from './login.component';
import { of, throwError } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(() => {
    mockAuthService = {
      login: jest.fn(),
      register: jest.fn()
    };
    mockRouter = { navigate: jest.fn() };
    component = new LoginComponent(mockAuthService, mockRouter);
  });

  test('login success navigates to home', async () => {
    mockAuthService.login.mockReturnValue(of({ uid: 'u1' }));
    component.email = 'test@test.com';
    component.password = 'pass';
    await component.login();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  test('login error sets errorMessage', async () => {
    mockAuthService.login.mockReturnValue(throwError(() => new Error('fail')));
    component.email = 'test@test.com';
    component.password = 'pass';
    await component.login();
    expect(component.errorMessage).toBeTruthy();
  });

  test('register success navigates to home', async () => {
    mockAuthService.register.mockReturnValue(of({ uid: 'u2' }));
    component.email = 'new@test.com';
    component.password = 'pass';
    await component.register();
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
  });

  test('toggleMode switches between login and register', () => {
    expect(component.isLoginMode).toBe(true);
    component.toggleMode();
    expect(component.isLoginMode).toBe(false);
  });
});
