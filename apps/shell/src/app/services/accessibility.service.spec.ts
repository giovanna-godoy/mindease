import { AccessibilityService } from './accessibility.service';

describe('AccessibilityService', () => {
  let service: AccessibilityService;
  const mockRendererFactory = {
    createRenderer: jest.fn().mockReturnValue({
      addClass: jest.fn(),
      removeClass: jest.fn()
    })
  };

  beforeEach(() => {
    (global as any).window = { addEventListener: jest.fn() };
    (global as any).localStorage = { getItem: jest.fn(), setItem: jest.fn() };
    service = new AccessibilityService(mockRendererFactory as any);
  });

  test('updateSpacing calls renderer', () => {
    service.updateSpacing('wide');
    expect(service.getCurrentSpacing()).toBe('wide');
  });

  test('updateComplexity calls renderer', () => {
    service.updateComplexity('simple');
    expect(service.getCurrentComplexity()).toBe('simple');
  });

  test('updateAnimations calls renderer', () => {
    service.updateAnimations('reduced');
    expect(service.getCurrentAnimation()).toBe('reduced');
  });

  test('updateFocusMode toggles state', () => {
    service.updateFocusMode(true);
    expect(service.getCurrentFocusMode()).toBe(true);
  });

  test('updateDetailedView toggles state', () => {
    service.updateDetailedView(true);
    expect(service.getCurrentDetailedView()).toBe(true);
  });
});
