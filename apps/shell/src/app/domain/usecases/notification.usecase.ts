import { NotificationRepository, Notification } from '../interfaces/notification.repository.interface';

export class NotificationUseCase {
  constructor(private repository: NotificationRepository) {}

  showInfo(message: string, duration?: number): void {
    this.repository.add({ message, type: 'info', duration });
  }

  showSuccess(message: string, duration?: number): void {
    this.repository.add({ message, type: 'success', duration });
  }

  showWarning(message: string, duration?: number): void {
    this.repository.add({ message, type: 'warning', duration });
  }

  showError(message: string, duration?: number): void {
    this.repository.add({ message, type: 'error', duration });
  }

  showTransition(message: string, duration?: number): void {
    this.repository.add({ message, type: 'transition', duration });
  }

  dismiss(id: string): void {
    this.repository.remove(id);
  }

  getNotifications(): Notification[] {
    return this.repository.getAll();
  }
}
