import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

type TimerMode = 'focus' | 'break';

@Component({
  selector: 'app-pomodoro-timer',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './pomodoro-timer.component.html',
})
export class PomodoroTimerComponent implements OnDestroy {
  mode: TimerMode = 'focus';
  timeLeft = 25 * 60; // 25 minutes in seconds
  isActive = false;
  completedCycles = 0;
  private interval?: number;
  
  private focusDuration = 25 * 60;
  private breakDuration = 5 * 60;

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
      } else {
        this.handleTimerComplete();
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
      // Show focus break alert
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('pomodoroFocusComplete');
        window.dispatchEvent(event);
      }
      this.mode = 'break';
      this.timeLeft = this.breakDuration;
    } else {
      // Show break end alert
      if (typeof window !== 'undefined') {
        const event = new CustomEvent('pomodoroBreakComplete');
        window.dispatchEvent(event);
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