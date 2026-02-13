import { TestBed } from '@angular/core/testing';
import { CognitiveAlertsService } from './cognitive-alerts.service';

describe('CognitiveAlertsService', () => {
  let service: CognitiveAlertsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CognitiveAlertsService);
    localStorage.clear();
  });

  afterEach(() => {
    service.ngOnDestroy();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should be enabled by default', () => {
    expect(service.isEnabled()).toBe(true);
  });

  it('should update enabled state', () => {
    service.setEnabled(false);
    expect(service.isEnabled()).toBe(false);
  });

  it('should start task tracking', () => {
    spyOn<any>(service, 'checkTaskDuration');
    service.startTaskTracking('task-1');
    expect(service['currentTaskId']).toBe('task-1');
    expect(service['taskStartTime']).toBeTruthy();
  });

  it('should stop task tracking', () => {
    service.startTaskTracking('task-1');
    service.stopTaskTracking();
    expect(service['currentTaskId']).toBeNull();
    expect(service['taskStartTime']).toBeNull();
  });

  it('should not track when disabled', () => {
    service.setEnabled(false);
    service.startTaskTracking('task-1');
    expect(service['taskStartTime']).toBeNull();
  });
});