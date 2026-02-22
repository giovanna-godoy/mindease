jest.mock('@angular/common', () => ({ CommonModule: {} }));
jest.mock('@angular/forms', () => ({ FormsModule: {} }));
jest.mock('@angular/material/icon', () => ({ MatIconModule: {} }));
jest.mock('@angular/router', () => ({ Router: function Router() {}, NavigationEnd: function NavigationEnd() {} }));

import { UserProfileComponent } from './user-profile.component';

describe('UserProfileComponent', () => {
  let comp: UserProfileComponent;
  const mockCdr: any = { detectChanges: jest.fn() };

  beforeEach(() => {
    comp = new UserProfileComponent({} as any, mockCdr as any);
    (global as any).window = (global as any).window || {};
  });

  test('toggleNeed adds and removes need', () => {
    comp.profile.specificNeeds = [];
    comp.toggleNeed('TDAH');
    expect(comp.profile.specificNeeds).toContain('TDAH');
    comp.toggleNeed('TDAH');
    expect(comp.profile.specificNeeds).not.toContain('TDAH');
  });

  test('addCustomNeed adds when newNeed valid', () => {
    comp.newNeed = 'Nova';
    comp.profile.specificNeeds = [];
    comp.addCustomNeed();
    expect(comp.profile.specificNeeds).toContain('Nova');
    expect(comp.newNeed).toBe('');
  });

  test('removeNeed removes specific need', () => {
    comp.profile.specificNeeds = ['A', 'B'];
    comp.removeNeed('A');
    expect(comp.profile.specificNeeds).toEqual(['B']);
  });
});
