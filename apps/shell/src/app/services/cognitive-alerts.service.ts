import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CognitiveAlertsService {
  private taskStartTime: number | null = null;
  private currentTaskId: string | null = null;
  private alertInterval?: number;
  private breakInterval?: number;
  private enabled = true;
  
  private readonly FOCUS_TIME_LIMIT = 25 * 60 * 1000;
  private readonly BREAK_REMINDER_INTERVAL = 50 * 60 * 1000;

  constructor() {
    this.loadSettings();
    this.startBreakReminder();
  }

  startTaskTracking(taskId: string): void {
    if (!this.enabled) return;
    
    this.currentTaskId = taskId;
    this.taskStartTime = Date.now();
    
    this.alertInterval = window.setInterval(() => {
      this.checkTaskDuration();
    }, 5 * 60 * 1000);
  }

  stopTaskTracking(): void {
    this.currentTaskId = null;
    this.taskStartTime = null;
    
    if (this.alertInterval) {
      clearInterval(this.alertInterval);
    }
  }

  private checkTaskDuration(): void {
    if (!this.taskStartTime || !this.enabled) return;
    
    const duration = Date.now() - this.taskStartTime;
    
    if (duration >= this.FOCUS_TIME_LIMIT) {
      this.showAlert(
        'warning',
        'Tempo de Foco Prolongado',
        'Você está nesta tarefa há mais de 25 minutos. Considere fazer uma pausa.'
      );
    }
  }

  private startBreakReminder(): void {
    this.breakInterval = window.setInterval(() => {
      if (this.enabled) {
        this.showAlert(
          'info',
          'Lembrete de Pausa',
          'Que tal fazer uma pausa? Levante-se, estique-se e descanse os olhos.'
        );
      }
    }, this.BREAK_REMINDER_INTERVAL);
  }

  private showAlert(type: string, title: string, message: string): void {
    if (typeof window !== 'undefined') {
      const event = new CustomEvent('showNotification', {
        detail: {
          type: type,
          message: `${title}: ${message}`,
          duration: 8000
        }
      });
      window.dispatchEvent(event);
    }
  }

  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
    this.saveSettings();
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  private loadSettings(): void {
    if (typeof window !== 'undefined') {
      const firebaseService = (window as any).firebaseService;
      if (firebaseService && firebaseService.getCurrentUser()) {
        const user = firebaseService.getCurrentUser();
        firebaseService.getUserSettings(user.uid).then((settings: any) => {
          this.enabled = settings?.cognitiveAlertsEnabled !== false;
        }).catch(() => {
          const saved = localStorage.getItem('cognitive-alerts-enabled');
          this.enabled = saved !== 'false';
        });
      }
    }
  }

  private saveSettings(): void {
    if (typeof window !== 'undefined') {
      const firebaseService = (window as any).firebaseService;
      if (firebaseService && firebaseService.getCurrentUser()) {
        const user = firebaseService.getCurrentUser();
        firebaseService.getUserSettings(user.uid).then((settings: any) => {
          const updatedSettings = { ...settings, cognitiveAlertsEnabled: this.enabled };
          return firebaseService.saveSettings(user.uid, updatedSettings);
        }).catch(() => {
          localStorage.setItem('cognitive-alerts-enabled', this.enabled.toString());
        });
      } else {
        localStorage.setItem('cognitive-alerts-enabled', this.enabled.toString());
      }
    }
  }

  ngOnDestroy(): void {
    if (this.alertInterval) {
      clearInterval(this.alertInterval);
    }
    if (this.breakInterval) {
      clearInterval(this.breakInterval);
    }
  }
}