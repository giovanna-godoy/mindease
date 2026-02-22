import { CognitiveAlertsService } from './cognitive-alerts.service';

describe('CognitiveAlertsService', () => {
  let service: CognitiveAlertsService;

  beforeEach(() => {
    jest.useFakeTimers();
    service = new CognitiveAlertsService();
    window.dispatchEvent = jest.fn();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
  });

  test('setEnabled updates enabled state', () => {
    service.setEnabled(false);
    expect(service['enabled']).toBe(false);
  });

  test('startTaskTracking dispatches transition notification', () => {
    service.startTaskTracking('Test Task');
    expect(window.dispatchEvent).toHaveBeenCalled();
  });

  test('stopTaskTracking clears interval', () => {
    service.startTaskTracking('Task');
    const clearSpy = jest.spyOn(global, 'clearInterval');
    service.stopTaskTracking();
    expect(clearSpy).toHaveBeenCalled();
  });

  test('destroy clears interval', () => {
    service.startTaskTracking('Task');
    const clearSpy = jest.spyOn(global, 'clearInterval');
    service.destroy();
    expect(clearSpy).toHaveBeenCalled();
  });
});
