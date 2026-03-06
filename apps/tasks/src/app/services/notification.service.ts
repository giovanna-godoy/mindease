import { Injectable } from '@angular/core';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  showSuccess(message: string, duration = 3000): void {
    this.showNotification('success', message, duration);
  }

  showError(message: string, duration = 5000): void {
    this.showNotification('warning', message, duration);
  }

  showInfo(message: string, duration = 3000): void {
    this.showNotification('info', message, duration);
  }

  private showNotification(type: NotificationType, message: string, duration: number): void {
    const event = new CustomEvent('showNotification', {
      detail: { type, message, duration }
    });
    window.dispatchEvent(event);
  }
}
