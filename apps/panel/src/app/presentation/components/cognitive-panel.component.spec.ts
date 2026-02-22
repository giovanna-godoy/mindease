// Mock Angular and child components
jest.mock('@angular/common', () => ({ CommonModule: {} }));
jest.mock('@angular/material/icon', () => ({ MatIconModule: {} }));
jest.mock('./spacing-control.component', () => ({ SpacingControlComponent: {} }));
jest.mock('./animation-control.component', () => ({ AnimationControlComponent: {} }));
jest.mock('@angular/router', () => ({ Router: function Router() {}, NavigationEnd: function NavigationEnd() {} }));

import { CognitivePanelComponent } from './cognitive-panel.component';

describe('CognitivePanelComponent', () => {
  let comp: CognitivePanelComponent;
  const mockCdr: any = { detectChanges: jest.fn() };

  beforeEach(() => {
    comp = new CognitivePanelComponent({} as any, mockCdr as any);
    (global as any).window = (global as any).window || {};
  });

  test('updateSettings merges and triggers save and show', () => {
    comp.saveSettings = jest.fn();
    (comp as any).showSuccessMessage = jest.fn();
    comp.updateSettings({ contrastLevel: 'high' });
    expect(comp.settings.contrastLevel).toBe('high');
    expect(comp.saveSettings).toHaveBeenCalled();
    expect((comp as any).showSuccessMessage).toHaveBeenCalled();
  });

  test('setSpacing calls accessibility service when present', () => {
    const accessibilityService = { updateSpacing: jest.fn() };
    (global as any).window.accessibilityService = accessibilityService;
    comp.setSpacing('wide');
    expect(comp.settings.spacingLevel).toBe('wide');
    expect(accessibilityService.updateSpacing).toHaveBeenCalledWith('wide');
  });

  test('toggleFocusMode updates and calls accessibilityService', () => {
    const accessibilityService = { updateFocusMode: jest.fn() };
    (global as any).window.accessibilityService = accessibilityService;
    comp.settings.focusMode = false;
    comp.toggleFocusMode();
    expect(comp.settings.focusMode).toBe(true);
    // implementation calls updateFocusMode with the previous value (!this.settings.focusMode)
    expect(accessibilityService.updateFocusMode).toHaveBeenCalledWith(false);
  });

  test('toggleCognitiveAlerts calls cognitiveAlertsService when present', () => {
    const cognitiveAlertsService = { setEnabled: jest.fn() };
    (global as any).window.cognitiveAlertsService = cognitiveAlertsService;
    comp.settings.enableCognitiveAlerts = true;
    comp.toggleCognitiveAlerts();
    expect(comp.settings.enableCognitiveAlerts).toBe(false);
    // implementation calls setEnabled with the previous value (!this.settings.enableCognitiveAlerts)
    expect(cognitiveAlertsService.setEnabled).toHaveBeenCalledWith(true);
  });

  test('resetSettings restores defaults and shows message', () => {
    (comp as any).applySettings = jest.fn();
    (comp as any).showSuccessMessage = jest.fn();
    comp.resetSettings();
    expect(comp.settings.complexityLevel).toBe('medium');
    expect((comp as any).applySettings).toHaveBeenCalled();
    expect((comp as any).showSuccessMessage).toHaveBeenCalled();
  });
});
