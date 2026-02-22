import { CognitiveAlertsService } from './cognitive-alerts.service';

describe('CognitiveAlertsService', () => {
  let service: CognitiveAlertsService;

  beforeEach(() => {
    jest.useFakeTimers();
    (global as any).window = { 
      dispatchEvent: jest.fn(),
      setInterval: jest.fn((cb, time) => global.setInterval(cb, time)),
      clearInterval: jest.fn((id) => global.clearInterval(id))
    };
    (global as any).localStorage = { getItem: jest.fn(), setItem: jest.fn() };
    service = new CognitiveAlertsService();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('setEnabled updates enabled state', () => {
    service.setEnabled(false);
    expect(service.isEnabled()).toBe(false);
  });

  test('startTaskTracking sets up interval', () => {
    const setIntervalSpy = jest.spyOn(global, 'setInterval');
    service.startTaskTracking('Test Task');
    expect(setIntervalSpy).toHaveBeenCalled();
  });

  test('stopTaskTracking clears interval', () => {
    service.startTaskTracking('Task');
    const clearSpy = jest.spyOn(global, 'clearInterval');
    service.stopTaskTracking();
    expect(clearSpy).toHaveBeenCalled();
  });

  test('ngOnDestroy clears intervals', () => {
    service.startTaskTracking('Task');
    const clearSpy = jest.spyOn(global, 'clearInterval');
    service.ngOnDestroy();
    expect(clearSpy).toHaveBeenCalled();
  });
});
