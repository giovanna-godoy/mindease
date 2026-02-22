jest.mock('@angular/common', () => ({ CommonModule: {} }));
jest.mock('@angular/material/icon', () => ({ MatIconModule: {} }));
jest.mock('@angular/router', () => ({ Router: function Router() {}, RouterModule: {} }));
jest.mock('../../services/firebase.service');
jest.mock('../../services/auth.service');

import { SidebarComponent } from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(() => {
    mockAuthService = { getCurrentUser: jest.fn(), logout: jest.fn() };
    mockRouter = { navigate: jest.fn() };
    component = new SidebarComponent(mockAuthService, mockRouter);
  });

  test('getUserName returns email prefix', () => {
    mockAuthService.getCurrentUser.mockReturnValue({ email: 'test@example.com' });
    expect(component.getUserName()).toBe('test');
  });

  test('getUserName returns Usuário when no user', () => {
    mockAuthService.getCurrentUser.mockReturnValue(null);
    expect(component.getUserName()).toBe('Usuário');
  });
});
