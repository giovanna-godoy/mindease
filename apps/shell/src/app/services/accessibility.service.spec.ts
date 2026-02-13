import { TestBed } from '@angular/core/testing';
import { AccessibilityService, SpacingLevel, AnimationLevel, ComplexityLevel } from './accessibility.service';

describe('AccessibilityService', () => {
  let service: AccessibilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccessibilityService);
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Spacing', () => {
    it('should update spacing level', (done) => {
      service.updateSpacing('wide');
      service.spacing$.subscribe(level => {
        expect(level).toBe('wide');
        done();
      });
    });

    it('should return current spacing', () => {
      service.updateSpacing('extra-wide');
      expect(service.getCurrentSpacing()).toBe('extra-wide');
    });
  });

  describe('Animations', () => {
    it('should update animation level', (done) => {
      service.updateAnimations('reduced');
      service.animation$.subscribe(level => {
        expect(level).toBe('reduced');
        done();
      });
    });

    it('should return current animation', () => {
      service.updateAnimations('none');
      expect(service.getCurrentAnimation()).toBe('none');
    });
  });

  describe('Focus Mode', () => {
    it('should update focus mode', (done) => {
      service.updateFocusMode(true);
      service.focusMode$.subscribe(enabled => {
        expect(enabled).toBe(true);
        done();
      });
    });

    it('should return current focus mode', () => {
      service.updateFocusMode(false);
      expect(service.getCurrentFocusMode()).toBe(false);
    });
  });

  describe('Detailed View', () => {
    it('should update detailed view', (done) => {
      service.updateDetailedView(true);
      service.detailedView$.subscribe(enabled => {
        expect(enabled).toBe(true);
        done();
      });
    });

    it('should return current detailed view', () => {
      service.updateDetailedView(true);
      expect(service.getCurrentDetailedView()).toBe(true);
    });
  });

  describe('Complexity', () => {
    it('should update complexity level', (done) => {
      service.updateComplexity('simple');
      service.complexity$.subscribe(level => {
        expect(level).toBe('simple');
        done();
      });
    });

    it('should return current complexity', () => {
      service.updateComplexity('complete');
      expect(service.getCurrentComplexity()).toBe('complete');
    });
  });
});