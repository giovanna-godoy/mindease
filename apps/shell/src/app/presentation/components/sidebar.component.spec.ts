jest.mock('@angular/common', () => ({ CommonModule: {} }));
jest.mock('@angular/material/icon', () => ({ MatIconModule: {} }));
jest.mock('@angular/router', () => ({ 
  Router: function Router() {},
  RouterModule: {},
  NavigationEnd: class NavigationEnd {}
}));
jest.mock('../../services/firebase.service');
jest.mock('../../services/auth.service');

import { SidebarComponent } from './sidebar.component';
import { of } from 'rxjs';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let mockAuthService: any;
  let mockRouter: any;

  beforeEach(() => {
    mockAuthService = { 
      getCurrentUser: jest.fn(),
      logout: jest.fn().mockReturnValue(of(undefined))
    };
    mockRouter = { 
      navigate: jest.fn(),
      url: '/dashboard',
      events: of()
    };
    component = new SidebarComponent(mockRouter, mockAuthService);
  });

  test('navigate changes currentPage and calls router', () => {
    component.navigate('tasks');
    expect(component.currentPage).toBe('tasks');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/tasks']);
  });

  test('toggleMobileMenu toggles state', () => {
    expect(component.isMobileMenuOpen).toBe(false);
    component.toggleMobileMenu();
    expect(component.isMobileMenuOpen).toBe(true);
  });

  test('logout clears localStorage and navigates', (done) => {
    const clearSpy = jest.spyOn(Storage.prototype, 'clear');
    component.logout();
    setTimeout(() => {
      expect(clearSpy).toHaveBeenCalled();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
      done();
    }, 10);
  });
});
