export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'transition';
  duration?: number;
}

export interface NotificationRepository {
  add(notification: Omit<Notification, 'id'>): void;
  remove(id: string): void;
  getAll(): Notification[];
}
