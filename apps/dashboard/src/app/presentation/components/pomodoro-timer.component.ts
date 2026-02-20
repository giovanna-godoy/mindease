import { Component, OnDestroy, ChangeDetectorRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

type TimerMode = 'focus' | 'break';

@Component({
  selector: 'app-pomodoro-timer',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './pomodoro-timer.component.html',
})
export class PomodoroTimerComponent implements OnDestroy, OnInit {
  mode: TimerMode = 'focus';
  timeLeft = 25 * 60;
  isActive = false;
  completedCycles = 0;
  focusDuration = 25 * 60;
  breakDuration = 5 * 60;
  isLoading = true;
  private interval?: number;

  constructor(private cdr: ChangeDetectorRef) {}

  async ngOnInit(): Promise<void> {
    await this.loadUserSettings();
    this.isLoading = false;
    this.cdr.detectChanges();
  }

  async loadUserSettings(): Promise<void> {
    if (typeof window !== 'undefined') {
      const firebaseService = (window as any).firebaseService;
      if (firebaseService) {
        const user = await firebaseService.waitForUser();
        if (user) {
          try {
            const profile = await firebaseService.getUserProfile(user.uid);
            if (profile?.studyRoutine) {
              this.focusDuration = (profile.studyRoutine.focusDuration || 25) * 60;
              this.breakDuration = (profile.studyRoutine.breakDuration || 5) * 60;
              this.timeLeft = this.focusDuration;
            }
          } catch (error) {
            console.error('Error loading user settings:', error);
          }
        }
      }
    }
  }

  get progress(): number {
    const maxTime = this.mode === 'focus' ? this.focusDuration : this.breakDuration;
    return ((maxTime - this.timeLeft) / maxTime) * 100;
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  toggleTimer(): void {
    this.isActive = !this.isActive;
    
    if (this.isActive) {
      this.startTimer();
    } else {
      this.pauseTimer();
    }
  }

  resetTimer(): void {
    this.pauseTimer();
    this.timeLeft = this.mode === 'focus' ? this.focusDuration : this.breakDuration;
  }

  switchMode(newMode: TimerMode): void {
    this.pauseTimer();
    this.mode = newMode;
    this.timeLeft = newMode === 'focus' ? this.focusDuration : this.breakDuration;
  }

  private startTimer(): void {
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
        this.cdr.detectChanges();
        
        if (this.timeLeft === 0) {
          this.handleTimerComplete();
        }
      }
    }, 1000);
  }

  private pauseTimer(): void {
    this.isActive = false;
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  private handleTimerComplete(): void {
    this.pauseTimer();
    
    if (this.mode === 'focus') {
      this.completedCycles++;
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('pomodoroFocusComplete');
        window.dispatchEvent(event);
        
        const notificationEvent = new CustomEvent('showNotification', {
          detail: {
            type: 'success',
            message: 'Ciclo de foco concluído! Hora de fazer uma pausa.',
            duration: 5000
          }
        });
        window.dispatchEvent(notificationEvent);
      }
      this.mode = 'break';
      this.timeLeft = this.breakDuration;
    } else {
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('pomodoroBreakComplete');
        window.dispatchEvent(event);
        
        const notificationEvent = new CustomEvent('showNotification', {
          detail: {
            type: 'info',
            message: 'Pausa concluída! Pronto para mais um ciclo de foco?',
            duration: 5000
          }
        });
        window.dispatchEvent(notificationEvent);
      }
      this.mode = 'focus';
      this.timeLeft = this.focusDuration;
    }
  }

  ngOnDestroy(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}