import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PomodoroTimerComponent } from './pomodoro-timer.component';
import { MatIconModule } from '@angular/material/icon';

describe('PomodoroTimerComponent', () => {
  let component: PomodoroTimerComponent;
  let fixture: ComponentFixture<PomodoroTimerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PomodoroTimerComponent, MatIconModule]
    }).compileComponents();

    fixture = TestBed.createComponent(PomodoroTimerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with focus mode', () => {
    expect(component.mode).toBe('focus');
    expect(component.timeLeft).toBe(25 * 60);
  });

  it('should format time correctly', () => {
    expect(component.formatTime(125)).toBe('02:05');
    expect(component.formatTime(0)).toBe('00:00');
    expect(component.formatTime(3600)).toBe('60:00');
  });

  it('should calculate progress correctly', () => {
    component.mode = 'focus';
    component.timeLeft = 25 * 60;
    expect(component.progress).toBe(0);
    
    component.timeLeft = 0;
    expect(component.progress).toBe(100);
  });

  it('should toggle timer state', () => {
    expect(component.isActive).toBe(false);
    component.toggleTimer();
    expect(component.isActive).toBe(true);
    component.toggleTimer();
    expect(component.isActive).toBe(false);
  });

  it('should reset timer', () => {
    component.timeLeft = 100;
    component.isActive = true;
    component.resetTimer();
    expect(component.timeLeft).toBe(25 * 60);
    expect(component.isActive).toBe(false);
  });

  it('should switch mode', () => {
    component.mode = 'focus';
    component.switchMode('break');
    expect(component.mode).toBe('break');
    expect(component.timeLeft).toBe(5 * 60);
  });

  it('should increment completed cycles', () => {
    component.completedCycles = 0;
    component.timeLeft = 0;
    component['handleTimerComplete']();
    expect(component.completedCycles).toBe(1);
  });
});