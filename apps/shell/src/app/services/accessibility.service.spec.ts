import { AccessibilityService } from './accessibility.service';

describe('AccessibilityService', () => {
  let service: AccessibilityService;

  beforeEach(() => {
    service = new AccessibilityService();
    document.documentElement.className = '';
  });

  test('updateSpacing adds correct class', () => {
    service.updateSpacing('wide');
    expect(document.documentElement.classList.contains('wide-spacing')).toBe(true);
  });

  test('updateComplexity adds correct class', () => {
    service.updateComplexity('simple');
    expect(document.documentElement.classList.contains('simple-complexity')).toBe(true);
  });

  test('updateAnimations adds correct class', () => {
    service.updateAnimations('reduced');
    expect(document.documentElement.classList.contains('reduced-motion')).toBe(true);
  });

  test('updateFocusMode toggles focus-mode class', () => {
    service.updateFocusMode(true);
    expect(document.documentElement.classList.contains('focus-mode')).toBe(true);
    service.updateFocusMode(false);
    expect(document.documentElement.classList.contains('focus-mode')).toBe(false);
  });

  test('updateDetailedView toggles detailed-view class', () => {
    service.updateDetailedView(true);
    expect(document.documentElement.classList.contains('detailed-view')).toBe(true);
  });
});
