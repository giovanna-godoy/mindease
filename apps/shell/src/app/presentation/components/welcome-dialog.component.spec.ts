jest.mock('@angular/common', () => ({ CommonModule: {} }));
jest.mock('@angular/material/icon', () => ({ MatIconModule: {} }));
jest.mock('../../data/repositories/welcome.repository', () => ({
  LocalStorageWelcomeRepository: jest.fn().mockImplementation(() => ({
    hasSeenWelcome: jest.fn().mockReturnValue(false),
    markWelcomeAsSeen: jest.fn()
  }))
}));

import { WelcomeDialogComponent } from './welcome-dialog.component';

describe('WelcomeDialogComponent', () => {
  let component: WelcomeDialogComponent;

  beforeEach(() => {
    component = new WelcomeDialogComponent();
  });

  test('ngOnInit checks if welcome was seen', () => {
    component.ngOnInit();
    expect(component.isOpen).toBe(true);
  });

  test('close marks welcome as seen', () => {
    component.close();
    expect(component.isOpen).toBe(false);
  });
});
