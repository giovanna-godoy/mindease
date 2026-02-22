jest.mock('@angular/common', () => ({ CommonModule: {} }));
jest.mock('@angular/material/icon', () => ({ MatIconModule: {} }));

import { WelcomeDialogComponent } from './welcome-dialog.component';

describe('WelcomeDialogComponent', () => {
  let component: WelcomeDialogComponent;
  let mockUseCase: any;

  beforeEach(() => {
    mockUseCase = {
      hasSeenWelcome: jest.fn(),
      markWelcomeAsSeen: jest.fn()
    };
    component = new WelcomeDialogComponent(mockUseCase);
  });

  test('ngOnInit checks if welcome was seen', () => {
    mockUseCase.hasSeenWelcome.mockReturnValue(false);
    component.ngOnInit();
    expect(component.showDialog).toBe(true);
  });

  test('closeDialog marks welcome as seen', () => {
    component.closeDialog();
    expect(mockUseCase.markWelcomeAsSeen).toHaveBeenCalled();
    expect(component.showDialog).toBe(false);
  });

  test('nextStep increments currentStep', () => {
    component.currentStep = 0;
    component.nextStep();
    expect(component.currentStep).toBe(1);
  });

  test('prevStep decrements currentStep', () => {
    component.currentStep = 2;
    component.prevStep();
    expect(component.currentStep).toBe(1);
  });
});
